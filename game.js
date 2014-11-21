function Game(data, io, db) {

  this.id = data.id;
  this.io = io;
  this.db = db;

  this.stage = data.stage;

  // ordering of teams, e.g. [5,2,7,1]
  this.team_order = [];
  this.turn_index = 0;
  this.team_count = 0;  

  // players[team_id] returns player socket list
  this.teams = {};
  this.turn = data.turn;
  this.state = data.state;
}

Game.prototype = {
  addTeam : function(id) {
      this.team_count += 1;
      this.teams[id] = [];
  },
  addPlayer : function(socket, team_id) {
  
// subscribe the player to updates to the room
  
  socket.join(this.id);

  if(!(team_id in this.teams)){
    this.addTeam(team_id);
  }
  this.teams[team_id].push(socket);

 // handle selecting buildings
  socket.on('building click', function(move_data) {

    console.log("game " + this.id + " update " + move_data.piece + " to team " + move_data.team);

    this.db.query('select exists(select true from "state"."'+this.id+'" where piece_name=\'' + move_data.piece + '\')', function(err, result) {

      if (result.rows[0]["?column?"]) {
        var query_string = 'UPDATE "state"."'+this.id+'" SET team =\'' + move_data.team + '\', player =\'Bryce\' WHERE  piece_name = \'' + move_data.piece + '\'';
      } else {
        var query_string = 'INSERT INTO "state"."'+this.id+'"(piece_name, team, player) VALUES (\'' + move_data.piece + '\',' + move_data.team + ',\'Bryce\')';
      }

      this.db.query(query_string);

    }.bind(this));

    this.io.to(this.id).emit('building click', move_data);
  }.bind(this));

  },
  move : function(data) {
    var team = data.team;
    var piece = data.piece;
    if(this.team_order[this.turn_index] != team){
      return false;
    } 
    this.turn_index = (this.turn_index + 1) % this.team_count;
    
  },

  

}

module.exports = Game;
