'use strict';

const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, unique: true },
  brand: { type: String },
  shade: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });


//name, brand, shade keys must be unique
productSchema.index({ name: 1, userId: 1}, { unique: true });

productSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Product', productSchema);
