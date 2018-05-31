'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const options = {session: false, failWithError: true};

const { JWT_SECRET, JWT_EXPIRY} = require('../config');

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


  //TODO - COMBINE FIND REQUESTS
  return User.find({userEmail})
    .count()
    .then( count => {
      if (count > 0) {
        return Promise.reject({
          status: 422,
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
          status: 422,
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
      function createAuthToken (user) {
        return jwt.sign({ user }, JWT_SECRET, {
          subject: user.username,
          expiresIn: JWT_EXPIRY
        });
      }
      const authToken = createAuthToken({username});
      return res.json({authToken});
    })
    .then (res => console.log(res))
    .catch (err => {
      console.log('is this the err?', err);
      next(err);
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