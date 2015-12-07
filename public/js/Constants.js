/**
 * Constants
 */

CURSORS = {
	GREEN_DOT : 'url(/rsc/images/cursors/pointer-green.png) 16 16, pointer',
	RED_DOT : 'url(/rsc/images/cursors/pointer-green-dot-red.png) 16 16, pointer',
	CROSSHAIRS : 'url(/rsc/images/cursors/crosshairs_red.png) 16 16, pointer'
}

CONSTANTS = {
  STAGES : {
    START : "start",
    GRAB : "grab",
    REINFORCEMENT : "reinforcement",
    ORDERS : "orders",
  },
  IO : {
    JOIN_GAME : "join game",
    STAGE_UPDATE : "stage update",
    GRAB_UPDATE : "grab update",
    ORDERS_UPDATE : "orders update",
    REINFORCEMENT_UPDATE : "reinforcement update",
    // update on who is left to move
    WAITING_ON_UPDATE : "waiting-on update",
    // signifies master controls were used and something changed
    OVERRIDE : "override",
    // signifies client is out of sync and needs a refresh
    SERVER_SYNC : "server sync",
  },
  URL : {
    STATE : "/state",
    GAME : "/game",
    REINFORCEMENTS : "/reinforcements",
    MASTER_CONTROLLER : "/master-controller",
  },
}
