var Player = require('./player.js');
PlayerUser = function(options, socket) {
  Player.call(this, options);
  this.socket = socket;
}
PlayerUser.prototype = Object.create(Player);
PlayerUser.prototype.constructor = PlayerUser;

PlayerUser.prototype.getGrabMove = function(callback) {
  // handle selecting buildings
  this.socket.on('grab move', function (move_data) {
    console.log('received grab move', move_data);
    callback(this, move_data);
  }.bind(this));
};
PlayerUser.prototype.getReinforcementMove = function(count, callback) {
  this.socket.on('reinforcement move', function(move_data) {
    debugger;
    console.log('received reinforcement move', move_data);
    callback(this, move_data);
  }.bind(this));
};
PlayerUser.prototype.getOrdersMove = function(callback) {
  this.socket.on('orders move', function (move_data) {
    console.log('received orders move', move_data);
    callback(this, move_data);
  }.bind(this));
};


module.exports = PlayerUser;

