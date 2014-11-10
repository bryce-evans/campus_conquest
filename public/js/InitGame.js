function initGame() {
	$('#game-window').show();
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    return;
  }
	
  world = new World();
  socket = io();

  var map = new Map(world);
  var state = new StateHandler(world);
  // var control_panel = new ControlPanel(world);
  var client_listeners = new ClientListeners(world);
  
  var socket_listeners = new SocketListeners(world,socket);
  socket_listeners.initListeners();
  
  var graphics = new Graphics(world);
  var window_handler = new WindowHandler(world);

  world.setMap(map);
  world.setStateHandler(state);
  // world.setControlPanel(control_panel);
  world.setClientListeners(client_listeners);
  world.setGraphics(graphics);
  world.setWindowHandler(window_handler);
  
  mouse_controls.addListeners();
  world.graphics.startRender();

}

