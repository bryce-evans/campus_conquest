/*
 * Globals:
 * World, Socket, Me, constants.js data
 *
 */

function initGame(data) {
  $('.pane').hide();
  $('#game-window').show();

  me = {
    id : data.player.id,
    name : data.player.name,
    team : data.player.team,

    options : {
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
    }
  };

  if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    return;
  }

  world = new World(data.game_id);

  var map = new Map();
  var state = new StateHandler();
  var client_listeners = new ClientListeners();
  var graphics = new Graphics();
  var control_panel_handler = new ControlPanelHandler();
  var window_handler = new WindowHandler();

  world.setMap(map);
  world.setStateHandler(state);
  world.setClientListeners(client_listeners);
  world.setGraphics(graphics);
  world.setWindowHandler(window_handler);
  world.setControlPanelHandler(control_panel_handler);

  window_handler.setDimensions();

  var socket = io();
  world.connectToSocket(socket,data);

  client_listeners.addListeners();

  world.graphics.init();
  world.loadWorld({
    has_ground : false
  });
  world.control_panel_handler.updatePanelPlayerData(data);
  world.graphics.animate();

}

