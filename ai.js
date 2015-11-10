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
    var open = this.getPiecesNoOwner();
    return {team_index: team, piece: this.getRandElem(open)};
  },
  /**
   * Distribute reinforcements along border
   */
  getReinforcementMoveNaive : function(team, count) {
    debugger;
    var border_pieces = this.getPiecesOnBorder(team);
    var ret = {};
    for (var i = 0; i < count; i++) {
      var piece = this.getRandElem(border_pieces);
      if (!(piece in ret)) {
        ret[piece] = 0;
      }
      ret[piece]++;
    }
    return {meta : {team_index : team}, commands : ret};
  },
  /**
   * Attack anything and everything
   */
  getOrdersMoveNaive : function(team) {
    var border_pieces = this.getPiecesOnBorder(team);
    var ret = {};
    for (var i = 0; i < border_pieces.length; i++) {
      var piece = border_pieces[i];
      var units = this.state[piece].units;
      if (units > 1) {
        var attackable = this.getEnemyPiecesNear(piece);
        var attacked = this.getRandElem(attackable);
        ret[piece] = {};
        ret[piece][attacked] = units - 1;
      }
    }

    return {team_index : team, commands : ret};
  },
  /**
   * Returns a list of ids of pieces that are connected
   * to enemy pieces
   */
  getPiecesOnBorder : function(team) {
     var q = getPiecesOwnedBy(team);
     var set = {};

     for (var i = 0; i < q.length; i++) {
       var piece = q[i];
       var connected = Object.keys(this.campus.map.pieces[piece]);
       for (var j = 0; j < connected.length; j++) {
         var border_piece = connected[j];
         var owner = this.state[border_piece].team;
         if (owner === team) {
           set[border_piece] = true;
         }
       }
     }
     return Object.keys(set);
  },

  getPiecesOwnedBy : function(team) {
    var ret = [];
    for (var i = 0;  i < keys.length; i++) {
      var piece = keys[i];
      if (this.state[piece].team === team) {
        ret.push(piece);
      }
    }
    return ret;
  },

  getPiecesNoOwner : function() {
    return getPiecesOwnedBy(-1);
  },

  getEnemyPiecesNear : function(piece) {
    var team = this.state[piece].team;
    var connected = Object.keys(this.campus.map.pieces[piece]);
    var ret = [];
    for (var i = 0; i < connected.length; i++) {
      var conn_piece = connected[i];
      if (this.state[conn_piece].team != team) {
        ret.push(conn_piece);
      }
    }
    return ret;
  },
  getRandElem : function (list) {
    var r = Math.floor(Math.random() * list.length);
    return list[r];
  },
}

module.exports = AI;
