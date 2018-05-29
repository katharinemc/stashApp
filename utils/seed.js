'use strict';

const mongoose = require('mongoose');

const { MONGODB_URI } = require('../config');
const Product = require('../models/product');
const User = require('../models/user');
const Look = require('../models/look');

const seedProducts = require('../db/seed/products');
const seedUsers = require('../db/seed/users');  

const seedLooks = require('../db/seed/looks');  

mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    console.log(seedProducts);
    return Promise.all([
   
      Product.insertMany(seedProducts),
      Look.insertMany(seedLooks),    

      Promise.all(seedUsers.map(user => {
        console.log(user._id);
        return User.hashPassword(user.password)
          .then(hash => {
            const newUser = {
              _id: user._id,
              username: user.username,
              password: hash,
              userEmail: user.userEmail
            };
            console.log(newUser);
            return User.insertMany(newUser);
              // .then ( () => {
              //   return User.createIndexes();
              // });
          });})),

      
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });
