'use strict';

const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const passport = require('passport');


router.use('/', passport.authenticate('jwt', { session: false, failWithError: true }));


/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const userId = req.user.id;

  let filter ={ userId};

  Product.find(filter)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const {id } =req.params;
  const userId = req.user.id;

  Product.findOne({ _id: id, userId })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST ITEMS ========== */

router.post('/', (req, res, next) => {
  const {brand, name, shade, category} = req.body;
  const userId = req.user.id;
  const obj = {
    brand,
    name,
    category, 
    shade, 
    userId
  };

  Product.create(obj)
    .then(results => {
      res.json(results);
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
  const { id } = req.body;
  const userId = req.user.id;

  Product.findOneAndRemove({_id:id, userId})
    .then (results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;