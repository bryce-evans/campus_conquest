/*
 Requires a Game was already created with api.js and records exist in DB
 */

var ConflictHandler = require('./conflictHandler.js');
var AI = require('./ai.js');
var Utils = require('./utils.js');

var Player = require('./player.js');
var PlayerUser = require('./playerUser.js');
var PlayerAINaive = require('./playerAINaive.js');

function Game(game_manager, state, options) {
  this.id = state.id;
  this.map = state.map;
  this.gm = game_manager;
  this.io = game_manager.io;
  this.db = game_manager.db;

  this.campus = this.gm.cm.getCampusData(state.campus);
  this.ai = new AI(this.campus, state.state);
  
  this.state = state.state;
  this.turn = state.turn;

  this.options = {
    quick_start : options && options.quick_start, 
  };

  this.stage = state.stage;
  
  this.stages = {
    START : "start",
    GRAB : "grab",
    REINFORCEMENT : "reinforcement",
    ORDERS : "orders",
    END : "end",
  };

  // ordering of teams, e.g. ["eng","ilr", ...]
  this.team_order = state.team_order;
 
  // list of indices of teams that were destroyed
  this.eliminated = [];

  this.current_team_index = state.current_team;

  // teams[team_id <string>] contains team data
  // players: player list returns player socket list
  this.teams = {};
  for (var i = 0; i < this.team_order.length; i++) {
    var team_id = this.team_order[i];
    var team = new Team(team_id);
    team.setIndex(i);
    this.addTeam(team);
  }

  // who is left to move this turn
  // boolean array: index = team index
  this.waiting_on = new Array(this.team_order.length);
  for (var i = 0; i < this.team_order.length; i++) {
    this.waiting_on[i] = true;
  }

  // {<string> socketID : Player}
  this.socket_player_map = {};

  // all move data for this turn
  // gets appended to as players contribute their moves
  this.all_move_data = [];
  
  this.initStage(this.stage);
  
  // humec always ai for now
  // players must be added after initializing stage
  if("humec" in this.teams) {
    this.addPlayerAI("humec");
  }

}

Game.prototype = {
  /**
   * @param id <string> : id of team, e.g. 'cals' or 'eng'
   */
  addTeam : function(team) {
    this.teams[team.id] = team;
  },

  /**
   * Adds a player to the game
   * @param socket : client that is connecting
   * @param team_id : team that they are joining
   */
  addPlayerUser : function(socket, team_id) {
    if (!(team_id in this.teams)) {
      throw new Error('Player joining invalid team');
    }
 
    // subscribe the player to updates to the room
    socket.join(this.id);
 
    var team = this.teams[team_id];

    var player = new PlayerUser({
      team : team
    }, socket);
    this.socket_player_map[socket.id] = player;
  
    this.initPlayer(player);
  },
  addPlayerAI : function(team_id) {

    if (!(team_id in this.teams)) {
      throw new Error('Player joining invalid team');
    }
    
    var team = this.teams[team_id];
    var player = new PlayerAINaive({
      team : team,
    }, this.campus, this.state);
    this.initPlayer(player);
  },
  initPlayer : function(player) {

    console.log('player joined game ' + this.id);
    
    this.teams[player.team.id].players.push(player);

    // puts this client into being served by different stage handlers
    switch (this.stage) {
      case this.stages.START:
        break;
      case this.stages.GRAB:
        player.getGrabMove(this.handleGrabMove.bind(this));
        break;
      case this.stages.REINFORCEMENT:
        player.getReinforcementMove(this.getReinforcementCount(player.team.index), this.handleReinforcementMove.bind(this));
        break;
      case this.stages.ORDERS:
        player.getOrdersMove(this.handleOrdersMove.bind(this));
        break;
      case this.stages.END:
        break;
    }
  },

  getTeamIndexFromId : function(team_id) {
    return this.team_order.indexOf(team_id);
  },
 
  /**
   *  Sets the stage for all clients
   */
  initStage : function(new_stage) {
    var old_listener;
    switch (this.stage) {
      case this.stages.START:
        old_listener = "";
        break;
      case this.stages.GRAB:
        old_listener = "grab move";
        break;
      case this.stages.REINFORCEMENT:
        old_listener = "reinforcement move";
        break;
      case this.stages.ORDERS:
        old_listener = "orders move";
        break;
      case this.stages.END:
        old_listener = "";
        break;
    }

    var socket_ids = Object.keys(this.socket_player_map);
    for (var i = 0; i < socket_ids.length; i++) {
      var socket_id = socket_ids[i];
      var socket = this.io.sockets.connected[socket_id];
      socket.removeAllListeners(old_listener);
    }

    switch (new_stage) {
      case this.stages.START:
        break;
      case this.stages.GRAB:
        if (this.options.quick_start) {
          this.randomizeRemaining();
          var query_string = 'UPDATE global.games SET stage = \'reinforcement\'WHERE id = \'' + this.id + '\'';

          this.db.query(query_string);
          this.io.to(this.id).emit('stage update', {
            stage : 'reinforcement',
          });

          // tell clients to pull the new data
          this.io.to(this.id).emit('server sync');
          
          this.initStage(this.stages.REINFORCEMENT);
      
          return;
        }
        var team_ids = Object.keys(this.teams);
        for (var i = 0; i < team_ids.length; i++) {
          var team_id = team_ids[i];
          var players = this.teams[team_id].players;
          for (var j = 0; j < players.length; j++) {
            var player = players[j];
            player.getGrabMove(this.handleGrabMove.bind(this));
          }
        }
        break;
      case this.stages.REINFORCEMENT:
        var team_ids = Object.keys(this.teams);
        for (var i = 0; i < team_ids.length; i++) {
          var team_id = team_ids[i];
          var players = this.teams[team_id].players;
          for (var j = 0; j < players.length; j++) {
            var player = players[j];
            player.getReinforcementMove(
              this.getReinforcementCount(this.teams[team_id].index), 
              this.handleReinforcementMove.bind(this)
            );
          }
        }
        break;
      case this.stages.ORDERS:
        var team_ids = Object.keys(this.teams);
        for (var i = 0; i < team_ids.length; i++) {
          var team_id = team_ids[i];
          var players = this.teams[team_id].players;
          for (var j = 0; j < players.length; j++) {
            var player = players[j];
            player.getOrdersMove(this.handleOrdersMove.bind(this));
          }
        }
        break;
      case this.stages.END:
        break;
    }

    this.stage = new_stage;
  },
  /**
   * Takes a client and their move and handles the grab turn
   */
  handleGrabMove : function (player, move_data) {
    console.log(move_data);
    var team_index = move_data.team_index || this.team_order.indexOf(move_data.team_id);
    if (this.current_team_index != team_index|| this.state[move_data.piece].team != -1) {
      console.log('invalid move data');
      console.log("this.current_team_index: " , this.current_team_index);
      console.log("this.state[move_data.piece]: ", this.state[move_data.piece].team);
      return false;
    }
    console.log("game " + this.id + " update " + move_data.piece + " to team " + team_index);

    this.nextTeamIndex();
    this.turn++;

    var query_string = 'UPDATE "state"."' + this.id + '" SET team =\'' + team_index + '\', units=1, player =\'Bryce\' WHERE  piece_name = \'' + move_data.piece + '\'';

    // update server  state
    this.state[move_data.piece].team = team_index;
    this.state[move_data.piece].units = 1;

    this.db.query(query_string);
    var query_string = 'UPDATE global.games SET turn = ' + this.turn + ', cur_team = ' + this.current_team_index + ' WHERE id = \'' + this.id + '\'';
    
    this.db.query(query_string, function(err, results) {
      move_data.current_team = this.current_team_index;
      move_data.turn = this.turn;
      move_data.stage = this.stage;
      move_data.team_index = team_index;

      this.io.to(this.id).emit('grab update', move_data);
      this.db.query('SELECT EXISTS(SELECT 1 FROM state."' + this.id + '" WHERE -1=team)', function(err, result) {

        // STAGE CONTINUES
        if (result.rows[0]['?column?']) {
          var players = this.teams[this.team_order[this.current_team_index]].players;
          for (var i = 0; i < players.length; i++) {
            players[i].getGrabMove(this.handleGrabMove.bind(this));
          }

        // END OF STAGE
        } else {
          console.log(result);
          var query_string = 'UPDATE global.games SET stage = \'reinforcement\'WHERE id = \'' + this.id + '\'';

          this.db.query(query_string);
          this.io.to(this.id).emit('stage update', {
            stage : 'reinforcement',
          });

          // tell clients to pull the new data
          this.io.to(this.id).emit('server sync');
          
          this.initStage(this.stages.REINFORCEMENT);
      
          
        }
      }.bind(this));
    }.bind(this));
  },

  /**
   * Takes a client and their move and adds the reinforcements to the move list
   */
  handleReinforcementMove : function (player, move_data) {
    
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

  applyReinforcementMoves : function() {
     
      for (var i = 0; i < this.all_move_data.length; i++) {
        var com = this.all_move_data[i];
        var pieces = Object.keys(com);
        for (var j = 0; j < pieces.length; j++) {
          var piece_id = pieces[j];
          var units = this.state[piece_id].units + com[piece_id];
          this.state[piece_id].units = units;
          
          this.db.query('UPDATE state."' + this.id + '" SET units=' + units + ' WHERE piece_name=\'' + piece_id + '\'', function(err, result) {
            if (err) {
              console.error('ERROR cannot update state in initReinforcementStage()');
            }
          });
        }
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

      this.initStage(this.stages.ORDERS);

  },

  /**
   * Takes a client and their move and handles the backend for the move
   */
  handleOrdersMove : function(player, move_data) {
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
        // remove all orders from the piece that's cheating
        delete move_data.commands[start];
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
      var results = ConflictHandler.resolveAttacks(this.campus, this.state, this.all_move_data);
      this.updatePartialState(results.new_state, false);
            
      // set up for reinforcement  stage
      this.db.query('UPDATE global.games SET stage = \'reinforcement\' WHERE id = \'' + this.id + '\'', function(err, result) {
        if (err) {
          console.log('ERROR: cannot switch to reinforcement stage');
        }

        this.stage = 'reinforcement';
      }.bind(this));

      this.resetWaitingOn();

      this.io.to(this.id).emit('orders update', results);
      this.all_move_data = [];

      this.initStage(this.stages.REINFORCEMENT);

  },
  getReinforcementCount : function(team_index) {
    var state = this.state; 
    var reinforcements = {};

    // contribution from number of pieces owned
    var piece_count = 0;
    for (var id in state) {
      if (state.hasOwnProperty(id)) {
        s = state[id]; 
        if (s.team === team_index) {
          piece_count++;
        }
      }
    }
     
     reinforcements.piece_count = {name : "Territory Count Bonus", count: Math.ceil(piece_count / 3)};

     // contribution from regions
     var regions = this.campus.map.regions;
     var keys =  Object.keys(regions);
     for (var i = 0; i < keys.length; i++) {
       var pieces = regions[keys[i]].pieces;
       var bonus = regions[keys[i]].value;
       for (var j = 0; j < pieces.length; j++) {
         if (state[pieces[j]].team !== team_index) {
           bonus = 0;
           break;
         }
       }
       if (bonus !== 0) {
         var region_id = keys[i];
         reinforcements[keys[i]] = {name : regions[region_id].name, count: bonus};
       }
     }
     // contribution from contiguous

     // contribution from other
     var total = 0;
     var keys = Object.keys(reinforcements);
     for (var i = 0; i < keys.length; i++) {
       total += reinforcements[keys[i]].count;
     }

     // always have at least 1 reinforcement
     if (total === 0) {
       reinforcements.other = {name : "Other", count : 1};
       total++;
     }
     
     reinforcements.total = {name : "Total", count : total};
    return total; 
  },

  /**
   * takes full data and updates everything
   */
  updateGameData : function(data) {
   
    if ("map" in data && this.map != data.map) {
      console.error("must update game with same map");
      console.log(data.map + " " + this.map);
      return;
    }
    if ("id" in data && this.id != data.id) {
      console.log('overwriting ' + this.id + " with " + data.id);
    }
    if("stage" in data) {
      this.db.query('UPDATE global.games SET stage = \''+ data.stage +'\'WHERE id = \'' + this.id + '\'', function(err, result) {
        if (err) {
          console.log(err);
        }
        this.stage = 'orders';
      }.bind(this));

      this.resetWaitingOn();
      this.stage = data.stage;
    }
    if("turn" in data) {
      this.turn = data.turn;
    }
    if("team_order" in data) {

      this.team_order = data.team_order;

      this.waiting_on = new Array(this.team_order.length);
      for (var i = 0; i < this.team_order.length; i++) {
        this.waiting_on[i] = true;
      }

      for (var i = 0; i < this.team_order.length; i++) {
        var query = "INSERT INTO teams.\"" + this.id + "\" VALUES (" + i + ",'"+ this.team_order[i] + "',1,TRUE,'')";
        this.db.query(query, Utils.logIfError);
      }
    }
    if ("state" in data) {
      this.updatePartialState(data.state, true);
    }
    if("eliminated" in data) {
      this.eliminated = data.eliminated;
    }
    if("current_team" in data) {
      this.current_team_index = data.current_team;
    }

  },
  
  randomizeRemaining : function() {
    var pieces = Object.keys(this.state);
    var new_state = {}
    for (var i = 0; i < pieces.length; i++) {
      var piece_id = pieces[i];
      if (this.state[piece_id].team === -1) {
        new_state[piece_id] = this.state[piece_id];
      }
    }
    pieces = Utils.shuffle(Object.keys(new_state));
    for (var i = 0; i < pieces.length; i++) {
      var piece = new_state[pieces[i]];
      piece.team = this.current_team_index;
      piece.units = 1;
      this.nextTeamIndex();
    }
    this.updatePartialState(new_state, true);
  },

  /**
   * Takes a set of changes and applies them to the state
   * {<piece_id> : { team: <int>, units: <int>}}
   */
  updatePartialState : function(updates, update_clients) {
    console.log(updates);
    var keys = Object.keys(updates);
    for(var i = 0; i < keys.length; i++) {
      var piece_id = keys[i];
      var update = updates[piece_id];
      if("team" in update){
        this.state[piece_id].team = update.team;
   
        this.db.query('UPDATE state."' + this.id + '" SET team=' + update.team + ' WHERE piece_name=\'' + piece_id + '\'', function(err, result) {
          if (err) {
            console.error('ERROR cannot update state in initReinforcementStage()');
          }
        });


      }
      if("units" in update){
        this.state[piece_id].units = update.units;
       this.db.query('UPDATE state."' + this.id + '" SET units=' + update.units + ' WHERE piece_name=\'' + piece_id + '\'', function(err, result) {
          if (err) {
            console.error('ERROR cannot update state in initReinforcementStage()');
          }
        });

     }
    }
    if (update_clients) {
      this.io.to(this.id).emit('update partial state', updates);
    }
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

  eliminateTeam: function(team_idx) {
    if(this.isEliminated(team_idx)) {
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
  isEliminated: function(team_idx) {
    var idx = this.eliminated.indexOf(team_idx);
    return idx > -1;
  },
  endGame: function(victor_idx){
    this.io.to(this.id).emit('end game', {victor: victor_idx});
  },

  /**
   * Gets the index of the next player to move
   */
  nextTeamIndex : function() {
    this.current_team_index = (this.current_team_index + 1) % this.team_order.length;
    // TODO fixme
    //if (this.current_team_index in this.ai_controlled) {
     // this.moveAI(this.current_team_index);
    //}
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
        var query_string = 'UPDATE global.games SET cur_team = ' + this.current_team_index + ' WHERE id = \'' + this.id + '\'';
        this.db.query(query_string, Utils.logIfError);
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
    delete this.socket_player_map[socket.id];
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
Team.prototype.setIndex = function(idx) {
  this.index = idx;
};

module.exports = Game;
