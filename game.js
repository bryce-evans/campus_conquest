/*
 Requires a Game was already created with api.js and records exist in DB
 */
function Game(state, io, db) {

  this.id = state.id;
  this.io = io;
  this.db = db;

  this.stage = state.stage;

  // ordering of teams, e.g. ["eng","ilr", ...]
  this.team_order = state.team_order;
  this.current_team_index = state.current_team;

  // players[team_id] returns player socket list
  this.teams = {};
  this.turn = state.turn;
  this.state = state.state;

}

Game.prototype = {
  addTeam : function(id) {
    this.team_count += 1;
    this.teams[id] = [];
  },
  addPlayer : function(socket, team_id) {

    // subscribe the player to updates to the room

    socket.join(this.id);
    console.log('player joined game ' + this.id);

    if (!( team_id in this.teams)) {
      this.addTeam(team_id);
    }

    this.teams[team_id].push(socket);

    switch(this.stage) {
      case 'grab':
        this.addGrabListeners(socket, team_id);
        break;
      case 'reinforcement':
        this.addReinforcementListeners(socket, team_id);
        break;
      case 'orders':
        this.addOrdersListeners(socket, team_id);
        break;
    }
  },

  addGrabListeners : function(socket, team_id) {
    // handle selecting buildings
    socket.on('grab move', function(move_data) {

      if (this.current_team_index != move_data.team_index || this.state[move_data.piece].team != -1) {
        console.log('invalid move data', move_data);
        return false;
      }

      console.log("game " + this.id + " update " + move_data.piece + " to team " + move_data.team_id);

      this.nextTeamIndex();
      this.turn++;

      var query_string = 'UPDATE "state"."' + this.id + '" SET team =\'' + move_data.team_index + '\', player =\'Bryce\' WHERE  piece_name = \'' + move_data.piece + '\'';

      // update server  state
      this.state[move_data.piece].team = move_data.team_index;

      this.db.query(query_string);
      var query_string = 'UPDATE global.games SET turn = ' + this.turn + ', cur_team = ' + this.current_team_index + ' WHERE id = \'' + this.id + '\'';

      this.db.query(query_string);
      move_data.current_team = this.current_team_index;
      move_data.turn = this.turn;
      move_data.stage = this.stage;

      this.io.to(this.id).emit('grab update', move_data);
      this.db.query('SELECT EXISTS(SELECT 1 FROM state.' + this.id + ' WHERE -1=team)', function(err, result) {

        // END OF STAGE
        if (!result) {
          console.log(result);
          var query_string = 'UPDATE global.games SET stage = \'reinforcement\'WHERE id = \'' + this.id + '\'';

          this.db.query(query_string);
          this.io.to(this.id).emit('stage update', {
            stage : 'reinforcement',
            reinforcements : 20
          });
        }
      }.bind(this));
    }.bind(this));
  },
  addReinforcementListners : function(socket, team_id) {
    socket.on('reinforcement move', function(move_data) {
      console.log('received reinforcement move', move_data);
      this.io.to(this.id).emit('reinforcement update', move_data);
    }.bind(this));
  },
  addOrdersListners : function(socket, team_id) {
    console.log('TODO implement addOrdersListeners');
  },
  nextTeamIndex : function() {
    this.current_team_index = (this.current_team_index + 1) % this.team_order.length;
    return this.current_team_index;
  },
}

module.exports = Game;
