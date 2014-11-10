SocketListeners = function(world, socket) {
  this.world = world;
  this.socket = socket;
}

SocketListeners.prototype.initListeners = function() {
  // recieve moves
  socket.on('building click', function(data) {
    var team = data[0];
    var building_id = data[1];
    var building = this.world.map.buildings[building_id];
    building.material.color = new THREE.Color(this.world.state_handler.team_colors[team]);
    building.game_piece.team = team;
    this.world.state_handler.nextTurn();
  }.bind(this));

}