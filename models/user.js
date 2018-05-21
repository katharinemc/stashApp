'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: { type: String,  required: true,  unique: true },
  userEmail: { type: String,  required: true,  unique: true },
  password: { type: String,  required: true,  unique: true }
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
