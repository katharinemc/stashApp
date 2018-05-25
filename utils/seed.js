'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Product = require('../models/product');
const User = require('../models/User');

const seedProducts = require('../db/seed/products');
const seedUsers = require('../db/seed/users');  

mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
     
      Product.insertMany(seedProducts),
    
      User.insertMany(seedUsers)


    //   Promise.all(seedUsers.map(user => {
    //     return User.hashPassword(user.password)
    //       .then(hash => {
    //         const newUser = {
    //           permid: user._id,
    //           username: user.username,
    //           password: hash,
    //           fullname: user.fullname
    //         };
    //         return User.create(newUser)
    //         .then ( () => {
    //           return User.createIndexes()
    //         })
    //       });})),

      
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });