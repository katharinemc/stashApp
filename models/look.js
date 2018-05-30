'use strict';

const mongoose = require('mongoose');

const lookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  products: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

lookSchema.index({ name: 1, userId: 1}, { unique: true });

lookSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Look', lookSchema);