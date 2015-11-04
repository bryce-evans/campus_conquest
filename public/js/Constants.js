/**
 * Constants
 * Misc constants used for team information
 * and display
 */
TEAM_DATA = {
  hotel : {
    name : "Hotel",
    colors : {
      primary : 0xb21c1d,
      secondary : 0x7e0a0b,
    },
  },
  as : {
    name : "Arts & Sciences",
    colors : {
      primary : 0xf1592a,
      secondary : 0xd73520,
    },
  },
  aap : {
    name : "Archetecture & Arts Planning",
    colors : {
      primary : 0xffc010,
      secondary : 0xf5a11a,
    },
  },
  cals : {
    name : "CALS",
    colors : {
      primary : 0x71bf45,
      secondary : 0x3cb04b,
    },
  },
  ilr : {
    name : "ILR",
    colors : {
      primary : 0x0184ba,
      secondary : 0x4263ae,
    },
  },
  eng : {
    name : "Engineering",
    colors : {
      primary : 0x474187,
      secondary : 0x43346d ,
    },
  },
  humec : {
    name : "Human Ecology",
    colors : {
      primary : 0xb03c83,
      secondary : 0xbb0677,
    },
  },
}

KEYS = {
	ENTER : 13
}

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
