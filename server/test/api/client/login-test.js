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

describe('/login', function() {
  describe('post', function() {
    it('should respond with 200 Login was successful', function(done) {
      /*eslint-disable*/
      var schema = {
        "description": "a registered user",
        "required": [
          "username",
          "name"
        ],
        "properties": {
          "username": {
            "type": "string",
            "minLength": 4,
            "maxLength": 20,
            "pattern": "^\\w+$",
            "description": "username must be unique"
          },
          "password": {
            "type": "string",
            "minLength": 4,
            "description": "a super-secure, four-character password :)"
          },
          "name": {
            "type": "string",
            "minLength": 1,
            "description": "the users real name"
          }
        },
        "example": {
          "username": "jdoe",
          "name": "John Doe"
        }
      };

      /*eslint-enable*/
      request({
        url: 'http://localhost:10010/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        json: {
            "username": "suprraz",
            "password": "1234"
        }
      },
      function(error, res, body) {
        if (error) return done(error);

        expect(res.statusCode).to.equal(200);

        expect(validator.validate(body, schema)).to.be.true;
        done();
      });
    });

  });

});
