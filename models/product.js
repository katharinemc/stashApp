'use strict';

const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
  name: { type: String,  required: true},
  brand: { type: String,  required: true  },
  category: {type: String, required: true },
  shade: { type: String },
  notes: { type: String },
  looksId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'productCollection'}],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

}, { timestamps: true });


productSchema.index({ name: 1, brand: 1, shade: 1, category: 1, userId: 1}, { unique: true });

productSchema.pre('save', function (next) {
  console.log('is the problem here? here');
  const query = {
    name: this.name,
    brand: this.brand,
    shade: this.shade,
    category: this.category,
    userId: this.userId
  };

  this.constructor.find(query)
    .then(result => {
      console.log('what is the result', result);
      if(result.length > 0)
      { const err = new Error('duplicate key error collection');
        err.status = 400;
     
        console.log('in find', err);
        next(err);
      } else {
        next();
      }
    })
    .catch((err) => {
      console.log('model error', err);
    });
});


productSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Product', productSchema);