'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const passport = require('passport');
const options = {session: false, failWithError: true};

const localAuth = passport.authenticate('local', options);
const { JWT_SECRET, JWT_EXPIRY} = require('../config');


function createAuthToken (user) {
  console.log('auth token', user);
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.userName,
    expiresIn: JWT_EXPIRY
  });
}


router.post('/login', function (req, res) {
  console.log('welcome to auth', req);
  const authToken = createAuthToken(req.body);
  console.log(authToken);
  return res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;