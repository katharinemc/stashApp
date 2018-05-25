'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  userName: { type: String,  required: true,  unique: true },
  // userEmail: { type: String,  required: true,  unique: true },
  // password: { type: String,  required: true,  unique: true }
}, { timestamps: true });


userSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('User', userSchema);
