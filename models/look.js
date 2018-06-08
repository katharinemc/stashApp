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

lookSchema.pre('save', function (next) {
  const query = {
    name: this.name,
    userId: this.userId
  };

  this.constructor.find(query)
    .then(result => {
      if(result.length > 0)
      {      const err = new Error('duplicate key error collection');
        err.status = 400;
     
        next(err);
      } next();    })
    .catch((err) => {
      next(err); 
    });
});


module.exports = mongoose.model('Look', lookSchema);