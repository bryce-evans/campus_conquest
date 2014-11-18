function Game(id, io, db) {
  this.id = id;
  this.io = io;
  this.db = db;

  this.stage = 'start';
  this.teams_turn = 1;
  this.team_count = 0;

  // players[team_id] returns player list
  this.players = {};
}

Game.prototype = {
  addTeam : function(team_data) {

  },
  addPlayer : function(team_id) {
  },
  move : function(data) {
    var team = data.team;
    var piece = data.piece;
  },

  // gets the current state and runs callback(state) when done
  getState : function(callback) {
    var query_string = 'SELECT * FROM "state"."' + this.id + '"';
    this.db.query(query_string, function(err, result) {
      if (err) {
        var ret = {
          status : 500
        };
      } else {
        var ret = {
          status : 200
        };
        ret.state = {};
        for (var i = 0; i < result.rows.length; i++) {
          var piece = result.rows[i];
          ret.state[piece.piece_name] = {
            team : piece.team
          }
        }
      }
      callback(ret);
    });

  },
}

module.exports = Game;
