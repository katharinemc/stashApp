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


module.exports = router;