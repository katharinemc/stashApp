'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');


console.log('I route!');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  User.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST ITEMS ========== */

router.post('/', (req, res, next) => {
  const {userName} = req.body;

  const obj = {
userName
  };






  User.create(obj)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});



module.exports = router;