'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const passport = require('passport');
const options = {session: false, failWithError: true};

const { JWT_SECRET, JWT_EXPIRY} = require('../config');
const localAuth = passport.authenticate('local', options);


function createAuthToken (user) {
  console.log('auth token', user);
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}



router.post('/login', localAuth, function (req, res) {
  console.log('welcome to auth');
  const authToken = createAuthToken(req.body);
  return res.json({authToken});
});

// function makeSandwich() {
//   // console.log('here is a sandwich', req);
//   console.log(localAuth('foobar'));
// }

module.exports = router;