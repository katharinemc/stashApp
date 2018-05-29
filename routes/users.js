'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

// ===== Define and create basicStrategy =====
const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User
    .findOne({ username })
    .then(results => {
      user = results;    
      
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username'
        });
      }    
    
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password'
        });
      }
      return done(null, user);    
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return done(null, false);
      }

      return done(err);

    });
});

passport.use(localStrategy);

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


// GET by ID //
router.get('/:id', (req, res, next) => {
  const {id } =req.params;
  User.findById(id)
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});


/* ========== POST ITEMS ========== */

router.post('/', (req, res, next) => {
  const { username, userEmail, password } = req.body;

  return User.find({userEmail})
    .count()
    .then( count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Email already in use',
          location: 'userEmail'
        });
      } 
      else {
        return User.find({username})
          .count();
      }})    
    .then( count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'username already in use',
          location: 'username'
        });}
      return User.hashPassword(password);
    })
    .then (digest => {
      return User.create( {
        username,
        password: digest,
        userEmail
      });
    })
    .then (user => {
      return res.status(201).json(user);
    });
    

});

/* ========== DELETE ITEMS ========== */
router.delete('/:id', (req, res, next) => {
  const { id } = req.body;

  User.findByIdAndRemove(id)
    .then (results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

const localAuth = passport.authenticate('local', { session: false });

// ===== Protected endpoint =====
router.post('/login', localAuth, function (req, res) {
  return res.json({ data: 'rosebud' });
}); 


module.exports = router;