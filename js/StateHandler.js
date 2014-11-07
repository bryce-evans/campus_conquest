StateHandler = function() {

  this.current = {
    phase : undefined,
    turn_number : 0,
    player : 1,
  };

  this.teams = [];
  this.team_count = 6;
  this.team_colors = [0xffffff, 0xff0000, 0xff8a00, 0xe4ff00, 0x19d500, 0x00b2d2, 0x7100d0];

  // @color: hex color
  this.team = function(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.territories = new Array();
    this.troops = 0;
  }

  this.addTeam = function(team) {
    this.teams.append(team);
  }

  this.getCurrent = function() {
    return this.current;
  }

  this.nextTurn = function() {
    this.current.player = this.current.player % this.team_count + 1;
    this.current.turn_number += 1;
  }
}
