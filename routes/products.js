'use strict';

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const passport = require('passport');
const jwtStrategy = require('../passport/jwt');
const User = require('../models/user');
const Look = require('../models/look');

router.get('/:id', (req, res, next) => {
  const username  =req.params.id;
  let userId;
  const {brand, _id, category, shade, name} = req.query;
  let filter = {};
 
  console.log('server query is', req.query, 'user is', req.user);

  brand !== undefined ? filter.brand = brand : '';
  category !== undefined ? filter.category = category : '';
  shade !== undefined ? filter.shade = shade : '';
  name !== undefined ? filter.name = name : '';
  _id !== undefined ? filter._id = _id : '';

  
  User.find({username})
    .then ( (results) => {
      return filter.userId = results[0].id;
    })
    .then ( userId => {
      return Product.find(filter); })
    .then(results => {
      // console.log('final server resonse', results);
      return   res.json(results);
    })
    .catch(err => {
      err.status = 404;
    
      console.log('gotcha!', err);
      next(err);
    });
});


router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const username = req.user.username;
  let filter ={username};
  let userId;

  console.log('in GET', req.body, req.params);

  User.find({username})
    .then ( (results) => {
      return userId = results[0].id;
    })
    .then ( userId => {
      return Product.find({userId});
    })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

// router.get('/:id', (req, res, next) => {
//   const {id } =req.params;
//   const username = req.user.username;
//   let userId;
//   User.find({username})
//     .then ( (results) => {
//       return userId = results[0].id;
//     })
//     .then ( userId => {
//       return Product.findOne({ _id: id, userId}); })
//     .then(results => {
//       res.json(results);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

/* ========== POST ITEMS ========== */

router.post('/', (req, res, next) => {
  const {brand, name, shade, username, category} = req.body;
  let userId;


  User.find({username:req.user.username})
    .then ( (results) => {
      return userId = results[0].id;
    }) 
    .then ((userId) => {
      const obj = {
        brand,
        name,
        category, 
        shade, 
        userId
      };
      return   Product.create(obj);

    })
    .then(results => {
      return res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== UPDATE ITEMS ========== */
router.put('/:id', (req, res, next) => {
  const {brand, name, shade, category} = req.body;
  const { id } = req.params;
  const userId = req.user.id;
  const updateObj = {
    brand,
    name,
    category, 
    shade, 
    userId
  };

  Product.findByIdAndUpdate(id, updateObj, {new: true})
    .then (results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });

});

/* ========== DELETE ITEMS ========== */
router.delete('/:id', (req, res, next) => {
  console.log('query/product id is', req.params.id);

  const userId = req.user.id;
  console.log('userId is', userId, 'req.user is', req.user);
  let filter = {
    userId,
    _id: req.params.id
  };

  return Product.find(filter)
    .then(res => {      
      return Promise.all(
        res[0].looksId.map(lookId => {
            console.log('look id is',  {_id: res[0]._id }, 'oir', {id: res[0]._id } );
            return Look.findOneAndUpdate({_id:lookId, userId:filter.userId}, {$pull: {products: res[0]._id  } });
        })
    );
    })

    .then ( results => {
      console.log('here are results from update', results);
      return  Product.findOneAndRemove(filter)      
    })
    .then ( results => {
      
      console.log('here are results from remove', results);

      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;