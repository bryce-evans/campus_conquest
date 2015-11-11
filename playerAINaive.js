var PlayerAI = require('./playerAI.js');

PlayerAINaive = function(options, campus, state) {
  PlayerAI.call(this, options, campus, state);
  this.level = 1;
}
PlayerAINaive.prototype = Object.create(PlayerAI.prototype);
PlayerAINaive.prototype.constructor = PlayerAINaive;

PlayerAINaive.prototype.getGrabMove = function(callback) {
  var keys = Object.keys(this.state);
  var open = this.getPiecesNoOwner();
  var move = {team_id : this.team.id, piece: this.getRandElem(open)};
  callback(this, move);
};
PlayerAINaive.prototype.getReinforcementMove = function(count, callback) {
  var border_pieces = this.getPiecesOnBorder(this.team.index);
  var ret = {};
  for (var i = 0; i < count; i++) {
    var piece = this.getRandElem(border_pieces);
    if (!(piece in ret)) {
      ret[piece] = 0;
    }
    ret[piece]++;
  }
  var move = {meta : {team_index : this.team.index}, commands : ret};
  callback(this, move);
};
PlayerAINaive.prototype.getOrdersMove = function(callback) {
  var border_pieces = this.getPiecesOnBorder(this.team.index);
  var ret = {};
  for (var i = 0; i < border_pieces.length; i++) {
    var piece = border_pieces[i];
    var units = this.state[piece].units;
    if (units > 1) {
      var attackable = this.getEnemyPiecesNear(piece);
      var attacked = this.getRandElem(attackable);
      if (!attacked) {
        continue;
      }
      ret[piece] = {};
      ret[piece][attacked] = units - 1;
    }
  }

  var move =  {team_index : this.team.index, commands : ret};
  callback(this, move);
};


module.exports = PlayerAINaive;
