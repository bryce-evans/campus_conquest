/*
 Requires a Game was already created with api.js and records exist in DB
 */

var conflictHandler = require('./conflictHandler.js');

function Game(state, game_manager) {

  this.id = state.id;
  this.gm = game_manager;
  this.io = game_manager.io;
  this.db = game_manager.db;

  this.stage = state.stage;

  // ordering of teams, e.g. ["eng","ilr", ...]
  this.original_team_order = state.team_order;  
  this.team_order = this.original_team_order.clone();
  this.current_team_index = state.current_team;

  // teams[team_id <string>] contains team data
  // players: player list returns player socket list
  this.teams = {};
  this.turn = state.turn;
  this.state = state.state;

  // who is left to move this turn
  // boolean array: index = team index
  this.waiting_on = new Array(this.team_order.length);
  for (var i = 0; i < this.team_order.length; i++) {
    this.waiting_on[i] = true;
  }

  // list of all socket clients in the game
  this.clients = [];

  // all move data for this turn
  // gets appended to as players contribute their moves
  this.all_move_data = [];
}

Game.prototype = {

  /**
   * @param id <string> : id of team, e.g. 'cals' or 'eng'
   */
  addTeam : function(id) {
    this.teams[id] = new Team(id);
  },

  /**
   * Adds a player to the game
   * @param socket : client that is connecting
   * @param team_id : team that they are joining
   */
  addPlayer : function(socket, team_id) {

    // subscribe the player to updates to the room
    socket.join(this.id);
    this.clients.push(socket);
    console.log('player joined game ' + this.id);

    if (!( team_id in this.teams)) {
      this.addTeam(team_id);
    }

    var player = new Player(socket, {
      team_index : this.getTeamIndexFromId(team_id)
    });
    this.teams[team_id].players.push(socket);

    console.log('player entering stage ' + this.stage);

    // puts this client into being served by different stage handlers
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

  getTeamIndexFromId : function(team_id) {
    return this.team_order.indexOf(team_id);
  },

  /**
   * sets up functions for grab stage
   */
  initGrabStage : function(socket) {

    // handle selecting buildings
    socket.on('grab move', function(move_data) {
      console.log('received grab move', move_data);
      this.handleGrabMove(socket, move_data);
    }.bind(this));
  },

  /**
   * sets up functions for reinforcement stage
   */
  initReinforcementStage : function(socket) {

    console.log('initReinforcementStage() called');
    this.printDebugInfo(socket);
    socket.on('reinforcement move', function(move_data) {
      console.log('received reinforcement move', move_data);
      this.handleReinforcementMove(socket, move_data);
    }.bind(this));
  },
  /**
   *  sets up functions for orders stage
   */
  initOrdersStage : function(socket) {
    console.log('initOrdersStage() called');

    this.printDebugInfo(socket);

    socket.on('orders move', function(move_data) {
      console.log('received orders move', move_data);
      this.handleOrdersMove(socket, move_data);
    }.bind(this));
  },
  /**
   * Takes a client and their move and handles the grab turn
   */
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

    this.db.query(query_string, function(err, results) {
      move_data.current_team = this.current_team_index;
      move_data.turn = this.turn;
      move_data.stage = this.stage;

      this.io.to(this.id).emit('grab update', move_data);
      this.db.query('SELECT EXISTS(SELECT 1 FROM state."' + this.id + '" WHERE -1=team)', function(err, result) {

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
          for (var i = 0; i < this.clients.length; i++) {
            var socket = this.clients[i];
            socket.removeAllListeners('grab move');
            this.initReinforcementStage(socket);

          }

        }
      }.bind(this));
    }.bind(this));
  },

  /**
   * Takes a client and their move and adds the reinforcements to the move list
   */
  handleReinforcementMove : function(socket, move_data) {
    
    var team = move_data.meta.team;
    var team_index = move_data.meta.team_index;
    var coms = move_data.commands;

    //var reinforcements_remaining = api.getReinforcementsFromState(this.state,team);
    // XXX WILL FAIL IF GET_REINFORCEMENTS BECOMES ASYNC
    // var reinforcements_remaining = this.gm.api.getReinforcements(this.id, team, function(x) {
    // return x;
    // });

    var all_moves_valid = true;
    for (var i = 0; i < coms.length; i++) {
      var com = coms[i];
      var piece = this.state[com.id];

      // TODO make sure you own the piece and have enough to add
      if (piece.team === team_index) {// && reinforcements_remaining - com.units >= 0) {
        //piece.units += com.units;
        //reinforcements_remaining -= com.units;

        continue;

      } else {
        all_moves_valid = false;
        break;
      }
    }

    // append validated moves
    if (all_moves_valid) {
      this.all_move_data = this.all_move_data.concat(move_data.commands);
      this.removeFromWaitingOn(team_index);
    }
    
    console.log(this.all_move_data);

    var togo = this.getWaitingOn();
    if (togo.length > 0) {

      this.io.to(this.id).emit('waiting-on update', togo);

      // no one remaining
      // only runs once on last player to move
      // apply moves, notify, update stage
    } else {
      console.log('no one is left!!', this.all_move_data);
      this.applyReinforcementMoves(); 
    }

  },

  applyReinforcementMoves : function(){
     
      for (var i = 0; i < this.all_move_data.length; i++) {
        var com = this.all_move_data[i];
        var piece_id = com.id;
        var units = this.state[com.id].units + com.units;
        this.state[com.id].units = units;

        this.db.query('UPDATE state."' + this.id + '" SET units=' + units + ' WHERE piece_name=\'' + piece_id + '\'', function(err, result) {
          if (err) {
            console.error('ERROR cannot update state in initReinforcementStage()');
          }
        });

      }

      this.io.to(this.id).emit('reinforcement update', this.all_move_data);
      this.all_move_data = [];

      // set to orders stage
      this.db.query('UPDATE global.games SET stage = \'orders\'WHERE id = \'' + this.id + '\'', function(err, result) {
        if (err) {
          console.error('ERROR: cannot switch to orders stage');
        }
        this.stage = 'orders';
      }.bind(this));

      this.resetWaitingOn();

      // update all clients to same state
      for (var i = 0; i < this.clients.length; i++) {
        var socket = this.clients[i];
        socket.removeAllListeners('reinforcement move');
        this.initOrdersStage(socket);
      }


  },

  /**
   * Takes a client and their move and handles the backend for the move
   */
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
    console.log('all_move_data updated:', this.all_move_data);

    this.removeFromWaitingOn(team_index);
    var togo = this.getWaitingOn();

    // someone left
    if (togo.length > 0) {

      this.io.to(this.id).emit('waiting-on update', togo);

      // no one left
      // only runs on last player to move
    } else {
     this.applyOrdersMoves();
   }
  },

  applyOrdersMoves : function() {
    
      // set up for reinforcement  stage
      this.db.query('UPDATE global.games SET stage = \'reinforcement\' WHERE id = \'' + this.id + '\'', function(err, result) {
        if (err) {
          console.log('ERROR: cannot switch to reinforcement stage');
        }

        this.stage = 'reinforcement';
      }.bind(this));

      this.resetWaitingOn();

      //
     // var results = conflictHandler.genAllAttackResults(this.all_move_data,this.state);
      var new_state = conflictHandler.genUpdatedState(this.all_move_data, this.state);
      this.updatePartialState(new_state);
      this.io.to(this.id).emit('orders update', new_state);
      this.all_move_data = [];
      //  update all client sockets
      for (var i = 0; i < this.clients.length; i++) {
        var socket = this.clients[i];
        socket.removeAllListeners('orders move');
        this.initReinforcementStage(socket);
      }
  },
  /**
   * Takes a set of changes and applies them to the state
   * {<piece_id> : {<int> team: <team>, <int> units: <units>}}
   */
  updatePartialState : function(updates) {
    console.log(updates);
    var keys = Object.keys(updates);
    for(var i = 0; i < keys.length; i++) {
      var piece_id = keys[i];
      var update = updates[piece_id];
      if(update.team){
        this.state[piece_id].team = update.team;
   
        this.db.query('UPDATE state."' + this.id + '" SET team=' + update.team + ' WHERE piece_name=\'' + piece_id + '\'', function(err, result) {
          if (err) {
            console.error('ERROR cannot update state in initReinforcementStage()');
          }
        });


      }
      if(update.units){
        this.state[piece_id].units = update.units;
       this.db.query('UPDATE state."' + this.id + '" SET units=' + update.units + ' WHERE piece_name=\'' + piece_id + '\'', function(err, result) {
          if (err) {
            console.error('ERROR cannot update state in initReinforcementStage()');
          }
        });

     }
    }
    this.io.to(this.id).emit('update partial state', updates);
  },

  /**
   * Returns a list of int ids <int> of players that have yet to move for this turn
   */
  getWaitingOn : function() {

    ret = [];
    for (var i = 0; i < this.waiting_on.length; i++) {
      if (this.waiting_on[i]) {
        ret.push(i);
      }
    }

    return ret;
    // this.db.query('SELECT index FROM teams."' + this.id + '" WHERE waiting_on=TRUE', function(err, result) {
    // if (err) {
    // console.error('ERROR: query checking teams still waiting on returned error')
    // }
    // if (result.rows.length > 0) {
    // var waiting_on = new Array(result.rows.length);
    // for (var i = 0; i < result.rows.length; i++) {
    // waiting_on[i] = result.rows[i].index;
    // }
    // console.log('still waiting on:', waiting_on);
    // }.bind(this));

  },
  /**
   * sets every team to waiting on
   * used at the start of every move
   */
  resetWaitingOn : function() {
    for (var key in Object.keys(this.waiting_on)) {
      this.waiting_on[key] = true;
    }

    // this.db.query('UPDATE teams."' + this.id + '" SET waiting_on=TRUE', function(err, result) {
    // if (err) {
    // console.error('ERROR could not reset waiting_on=TRUE in initOrdersStage')
    // }
    // });
  },

  removeFromWaitingOn : function(index) {
    //console.log('removing from waiting on', this.waiting_on, index);
    this.waiting_on[index] = false;
    //console.log('after', this.waiting_on);

    // this.db.query('UPDATE teams."' + this.id + '" SET waiting_on=FALSE WHERE id=\'' + move_data.meta.team + '\'', function(err, result) {
    // if (err) {
    // console.error('ERR GAME.JS UPDATING WAITING_ON');
    // }
    // }.bind(this));
  },
  /**
   * handles case where player is destroyed
   */
  checkForEliminated : function() {
    var size = this.team_order.length;
    var eliminated = new Array();
    while(size--) eliminated.push(false);

    var keys = Object.keys(this.state);
    for(var i = 0; i< keys.length(); i++){
      var piece_id = keys[i];
      var piece = this.state[piece_id];
      var team = piece.team;
 
      // death condition
      var eliminated = piece.units < 1;

      eliminated[team] = eliminated[team] || eliminated;
    }
    for(var j in eliminated){
      if(eliminated[j]){
        this.eliminateTeam(j);  
      }
    }
  },

  eliminateTeam(team_idx) {
    if(this.isEliminated(team_idx){
      return;
    }
    this.eliminated.push(team_idx);

    var state_changes = {};
    var keys = Object.keys(this.state);
    for(var i in keys){
      var piece_id = keys[i];
      var state = this.state[piece_id];
      if(state.team == team_idx){
        state_changes[piece_id] = {team: -1};
      }
    }
    this.updatePartialState(state_changes);
  },
  isEliminated(team_idx) {
    var idx = this.eliminated.indexOf(team_idx);
    return idx > -1;
  },
  endGame(victor_idx){
    this.io.to(this.id).emit('end game', {victor: victor_idx});
  },

  /**
   * Gets the index of the next player to move
   */
  nextTeamIndex : function() {
    this.current_team_index = (this.current_team_index + 1) % this.team_order.length;
    return this.current_team_index;
  },

  /**
   *  Master Override
   *  Resets the turn as if no one moved
   */ 
  forceResetTurn : function() {
    this.all_move_data = [];
    this.resetWaitingOn();
    this.io.to(this.id).emit('server sync');
  },
  
  /**
   *  Master Override 
   *  Continues to next turn even if not all players have moved
   */
  forceNextTurn : function() {
    switch (this.stage){
      case "grab":
        this.current_team_index = this.nextTeamIndex();
        break;
      case "reinforcement":
        this.applyReinforcementMoves();
        break;
      case "orders":
        this.applyOrdersMoves();
        break;
    }
    this.io.to(this.id).emit('server sync');
  },


  /**
   * Takes a socket and removes it from the list of active players
   * @param {Object} socket
   */
  removeClientFromActive : function(socket) {
    var index = this.clients.indexOf(socket);

    if (index > -1) {
      this.clients.splice(index, 1);
    } else {
      console.error('ERROR. could not remove player' + socket.id);
    }

  },
  /**
   * Prints data related to this game for debugging
   * @param {Object} socket : [OPTIONAL] if included, prints socket info
   */
  printDebugInfo : function(socket) {
    console.log('================================ Debug Info');
    var client_ids = new Array(this.clients.length);
    for (var i = 0; i < this.clients.length; i++) {
      client_ids[i] = this.clients[i].id;
    }
    var out = {
      stage : this.stage,
      all_move_data : this.all_move_data,
      clients : client_ids,
      waiting_on : this.getWaitingOn(),
    }
    if (socket) {
      out.socket_id = socket.id;
    }
    console.log(out);
    console.log('===========================================');
  }
}

// stores info related to a team
function Team(id, name) {
  this.id = id;
  this.name = name || '';
  this.players = [];
}

function Player(socket, options) {
  this.socket = socket;
  this.name = options.name || '';
  this.id = options.id || '';
  this.team_index = options.team_index || -1;
}

module.exports = Game;
