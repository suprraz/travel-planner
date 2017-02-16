'use strict';
var chai = require('chai');
var request = require('request');
var expect = chai.expect;

describe('/logout', function() {
  describe('get', function() {
    it('should respond with 204 Logout was successful', function(done) {
      request({
        url: 'http://localhost:10010/logout',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'DATA GOES HERE'
        },
        session: {
          destroy: function(){}
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(204);

        expect(body).to.equal(null); // non-json response or no schema
        done();
      });
    });

  });

});
