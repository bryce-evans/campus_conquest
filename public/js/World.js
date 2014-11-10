World = function() {
  this.map
  this.state_handler
  this.control_panel
  this.client_listeners
  this.graphics
  this.window_handler

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
    }
  };

  this.canvas2D = $('#canvas2D');
  this.renderer2D = new THREE.CanvasRenderer({
    canvas : canvas2D,
  });

  this.canvas3D = $('#canvas3D');
  this.renderer3D = new THREE.WebGLRenderer({
    antialias : this.options.graphics.antialias,
    canvas : canvas3D,
  });

  this.renderer3D.sortObjects = false;
  this.renderer3D.autoClear = false;
  this.renderer3D.gammaInput = true;
  this.renderer3D.gammaOutput = true;
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
World.prototype.setMouseControls = function(client_listeners) {
  this.client_listeners = client_listeners;
}
World.prototype.setGraphics = function(graphics) {
  this.graphics = graphics;
}
World.prototype.setWindowHandler = function(window_handler) {
  this.window_handler = window_handler;
}

