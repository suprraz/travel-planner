'use strict;'

module.exports = function() {
  return {
    obfuscate(user) {
      return Object.assign({}, user, {password: undefined})
    }
  };
};