World = function(id) {
  this.id = id;
  this.map
  this.state_handler
  this.control_panel_handler
  this.client_listeners
  this.graphics
  this.window_handler
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
    socket.emit('join game', client_data);
  },
  loadWorld : function(options) {
    has_ground = options.has_ground || false;

    if (this.id != '') {
      $.ajax({
        url : "/state",
        data : {
          id : world.id
        },
      }).done( function(init_data) {
        this.state_handler.setState(init_data);
        this.map.loadFromState(init_data.state);
        this.control_panel_handler.updatePanelWorldData(init_data);
      }.bind(this));
    } else {
      $.ajax({
        url : "/rsc/maps/example_state.json",
      }).done( function(init_data) {
        this.map.loadFromState(init_data.state);
        this.control_panel.updatePanelWorldData(init_data);
      }.bind(this));
    }
  },
  setMe : function(data) {
    this.me = data;
    this.control_panel_handler.updatePanelPlayerData(data);
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
