/**
 *  Abstract Class
 */

Player = function (options) {
  if (this.constructor === Player) {
    throw new Error('AbstractClassException');
  }
  this.name = options.name || '';
  this.id = options.id || '';
  this.team = options.team;
}

Player.prototype  = {
  getGrabMove : function(callback) {
    var move = {};
    callback(this, move);
  },
  getReinforcementMove : function(count, callback) {
    var move = {};
    callback(this, move);
  },
  getOrdersMove : function(callback) {
    var move = {};
    callback(this, move);
  },
}

module.exports = Player;
