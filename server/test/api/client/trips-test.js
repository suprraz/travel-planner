'use strict';
var chai = require('chai');
var ZSchema = require('z-schema');
var customFormats = module.exports = function(zSchema) {
  // Placeholder file for all custom-formats in known to swagger.json
  // as found on
  // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

  var decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

  /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
  zSchema.registerFormat('double', function(val) {
    return !decimalPattern.test(val.toString());
  });

  /** Validates value is a 32bit integer */
  zSchema.registerFormat('int32', function(val) {
    // the 32bit shift (>>) truncates any bits beyond max of 32
    return Number.isInteger(val) && ((val >> 0) === val);
  });

  zSchema.registerFormat('int64', function(val) {
    return Number.isInteger(val);
  });

  zSchema.registerFormat('float', function(val) {
    // should parse
    return Number.isInteger(val);
  });

  zSchema.registerFormat('date', function(val) {
    // should parse a a date
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('dateTime', function(val) {
    return !isNaN(Date.parse(val));
  });

  zSchema.registerFormat('password', function(val) {
    // should parse as a string
    return typeof val === 'string';
  });
};

customFormats(ZSchema);

var validator = new ZSchema({});
var request = require('request');
var expect = chai.expect;

describe('/trips', function() {
  describe('get', function() {
    it('should respond with 200 Returns the list of trips', function(done) {
      /*eslint-disable*/
      var schema = {

      };

      /*eslint-enable*/
      request({
        url: 'http://localhost:10010/trips',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'username=unit_user;'
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(200);

        expect(validator.validate(body, schema)).to.be.true;
        done();
      });
    });

    it('should respond with 401 You do not have access to...', function(done) {
      request({
        url: 'http://localhost:10010/trips',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'DATA GOES HERE'
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(401);

        expect(body).to.equal('You must be logged in to do that.'); // non-json response or no schema
        done();
      });
    });

  });

  describe('post', function() {
    it('should respond with 400 Bad JSON formatting in the...', function(done) {
      request({
        url: 'http://localhost:10010/trips',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'username=unit_user;'
        },
        json: {
          body: 'DATA GOES HERE'
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(400);
        done();
      });
    });

  });

});
