/**
 * World 
 * main class for managing all components running a game
 * contains settings, and components that run every thing
 * used to tie all other components together
 * @param {string} id
 */
World = function(id) {
  this.id = id;
  this.map = undefined;
  this.state_handler = undefined;
  this.control_panel_handler = undefined;
  this.client_listeners = undefined;
  this.graphics = undefined;
  this.window_handler = undefined;
  this.nav = {
    height : 50
  };

  this.canvas2D = $('#canvas2D');
  // this.renderer2D = new THREE.CanvasRenderer({
  // canvas : canvas2D,
  // });

}

World.prototype = {
  connectToSocket : function(socket, client_data) {
    this.state_handler.connectToSocket(socket);
    this.control_panel_handler.connectToSocket(socket);
    socket.emit(CONSTANTS.IO.JOIN_GAME, client_data);
  },
  loadWorld : function(options) {
    has_ground = options.has_ground || false;

    this.state_handler.freshPull(function(state){
      this.state_handler.setState(state);
      this.map.loadFromState(state.state);
      this.map.loadGeometries();
      //this.control_panel_handler.updateTextFields(init_data);
    }.bind(this));
  },
  setMe : function(data) {
    this.me = data;
    this.control_panel_handler.updateTextFields(data);
  },
  setMap : function(map) {
    this.map = map;
  },
  setStateHandler : function(state_handler) {
    this.state_handler = state_handler;
  },
  setControlPanel : function(control_panel) {
    this.control_panel = control_panel;
  },
  setClientListeners : function(client_listeners) {
    this.client_listeners = client_listeners;
  },
  setGraphics : function(graphics) {
    this.graphics = graphics;
  },
  setWindowHandler : function(window_handler) {
    this.window_handler = window_handler;
  },
  setControlPanelHandler : function(control_panel_handler) {
    this.control_panel_handler = control_panel_handler;
  }
}
