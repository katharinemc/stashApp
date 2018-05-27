'use strict';

const express = require('express');
const router = express.Router();
const Product = require('../models/product');


/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  Product.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/:id', (req, res, next) => {
  const {id } =req.params;
  Product.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST ITEMS ========== */

router.post('/', (req, res, next) => {
  const {brand, name, shade, category, userId} = req.body;

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
  const updateObj = {
    brand,
    name,
    category, 
    shade, 
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

  Product.findByIdAndRemove(id)
    .then (results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


module.exports = router;