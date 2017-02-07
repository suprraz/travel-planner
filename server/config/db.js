'use strict;'
//Include crypto to generate the movie id
var crypto = require('crypto');

module.exports = function() {
  return {
    gameList : [],
    /*
     * Save the game inside the "db".
     */
    save(game) {
      game.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
      this.gameList.push(game);
      return game;
    },
    /*
     * Retrieve a game with a given id or return all the games if the id is undefined.
     */
    find(id) {
      if(id) {
        return this.gameList.find(element => {
            return element.id === id;
        });
      }else {
        return this.gameList;
      }
    },
    /*
     * Delete a game with the given id.
     */
    remove(id) {
      var found = 0;
      this.gameList = this.gameList.filter(element => {
          if(element.id === id) {
        found = 1;
      }else {
        return element.id !== id;
      }
    });
      return found;
    },
    /*
     * Update a game with the given id
     */
    update(id, game) {
      var gameIndex = this.gameList.findIndex(element => {
          return element.id === id;
      });

      if(gameIndex !== -1) {
        this.gameList[gameIndex].progress = game.progress;
        this.gameList[gameIndex].mistakes = game.mistakes;
        return 1;
      }else {
        return 0;
      }
    }
  }
};