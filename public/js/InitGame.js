function initGame(id) {
  $('#game-window').show();
  $('#signin-pane').hide();
  $('#game-window').show();
  $('#my-team').text('Team ' + $('input:radio[name=team-choice]:checked').val());

  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    return;
  }

  world = new World(id);
  if (id > 0) {
    socket = io();
    var socket_listeners = new SocketListeners(socket);
    socket_listeners.initListeners();
  }

  var map = new Map();
  var state = new StateHandler();
  // var control_panel = new ControlPanel(world);
  var client_listeners = new ClientListeners();
  var graphics = new Graphics();
  var control_panel_handler = new ControlPanelHandler();
  var window_handler = new WindowHandler();

  world.setMap(map);
  world.setStateHandler(state);
  // world.setControlPanel(control_panel);
  world.setClientListeners(client_listeners);
  world.setGraphics(graphics);
  world.setWindowHandler(window_handler);
  world.setControlPanelHandler(control_panel_handler);

  window_handler.setDimensions();
  control_panel_handler.addListeners();
  client_listeners.addListeners();
  
  world.graphics.startRender();

}
