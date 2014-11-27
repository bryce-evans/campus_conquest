function Game(data, io, db) {

  this.id = data.id;
  this.io = io;
  this.db = db;

  this.stage = data.stage;

  // ordering of teams, e.g. [5,2,7,1]
  this.team_order = [];
  this.current_team_index = 0;

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
    console.log('joined game ' + this.id);

    if (!( team_id in this.teams)) {
      this.addTeam(team_id);
    }
    
    this.teams[team_id].push(socket);

    // handle selecting buildings
    socket.on('building click', function(move_data) {

      if (this.current_team_index != move_data.team_index) {
        return false;
      }

      console.log("game " + this.id + " update " + move_data.piece + " to team " + move_data.team_id);

      this.nextTeamIndex();
      this.turn++;

      var query_string = 'UPDATE "state"."' + this.id + '" SET team =\'' + move_data.team_index + '\', player =\'Bryce\' WHERE  piece_name = \'' + move_data.piece + '\'';

      this.db.query(query_string);
      var query_string = 'UPDATE global.games SET turn = ' + this.turn + ', cur_team = 1 WHERE id = \'test\'';

      this.db.query(query_string);

      move_data.current_team = this.current_team_index;
      move_data.turn = this.turn;
      move_data.stage = this.stage;

      this.io.to(this.id).emit('building click', move_data);

    }.bind(this));

  },
  nextTeamIndex : function() {
    this.current_team_index = (this.current_team_index + 1) % this.team_order.length;
    return this.current_team_index;
  },
}

module.exports = Game;
