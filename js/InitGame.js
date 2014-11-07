function initGame() {
  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    return;
  }

  world = new World();

  var map = new Map(world);
  var state = new StateHandler(world);
  // var control_panel = new ControlPanel(world);
  var mouse_controls = new MouseControls(world);
  var graphics = new Graphics(world);
  var window_handler = new WindowHandler(world);

  world.setMap(map);
  world.setStateHandler(state);
  // world.setControlPanel(control_panel);
  world.setMouseControls(mouse_controls);
  world.setGraphics(graphics);
  world.setWindowHandler(window_handler);
  
  mouse_controls.addListeners();
  world.graphics.startRender();

}

$(document).ready(function(){
	initGame();
});
