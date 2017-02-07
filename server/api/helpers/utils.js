'use strict;'

module.exports = function() {
  return {
    obfuscate(game) {
      return Object.assign({}, game, {word: undefined})
    }
  };
};