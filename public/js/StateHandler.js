StateHandler = function() {

  this.current = {
    phase : undefined,
    turn_number : 0,
    player : 1,
  };

  this.teams = [];
  this.team_count = 6;
  this.team_colors = [0xffffff, 0xff0000, 0xff8a00, 0xe4ff00, 0x19d500, 0x00b2d2, 0x7100d0];
}

StateHandler.prototype.addTeam = function(team) {
  this.teams.append(team);
}

StateHandler.prototype.getCurrent = function() {
  return this.current;
}

StateHandler.prototype.nextTurn = function() {
  this.current.player = this.current.player % this.team_count + 1;
  this.current.turn_number += 1;
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
  }else{
  	return false;
  }
}
