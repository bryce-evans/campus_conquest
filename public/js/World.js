World = function(id) {
	this.id = id;
  this.map
  this.state_handler
  this.control_panel
  this.client_listeners
  this.graphics
  this.window_handler
  this.nav = {height: 50};

  this.options = {
    display : {
      stats : true,
      menu : false,
    },
    sound : {
      on : true,
      volume : 100,
    },
    graphics : {
      ground : true,
      animated : false,
      shaders : true,
      antialias : true,
      sortObjects : false,
      autoClear : false,
      gammaInput : true,
      gammaOutput : true,
    }
  };

  this.canvas2D = $('#canvas2D');
  // this.renderer2D = new THREE.CanvasRenderer({
    // canvas : canvas2D,
  // });


}

World.prototype.setMap = function(map) {
  this.map = map;
}
World.prototype.setStateHandler = function(state_handler) {
  this.state_handler = state_handler;
}
World.prototype.setControlPanel = function(control_panel) {
  this.control_panel = control_panel;
}
World.prototype.setClientListeners = function(client_listeners) {
  this.client_listeners = client_listeners;
}
World.prototype.setGraphics = function(graphics) {
  this.graphics = graphics;
}
World.prototype.setWindowHandler = function(window_handler) {
  this.window_handler = window_handler;
}
World.prototype.setControlPanelHandler = function(control_panel_handler) {
  this.control_panel_handler = control_panel_handler;
}
