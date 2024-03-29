var Game = require('./game.js');
var utils = require('./utils.js');
var Api = require('./api.js');
var pg = require('pg');

var debug = require('./debug.js');

/**
 Manages all of the games in memory
 takes in an API object that interfaces with DB for read and writes
 * @param {Api} api : an api object
 */
function GameManager(api) {
  this.io = api.io;
  this.db = api.db;
  this.cm;
  this.api = api;
  this.games = {};

  this.initialized = false;

}

GameManager.prototype = {
  setCampusManager : function(cm) {
    this.cm = cm;
  },
   
  /**
   * initiates all of the games in db
   * @param {socket} io : socket io object
   * @param {pg database} db : db to connect to
   */
  initGames : function() {

    this.api.getOpenGames(function(game_data) {
      for (var i = 0; i< game_data.length; i++) {
        var data = game_data[i];
         
        this.api.getDbState(data.id, function(state) {

          // reset passed in bind vars
          var data = this.data;

          data.stage = state.stage;
          data.state = state.state;
          data.turn = state.turn;

          // TODO save options in DB 
          this.gm.games[data.id] = new Game(this.gm, state, {});
        }.bind({
          data : data,
          gm : this
        }));
      }

    }.bind(this));
  },

  createGame : function(game_data, game_options) {
    debugger;
    var game = new Game(this, game_data, game_options);
    var id = game_data.id;
    this.games[id] = game;
    return game;
  },

  gameExists : function(id) {
  	return id in this.games;
  },
  
  getGame : function(id) {
    /*if(!(id in this.games)) {
      console.log("id is not in games");
      console.log(Object.keys(this.games));
      return undefined;
    }*/
    var ret = this.games[id];
    if (ret === undefined) {
      var e = new Error('getGame() called on invalid ID ' + id);
      throw e;
    }
    return ret;
  },
}

module.exports = GameManager;
