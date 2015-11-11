var Player = require('./player.js');

function PlayerAI (options, campus, state) {
  Player.call(this, options);
  if (this.constructor === PlayerAI) {
    throw new Error('AbstractClassException');
  }
  this.is_ai = true;
  this.level = 1;
  this.name = "AI";
  this.campus = campus;
  this.state = state;
}
PlayerAI.prototype = Object.create(Player.prototype);
PlayerAI.prototype.constructor = PlayerAI;

/**
 * Returns a list of ids of pieces that are connected
 * to enemy pieces
 */
PlayerAI.prototype.getPiecesOnBorder = function(team) {
   var q = this.getPiecesOwnedBy(team);
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
};

PlayerAI.prototype.getPiecesOwnedBy = function(team) {
  var ret = [];
  var keys = Object.keys(this.state);
  for (var i = 0;  i < keys.length; i++) {
    var piece = keys[i];
    if (this.state[piece].team === team) {
      ret.push(piece);
    }
  }
  return ret;
};

PlayerAI.prototype.getPiecesNoOwner = function() {
  return this.getPiecesOwnedBy(-1);
};

PlayerAI.prototype.getEnemyPiecesNear = function(piece) {
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
};
PlayerAI.prototype.getRandElem = function (list) {
  var r = Math.floor(Math.random() * list.length);
  return list[r];
};


module.exports = PlayerAI;
