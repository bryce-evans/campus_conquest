function Game(id, io, db) {
  this.id = id;
  this.io = io;
  this.db = db;

  this.stage = 'start';

  // ordering of teams, e.g. [5,2,7,1]
  this.team_order = [];
  this.turn_index = 0;
  this.team_count = 0;  

  // players[team_id] returns player socket list
  this.teams = {};
 
}

Game.prototype = {
  addTeam : function(id) {
      this.team_count += 1;
      this.teams[id] = [];
  },
  addPlayer : function(socket, team_id) {
  
  socket.join(this.id);

  if(!(team_id in this.teams)){
    this.addTeam(team_id);
  }
  this.teams[team_id].push(socket);

     // handle global messages
  socket.on('global message', function(msg) {
    console.log('recieved message:' + msg);
    this.io.emit('global message', msg);
  }.bind(this));

  // handle selecting buildings
  socket.on('building click', function(move_data) {

    console.log("update " + move_data.piece + " to team " + move_data.team);

    this.db.query('select exists(select true from "state"."'+this.id+'" where piece_name=\'' + move_data.piece + '\')', function(err, result) {

      if (result.rows[0]["?column?"]) {
        var query_string = 'UPDATE "state"."test" SET team =\'' + move_data.team + '\', player =\'Bryce\' WHERE  piece_name = \'' + move_data.piece + '\'';
      } else {
        var query_string = 'INSERT INTO "state"."test"(piece_name, team, player) VALUES (\'' + move_data.piece + '\',' + move_data.team + ',\'Bryce\')';
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
