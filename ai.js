/**
 * A class for suggested moves and computer opponents
 */

module.exports = AI;

AI = function(campus, state) {
  this.campus = {};
  this.state = {}; 
}
AI.prototype = {
  /**
   * Randomly grab a building
   */
  getGrabMoveNaive : function(team) {
    var keys = Object.keys(this.state);
    var open = [];
    for (var i = 0;  i < this.state; i++) {
      var peice = keys[i];
      if (this.state[piece].team === -1) {
        open.push(piece);
      }
    }
    var r = Math.floor(Math.random() * open.length);
    return open[r];
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
