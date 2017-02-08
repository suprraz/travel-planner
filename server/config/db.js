'use strict;'
//Include crypto to generate the movie id
var crypto = require('crypto');

module.exports = function() {
  return {
    users: {
      userList : [],
      /*
       * Save the user inside the "db".
       */
      save(user) {
        user.id = crypto.randomBytes(20).toString('hex'); // fast enough for our purpose
        this.userList.push(user);
        return user;
      },
      /*
       * Retrieve a user with a given id or return all the users if the id is undefined.
       */
      find(id) {
        if(id) {
          return this.userList.find(element => {
              return element.id === id;
          });
        }else {
          return this.userList;
        }
      },
      /*
       * Delete a user with the given id.
       */
      remove(id) {
        var found = 0;
        this.userList = this.userList.filter(element => {
            if(element.id === id) {
          found = 1;
        }else {
          return element.id !== id;
        }
      });
        return found;
      },
      /*
       * Update a user with the given id
       */
      update(id, user) {
        var userIndex = this.userList.findIndex(element => {
            return element.id === id;
        });

        if(userIndex !== -1) {
          this.userList[userIndex].progress = user.progress;
          this.userList[userIndex].mistakes = user.mistakes;
          return 1;
        }else {
          return 0;
        }
      }
    },
    schedules: {

    }
  }
};