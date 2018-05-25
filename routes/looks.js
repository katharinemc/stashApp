'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Look = require('../models/look');

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {

  Look.find()
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
  
router.get('/:id', (req, res, next) => {
  const {id } =req.params;
  Look.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});
  
  
/* ========== POST ITEMS ========== */
  
router.post('/', (req, res, next) => {
  const { name } = req.body;
  
  const obj = {
    name
  };
  
  Look.create(obj)
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