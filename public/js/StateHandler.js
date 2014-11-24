StateHandler = function() {

  this.current = {
    phase : undefined,
    turn : 0,
    team_index : 1,
  };

  this.team_order = ["cals", "as", "en", "aap", "hotel", "ilr", "humec"];
}

StateHandler.prototype = {

  addTeam : function(team) {
    this.teams.append(team);
  },

  getCurrent : function() {
    var ret = this.current;
    ret.team = this.team_order[ret.team_index];
    return ret;
  },

  nextTurn : function() {
    this.current.player = this.current.player % this.team_order.length;
    this.current.turn_number += 1;
  },
  getTeamColorFromIndex : function(index) {
  	if(index < 0){
  		return 0xffffff;
  	}
    return TEAM_DATA[this.team_order[index]].colors.primary;
  },
  getTeamColorFromId : function(id){
  	
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
