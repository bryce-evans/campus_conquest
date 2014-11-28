StateHandler = function() {
  this.socket = undefined;
  this.current = {};
  this.team_order = [];
}

StateHandler.prototype = {
  connectToSocket : function(socket) {
    this.socket = socket;
    // recieve moves
    this.socket.on('building click', function(data) {
      var team = data.team_index;
      var building_id = data.piece;
      var building = world.map.buildings[building_id];
      building.material.color = new THREE.Color(world.state_handler.getTeamColorFromIndex(team));
      building.game_piece.team = team;
      world.control_panel_handler.updateWheelToNext();
      this.updateState(data);
    }.bind(this));

  },

  addTeam : function(team) {
    this.teams.append(team);
  },

  getCurrent : function() {
    var ret = this.current;
    ret.team = this.team_order[ret.team_index];
    return ret;
  },

  // for setting the entire initial state
  setState : function(state) {
    this.current.team_index = state.current_team;
    this.current.stage = state.stage;
    this.current.turn_number = state.turn;
    this.team_order = state.team_order;
    world.control_panel_handler.initWheel(state.team_order,state.current_team);
  },
  // for single move updates
  updateState : function(state) {
    this.current.team_index = state.current_team;
    this.current.stage = state.stage;
    this.current.turn_number = state.turn;
  },
  move : function(piece) {
    // nat cho move yet son
    if (me.team != world.state_handler.getCurrent().team) {
      console.log("Not your turn! Wait for " + world.state_handler.getCurrent().team);
      return;
    }

    // send move
    var move_data = {
      scope : world.id,
      team_index : world.state_handler.getCurrent().team_index,
      team_id : me.team,
      piece : piece.game_piece.id,
    };
    this.socket.emit('building click', move_data);
  },
  getTeamColorFromIndex : function(index) {
    if (index < 0) {
      return 0xffffff;
    }
    return TEAM_DATA[this.team_order[index]].colors.primary;
  },
  getTeamColorFromId : function(id) {
    return TEAM_DATA[id].colors.primary;
  }
}

PlayerData = function(id, name, team) {
  // <string> netid
  this.id = id;
  this.name = name;

  // hex rgb
  this.color = color;

  this.team = undefined;

  // position in teamdata.players array
  this.index = -1;
}
TeamData = function(id, name, allow_multiple_players) {
  // <int>
  this.id = id;

  // <string>
  this.name = name;

  // PlayerData[]
  this.players = []

  // <bool>
  this.isTeam = allow_multiple_players;

  this.territories = new Array();
  this.troops = 0;
}
// returns true if successfully added player
TeamData.prototype.addPlayer = function(player) {
  if (this.isTeam || this.players.length == 0) {
    var index = this.players.length;
    this.players[index] = player;
    player.index = index;
    player.team = this;
    return true;
  } else {
    return false;
  }
}
