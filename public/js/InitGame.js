/*
 * InitGame
 * Initializes the game 
 * loads the world and sends required info to the server on start
 * 
 * Globals:
 * World, Socket, Me, constants.js data
 *
 */


/**
 *  Manages loading page via anchors (#)
 */
function doHashCheck() {
  if (UI.navPages[tab]) {
    if (UI.device) {
      // only show on drop down
      $('#mobile-menu').text(tab);
    }
    UI.showDisplayFromMenuId(UI.navPages[tab]);
  } else {
    // main entry page
    UI.highlightTab('#tab-featured');
    swapDisplayTo('#stage');
  }
}

function initGame(data) {
  
  // set title of the tab for reference
  document.title = data.game_id + " | Campus Conquest";

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
  
  // load css file for campus
  $("<link/>", {
     rel: "stylesheet",
     type: "text/css",
     href: "/rsc/campuses/" + data.campus + "/style.css"
  }).appendTo("head");
    

  world = new World(data.campus, data.game_id);
  
  // XXX FIXME
  var map = new Map(data.campus);
  var state = new StateHandler();
  var client_listeners = new ClientListeners();
  var graphics = new Graphics();
  var control_panel_handler = new ControlPanelHandler();
  var window_handler = new WindowHandler();
  var override_controller = new OverrideController();
  var notifier = new Notifier();
  var sound_handler = new SoundHandler();

  world.setMap(map);
  world.setStateHandler(state);
  world.setClientListeners(client_listeners);
  world.setGraphics(graphics);
  world.setWindowHandler(window_handler);
  world.setControlPanelHandler(control_panel_handler);
  world.setOverrideController(override_controller);
  world.setNotifier(notifier);
  world.setSoundHandler(sound_handler);

  window_handler.addWindowResizeListener();
  window_handler.setDimensions();

  var socket = io();
  world.connectToSocket(socket, data);

  world.graphics.init();
  client_listeners.initListeners(state.stage);
  
  world.loadWorld({
    has_ground : false
  });
  world.control_panel_handler.updateTextFields({
    game_id : data.game_id,
    player_id : data.player.id,
    player_name : data.player.name,
  });
  
  world.control_panel_handler.setTeam(data.player.team);

  world.override_controller.addListeners();
 
  key_handler.setKeyListener(key_handler.keys.D, function() {
    $('.debug').toggleClass('hidden');
  });

  world.graphics.animate();

}

