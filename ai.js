/**
 * A class for suggested moves and computer opponents
 */


AI = function(campus, state) {
  this.campus = campus;
  this.state = state; 
}
AI.prototype = {
  /**
   * Randomly grab a building
   */
  getGrabMoveNaive : function(team) {
    var keys = Object.keys(this.state);
    var open = [];
    for (var i = 0;  i < keys.length; i++) {
      var piece = keys[i];
      if (this.state[piece].team === -1) {
        open.push(piece);
      }
    }
    var r = Math.floor(Math.random() * open.length);
    return {team_index: team, piece: open[r]};
  },
  /**
   * Distribute reinforcements along border
   */
  getReinforcementsMoveNaive : function(team){

  },
  /**
   * Attack anything and everything
   */
  getOrdersMoveNaive : function(team) {

  },
  /**
   * Returns a list of ids of pieces that are connected
   * to enemy pieces
   */
  getPiecesOnBorder : function(team) {

  }
}

module.exports = AI;
