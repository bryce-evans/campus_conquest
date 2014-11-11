function initGame() {
	$('#game-window').show();
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    return;
  }
	
  world = new World();
  socket = io();

  var map = new Map();
  var state = new StateHandler();
  // var control_panel = new ControlPanel(world);
  var client_listeners = new ClientListeners();
  
  var socket_listeners = new SocketListeners(socket);
  socket_listeners.initListeners();
  
  var graphics = new Graphics();
  var window_handler = new WindowHandler();

  world.setMap(map);
  world.setStateHandler(state);
  // world.setControlPanel(control_panel);
  world.setClientListeners(client_listeners);
  world.setGraphics(graphics);
  world.setWindowHandler(window_handler);
  
  client_listeners.addListeners();
  world.graphics.startRender();

}

