

'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_MONGODB_URI } = require('../config');

const { JWT_SECRET} = require('../config');


const User = require('../models/user');
const seedUsers = require('../db/seed/users');

const Product = require('../models/product');
const seedProducts = require('../db/seed/products');

const expect = chai.expect;

chai.use(chaiHttp);

describe('StashApp',  function () {
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI)
      .then(() => mongoose.connection.db.dropDatabase());
  });
  let token; 
  let user;
  
  beforeEach(function () {
    return Promise.all(seedUsers.map(user => User.hashPassword(user.password)))
      .then(digests => {
        seedUsers.forEach((user, i) => user.password = digests[i]);
        return Promise.all([
          User.insertMany(seedUsers),
          Product.insertMany(seedProducts),
          Product.createIndexes(),

        ]);
      })
      .then(([users]) => {

        user = users[0];
        return token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/Products', function () {

    it('should return the correct number of Products', function () {

      const dbPromise = Product.find({userId: user.id});
      const apiPromise = chai.request(app)
        .get('/api/Products')
        .set('Authorization', `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => { 
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });
 

  describe('GET /api/Products/:id', function () {

    it('should return correct Product', function () {
      let data;
      return Product.findOne({userId: user.id})
        .then(_data => {
          data = _data;
          return chai.request(app).get(`/api/Products/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;

          expect(res.body).to.be.an('object');
          
          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(data.name);
          });
    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {

      return chai.request(app)
        .get('/api/Products/INVALID')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });

    it('should respond with a 404 for an invalid id', function () {

      return chai.request(app)
        .get('/api/Products/AAAAAAAAAAAAAAAAAAAAAAAA')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

  });

  describe('POST /api/Products', function () {

    it('should create and return a new item when provided valid data', function () {
      const newItem = {
        'brand': 'Borjous',
        'name': 'a makeup',
        'categpry': 'lipliner'
      };
      let res;
      return chai.request(app)
        .post('/api/Products')
        .set('Authorization', `Bearer ${token}`)
        .send(newItem)
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(201);
          expect(res).to.have.header('location');
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          return Product.findById(res.body.id);
        })
        .then(data => {
          expect(res.body.brand).to.equal(data.brand);
        });
    });

  });

  describe('PUT /api/Products/:id', function () {

    it('should update the Product when provided proper valid data', function () {
      const updateItem = {
        'brand': 'Wnew brand!',
        'name': 'woof '
      };
      let data;
      return Product.findOne({userId: user.id})
        .then(_data => {
          data = _data;
          return chai.request(app)
            .put(`/api/Products/${data.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateItem);
        })
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');

          expect(res.body.id).to.equal(data.id);
          expect(res.body.name).to.equal(updateItem.name);
        });
    });


    it('should respond with status 400 and an error message when `id` is not valid', function () {
      const updateItem = {
        'brand': 'What about dogs?!',
        'name': 'woof woof'
      };

      return chai.request(app)
        .put('/api/Products/INVALID')
        .set('Authorization', `Bearer ${token}`)
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.eq('The `id` is not valid');
        });
    });

    it('should respond with a 404 for an invalid id', function () {
      const updateItem = {
        'brand': 'What about dogs?!',
        'name': 'woof woof'
      };

      return chai.request(app)
        .put('/api/Products/AAAAAAAAAAAAAAAAAAAAAAAA')
        .set('Authorization', `Bearer ${token}`)
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(404);
        });
    });

    it('should respond with status 400 and an error message when `id` is not valid', function () {
      const updateItem = {};
      return chai.request(app)
        .put('/api/Products/INVALID')
        .set('Authorization', `Bearer ${token}`)
        .send(updateItem)
        .then(res => {
          expect(res).to.have.status(400);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('The `id` is not valid');
        });
    });

  });

  describe('DELETE /api/Products/:id', function () {

    it('should delete an existing document and respond with 204', function () {
      let data;
      return Product.findOne({userId: user.id})
        .then(_data => {
          data = _data;
          return chai.request(app).delete(`/api/Products/${data.id}`)
            .set('Authorization', `Bearer ${token}`);
        })
        .then(function (res) {
          expect(res).to.have.status(204);
          return Product.count({ _id: data.id });
        })
        .then(count => {
          expect(count).to.equal(0);
        });
    });

    it('should respond with 404 when document does not exist', function () {
      return chai.request(app).delete('/api/Products/DOESProductXIST')
        .set('Authorization', `Bearer ${token}`)
        .then((res) => {
          expect(res).to.have.status(204);
        });
    });

  });

});
