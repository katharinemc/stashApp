'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwtStrategy = require('../passport/jwt');
const User = require('../models/user');

const Look = require('../models/look');

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
      return  Look.find({userId})
        .populate('products'); })
    .then(results => {
      console.log(results[1]);
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
  
router.get('/:id', (req, res, next) => {
  const {id } =req.params;
  console.log('inside get by id', id);
  Look.findById({id})
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
  
  
/* ========== POST ITEMS ========== */
  
router.post('/', (req, res, next) => {
  const { name, products } = req.body;
  const username = req.user.username;
  let userId;

  console.log('post username', username)
  User.find({username})
    .then ( (results) => {
      return userId = results[0].id;
    })
    .then ( userId => {
      const obj = {
        userId, name, products
      };
      console.log('post', obj)

      return Look.create(obj); })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
  
/* ========== DELETE ITEMS ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.body;
  
  Look.findByIdAndRemove(id)
    .then (results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT ITEMS ========== */
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const {name} = req.body;
    
  const updateObj = {
    name
  };

  Look.findByIdAndUpdate(id, updateObj, {new: true})
    .then (results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
  
  


module.exports = router;