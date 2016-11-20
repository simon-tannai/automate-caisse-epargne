'use strict';

const supertest 	= require('supertest');
const should    	= require('chai').should();
const fs        	= require('fs');

describe('userController unit tests', () => {
  let server;

  // Before tests
  before(() => {
    // Start Node.js server
    server = require(__dirname + '/../server.js', { bustCache: true });
  });

  // After tests
  after(() =>
    // Stop Node.js server
    server.close();
  });

  it('Get JSON datas and should return 200', (done) => {
    supertest(server)
    .get('/api')
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if(err) {
        throw err;
      }

      done();
    });
  });

  it('Post JSON datas and should return 200', (done) => {
    supertest(server)
    .post('/api')
    .send({
      'datas': {
        'someKey': 'someValue'
      }
    })
    .set('Accept', /application\/json/)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      if(err) {
        return done(new Error(err + ' - ' + res.error.text));
      }

      return done();
    });
  });

  it('Delete datas, should return 200 and value 1', (done) => {
    supertest(server)
    .delete('/api')
    .send({
      'someKey':'someValue'
    })
    .set('Accept', /application\/json/)
    .expect(200)
    .end((err, res) => {
      if(err) {
        return done(new Error(err + ' - ' + res.error.text));
      }
      else if(parseInt(res.body) !== 1) {
        return done(new Error('DELETE /user must return 1, ' + parseInt(res.body) + ' returned'));
      }
      else {
        return done();
      }
    });
  });
})
