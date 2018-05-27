'use strict';

const bcrypt  = require ('bcryptjs');

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: { type: String,  required: true,  unique: true },
  userEmail: { type: String,  required: true,  unique: true },
  password: { type: String,  required: true }
}, { timestamps: true });


userSchema.methods.validatePassword = function (password) {
  return password === this.password;
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };
  

userSchema.statics.hashPassword = function(password){
  return bcrypt.hash(password,10);
};

userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('User', userSchema);
