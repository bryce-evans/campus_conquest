/*
 Requires a Game was already created with api.js and records exist in DB
 */

var api = require('./api.js');
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
  
  // list of all socket clients in the game
  this.clients = [];

  // all move data for this turn
  // gets built as players contribute their moves
  this.all_move_data = [];
}

Game.prototype = {
  addTeam : function(id) {
    this.team_count += 1;
    this.teams[id] = [];
  },
  addPlayer : function(socket, team_id) {

    // subscribe the player to updates to the room

    socket.join(this.id);
    this.clients.push(socket);
    console.log('player joined game ' + this.id);

    if (!( team_id in this.teams)) {
      this.addTeam(team_id);
    }

    this.teams[team_id].push(socket);

    console.log('player entering stage ' + this.stage);

    switch(this.stage) {
      case 'grab':
        this.initGrabStage(socket);
        break;
      case 'reinforcement':
        this.initReinforcementStage(socket);
        break;
      case 'orders':
        this.initOrdersStage(socket);
        break;
    }
  },

  initGrabStage : function(socket) {

    // handle selecting buildings
    socket.on('grab move', function(move_data) {
      console.log('recieved grab move', move_data);
      this.handleGrabMove(socket, move_data);
    }.bind(this));
  },
  initReinforcementStage : function(socket) {

    console.log('initReinforcementStage() called');
    this.printDebugInfo(socket);
    socket.on('reinforcement move', function(move_data) {
      console.log('received reinforcement move', move_data);
      this.handleReinforcementMove(socket, move_data);
    }.bind(this));
  },
  initOrdersStage : function(socket) {
    console.log('initOrdersStage() called');

    this.printDebugInfo(socket);

    socket.on('orders move', function(move_data) {
      console.log('received orders move', move_data);
      this.handleOrdersMove(socket, move_data);
    }.bind(this));
  },
  handleGrabMove : function(socket, move_data) {
  if (this.current_team_index != move_data.team_index || this.state[move_data.piece].team != -1) {
      console.log('invalid move data');
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

    this.db.query(query_string, function(err,results){
    move_data.current_team = this.current_team_index;
    move_data.turn = this.turn;
    move_data.stage = this.stage;

    this.io.to(this.id).emit('grab update', move_data);
    this.db.query('SELECT EXISTS(SELECT 1 FROM state.' + this.id + ' WHERE -1=team)', function(err, result) {

      // END OF STAGE
      // this accesses the "FALSE" var in results if no rows found
      if (!result.rows[0]['?column?']) {
        console.log(result);
        var query_string = 'UPDATE global.games SET stage = \'reinforcement\'WHERE id = \'' + this.id + '\'';

        this.db.query(query_string);
        this.io.to(this.id).emit('stage update', {
          stage : 'reinforcement',
          reinforcements : 20
        });
//  update all client sockets 
        for(var i = 0; i< this.clients.length; i++){
        var socket = this.clients[i];
        socket.removeAllListeners('grab move');
          this.initReinforcementStage(socket);
        
        }


      }
      }.bind(this));
    }.bind(this));
  },
  handleReinforcementMove : function(socket, move_data) {
    var team = move_data.meta.team_index;
    var coms = move_data.commands;

    //var reinforcements_remaining = api.getReinforcementsFromState(this.state,team);
    // XXX TODO remove later,only temp
    var reinforcements_remaining = 3;

    for (var i = 0; i < coms.length; i++) {
      var com = coms[i];
      var piece = this.state[com.id];

      // make sure you own the piece and have enough to add
      if (piece.team === team && reinforcements_remaining - com.units >= 0) {
        piece.units += com.units;
        reinforcements_remaining -= com.units;

        this.db.query('UPDATE state."' + this.id + '" SET units=' + piece.units + ' WHERE piece_name=\'' + coms[i].id + '\'', function(err, result) {
          if (err) {
            console.error('ERROR cannot update state in initReinforcementStage()');
          }
        });
      }
    }
    this.db.query('UPDATE teams."' + this.id + '" SET waiting_on=FALSE WHERE id=\'' + move_data.meta.team + '\'', function(err, result) {

      if (err) {
        console.error('ERR GAME.JS UPDATING WAITING_ON');
      }

      // append validated moves
      this.all_move_data = this.all_move_data.concat(move_data.commands);

      // who are we waiting on still?
      this.db.query('SELECT index FROM teams."' + this.id + '" WHERE waiting_on=TRUE', function(err, result) {

        if (err) {
          console.error('ERROR: query checking teams still waiting on returned error')
        }

        // someone left
        if (result.rows.length > 0) {
          var waiting_on = new Array(result.rows.length);
          for (var i = 0; i < result.rows.length; i++) {
            waiting_on[i] = result.rows[i].index;
          }
          console.log('still waiting on:', waiting_on);

          this.io.to(this.id).emit('waiting-on update', waiting_on);

          // no one remaining
          // only runs once on last player to move
        } else {
          console.log('no one is left!!', this.all_move_data);
          this.io.to(this.id).emit('reinforcement update', this.all_move_data);
          this.all_move_data = [];

          // set to orders stage
          this.db.query('UPDATE global.games SET stage = \'orders\'WHERE id = \'' + this.id + '\'', function(err, result) {
            if (err) {
              console.error('ERROR: cannot switch to orders stage');
            }
            this.stage = 'orders';
          }.bind(this));

          //reset waiting_on list
          this.db.query('UPDATE teams.' + this.id + ' SET waiting_on=TRUE', function(err, result) {
            if (err) {
              console.error('ERROR could not reset waiting_on=TRUE in initOrdersStage')
            }
          });
// update all clients to same state
         for(var i = 0; i < this.clients.length; i++){
            var socket = this.clients[i];
          socket.removeAllListeners('reinforcement move');
          this.initOrdersStage(socket);
          }
        }
      }.bind(this));
    }.bind(this));
  },
  handleOrdersMove : function(socket, move_data) {
    var team_index = move_data.team_index;

    // check move is valid
    for (var start in move_data.commands) {
      var total = 0;
      for (var end in move_data.commands[start]) {
        total += move_data.commands[start][end];
      }

      // invalid move
      if (total >= this.state[start]) {
        console.log('INVALID MOVE, (total sent, total possible)', total, this.state[start]);
        return;
      }
    }

    this.all_move_data[move_data.team_index] = move_data.commands;
    console.log('all_move_data updated:',this.all_move_data);
    // mark as moved
    this.db.query('UPDATE teams."' + this.id + '" SET waiting_on=FALSE WHERE id=\'' + move_data.team_id + '\'', function(err, result) {

      if (err) {
        console.error('ERR GAME.JS UPDATING WAITING_ON');
      }

      // who are we waiting on still?
      this.db.query('SELECT index FROM teams."' + this.id + '" WHERE waiting_on=TRUE', function(err, result) {

        if (err) {
          console.error('ERROR: query checking teams still waiting on returned error')
        }

        // someone left
        if (result.rows.length > 0) {
          var waiting_on = new Array(result.rows.length);
          for (var i = 0; i < result.rows.length; i++) {
            waiting_on[i] = result.rows[i].index;
          }
          console.log('still waiting on:', waiting_on);

          this.io.to(this.id).emit('waiting-on update', waiting_on);

          // no one left
        // only runs on last player to move
        } else {
          console.log('no one is left!!', this.all_move_data);
          this.io.to(this.id).emit('orders update', this.all_move_data);
          this.all_move_data = [];

          // set up for reinforcement  stage
          // XXX RET
          this.db.query('UPDATE global.games SET stage = \'reinforcement\' WHERE id = \'' + this.id + '\'', function(err, result) {
            if (err) {
              console.log('ERROR: cannot switch to reinforcement stage');
            }

            this.stage = 'reinforcement';
          }.bind(this));

          //reset waiting_on list
          this.db.query('UPDATE teams.' + this.id + ' SET waiting_on=TRUE', function(err, result) {
            if (err) {
              console.error('ERROR could not reset waiting_on=TRUE in initOrdersStage')
            }
          });

//  update all client sockets 
        for(var i = 0; i< this.clients.length; i++){
        var socket = this.clients[i];
        socket.removeAllListeners('orders move');
          this.initReinforcementStage(socket);
        }
        }

      }.bind(this));
    }.bind(this));
  },
  nextTeamIndex : function() {
    this.current_team_index = (this.current_team_index + 1) % this.team_order.length;
    return this.current_team_index;
  },
  removeClientFromActive : function(socket){
     var index = this.clients.indexOf(socket);
     
        if (index > -1) {
            this.clients.splice(index, 1);
            }
            else{
console.error('ERROR. could not remove player' + socket.id);
            }
        
        
  },
  printDebugInfo : function(socket) {
    console.log('================================ Debug Info');
    var client_ids = new Array(this.clients.length);
    for(var i = 0; i<this.clients.length; i++){
      client_ids[i] = this.clients[i].id;
    }
    var out = {
      stage : this.stage,
      all_move_data : this.all_move_data,
      clients : client_ids,
    }
    if(socket){out.socket_id = socket.id;}
    console.log(out);
    console.log('===========================================');
  },
}

module.exports = Game;
