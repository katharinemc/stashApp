'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwtStrategy = require('../passport/jwt');
const User = require('../models/user');

const Look = require('../models/look');

router.get('/:id', (req, res, next) => {
  const username = req.params.id;
  let filter = {};

  const {name, products} = req.query;

  name !== undefined
    ? filter.name = name
    : '';

  User
    .find({username})
    .then((results) => {
      return filter.userId = results[0].id;
    })
    .then(userId => {  
      Look
        .find(filter)
        .populate('products')
        .then(results => {
          res.json(results);
        })
        .catch(err => {
          next(err);
        });
    });

});

router.use('/', passport.authenticate('jwt', {
  session: false,
  failWithError: true
}));

/* ========== GET/READ ALL ITEMS ========== */
router.get('/', (req, res, next) => {
  const username = req.user.username;
  let filter = {
    username
  };
  let userId;
  User
    .find({username})
    .then((results) => {
      return userId = results[0].id;
    })
    .then(userId => {
      return Look
        .find({userId})
        .populate('products');
    })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== POST ITEMS ========== */

router.post('/', (req, res, next) => {
  const {name, products} = req.body;
  const username = req.user.username;
  let userId;

  User
    .find({username})
    .then((results) => {
      return userId = results[0].id;
    })
    .then(userId => {
      const obj = {
        userId,
        name,
        products
      };

      return Look.create(obj);
    })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

/* ========== DELETE ITEMS ========== */
router.delete('/:id', (req, res, next) => {
  const {id} = req.body;
  const username = req.user.username;
  let userId;

  User
    .find({username})
    .then((results) => {
      return userId = results[0].id;
    })
    .then(userId => {
      return Look.findOneAndRemove({_id: id, userId});
    })
    .then(results => {
      res
        .status(204)
        .end();
    })
    .catch(err => {
      next(err);
    });
});

/* ========== PUT ITEMS ========== */
router.put('/:id', (req, res, next) => {
  const {id} = req.params;
  const {name, productIds} = req.body;
  const username = req.user.username;

  let userId;

  User
    .find({username})
    .then((results) => {
      return userId = results[0].id;
    })
    .then(userId => {
      const updateObj = {
        name,
        products: productIds,
        userId
      };
      return Look
        .findByIdAndUpdate(id, updateObj, {new: true})
        .populate('products');
    })
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;