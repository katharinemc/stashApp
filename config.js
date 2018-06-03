'use strict';

exports.PORT = process.env.PORT || 8080;

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000',
// exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || ' https://objective-stonebraker-c8501a.netlify.com',


exports.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/stashApp';

exports.TEST_MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost/stashApp-test';

exports.JWT_SECRET = 'bananrama';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '1d';
