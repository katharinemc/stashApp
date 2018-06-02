'use strict';

const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

const passport = require('passport');
const options = {session: false, failWithError: true};
const User = require('../models/user');

const { JWT_SECRET, JWT_EXPIRY} = require('../config');
const localAuth = passport.authenticate('local', options);


function createAuthToken (user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}

router.post('/login', localAuth, function (req, res) {
  let {id} =req.user;
  const authToken = createAuthToken(req.body);
  return res.json({authToken, id});
});
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = router;