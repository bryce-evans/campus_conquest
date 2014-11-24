SocketListeners = function(socket) {
  this.socket = socket;
}

SocketListeners.prototype.initListeners = function() {
  // recieve moves
  socket.on('building click', function(data) {
    var team = data.team_index;
    var building_id = data.piece;
    var building = world.map.buildings[building_id];
    building.material.color = new THREE.Color(world.state_handler.getTeamColorFromIndex(team));
    building.game_piece.team = team;
    world.state_handler.nextTurn();
  }.bind(this));

}