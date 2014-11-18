function Game(id) {
  this.id = id;
  this.stage = 'start';
  this.teams_turn = 1;
  this.team_count = 0;

  // players[team_id] returns player list
  this.players = {};
}

Game.prototype = {
  addTeam : function(team_data){

  },
  addPlayer : function(team_id){
  },
  move : function(data){
    var team = data.team;
    var piece = data.piece;
  },
  getState : function()  {

  },
}

module.exports = Game;