'use strict';

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const passport = require('passport');
const jwtStrategy = require('../passport/jwt');
const User = require('../models/user');


router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  const username = req.user.username;
  let filter ={username};
  let userId;
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

router.get('/:id', (req, res, next) => {
  const {id } =req.params;
  const username = req.user.username;
  let userId;
  User.find({username})
    .then ( (results) => {
      return userId = results[0].id;
    })
    .then ( userId => {
      return Product.findOne({ _id: id, userId}); })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

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
(req.params, req.user);
  const { id } = req.params;
  const username = req.user.username;
  let userId;

  User.find({username})
    .then ( (results) => {
      return userId = results[0].id;
    })
    .then ( userId => {
      return  Product.findOneAndRemove({_id:id, userId});})
    .then ( (results) => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;