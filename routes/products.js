'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');


console.log('I route!');

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

/* ========== POST ITEMS ========== */

router.post('/', (req, res, next) => {
  const {brand, name, shade, userId} = req.body;

  const obj = {
    brand,
    name, 
    shade, 
    userId
  };

//   "brand" :"maybelline",
//     "name" : "fancy product", 
//   "shade": "green",
//   "userId" : "5b07429cbdfaa3407e5be438"




  Product.create(obj)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});



module.exports = router;