'use strict';
// Include our "db"
var db = require('../../config/db')();
var utils = require('../helpers/utils')();
var words = require("an-array-of-english-words");

// Exports all the functions to perform on the db
module.exports = {getAll, save, getOne, update, delGame};

//GET /game operationId
function getAll(req, res, next) {
  res.json({ games: db.find()});
}
//POST /game operationId
function save(req, res, next) {
  var randomWord = words[Math.floor(Math.random()*words.length)];

  // randomWord = "cartoon";  //uncomment this to overwrite the word
  console.log("Word to guess is : " + randomWord);

  var game =  db.save({
      word: randomWord,
      progress: randomWord.replace(/[a-zA-Z]/g, "_"),
      mistakes: 0
  });

  res.json({success: 1, game: utils.obfuscate(game), description: "Game added to the list!"});
}
//GET /game/{id} operationId
function getOne(req, res, next) {
  var id = req.swagger.params.id.value; //req.swagger contains the path parameters
  var game = db.find(id);
  if(game) {
    res.json(utils.obfuscate(game));
  }else {
    res.status(204).send();
  }
}
//PUT /game/{id} operationId
function update(req, res, next) {
  var id = req.swagger.params.id.value; //req.swagger contains the path parameters
  var guess = req.body;

  var gameRef = db.find(id);
  if(!gameRef) {
    return res.status(404).send();
  }
  console.log(gameRef);
  var game = Object.assign({}, gameRef);

  if(guess.word) {
    //solving the puzzle

    if(guess.word === game.word) {
      game.progress = game.word;
    } else {
      game.mistakes++;
    }

  } else if (guess.letter) {
    // guessing a letter

    var foundLetter = false;

    for(var i = 0; i < game.word.length; i++) {
      if(game.word[i] === guess.letter) {
        game.progress = game.progress.substr(0,i) + guess.letter + game.progress.substr(i+1);
        foundLetter = true;
      }
    }

    if(!foundLetter) {
      game.mistakes++;
    }
  }

  if(db.update(id, game)){
    res.json({success: 1, game: utils.obfuscate(game), description: "Game updated!"});
  }else{
    res.status(204).send();
  }
}
//DELETE /game/{id} operationId
function delGame(req, res, next) {
  var id = req.swagger.params.id.value; //req.swagger contains the path parameters
  if(db.remove(id)){
    res.json({success: 1, description: "Game deleted!"});
  }else{
    res.status(204).send();
  }

}