var game = require('./game.js');
var utils = require('./utils.js');

var debug = require('./debug.js');

function Api(io, db) {
  this.io = io;
  this.db = db;
  // circular dependency with api
  // set with setGameManager()
  this.gm = undefined;
}

Api.prototype = {
	
		/**
 	 * @param {Object} gm
	 */
	setGameManager : function(gm){
		this.gm = gm;
	},
	
	getCornellTeamList : function() {
	  return ['hotel', 'as', 'aap', 'cals', 'ilr', 'eng', 'humec'];
	},


  createGame : function(data, callback){
		console.log(data);
		if (data.game_id == undefined) {
		  return false;
		}

		var GAME_ID = data.game_id;
		var GAME_DESC = data.game_desc || "";
		var GAME_PRIVACY = 2; //data.privacy
    var GAME_MAP = data.map || "Cornell";

    var query = "\
			INSERT INTO \"global\".\"games\" (id, \"desc\", privacy,stage,map) VALUES (\'"+GAME_ID+"\', \'"+GAME_DESC+"\', "+GAME_PRIVACY+",'grab',\'"+GAME_MAP+"\');\
			\
			SET search_path = teams, pg_catalog;\
			\
			CREATE TABLE \""+GAME_ID+"\"(\
			index smallint NOT NULL,\
			id public.cc_team DEFAULT 'none'::public.cc_team,\
      player_count smallint DEFAULT 1,\
      waiting_on boolean DEFAULT true,\
      password text DEFAULT ''\
			);\
			\
			ALTER TABLE teams.\""+GAME_ID+"\" OWNER TO ccadmin;\
			\
			SET search_path = state, pg_catalog;\
			\
			CREATE TABLE \""+GAME_ID+"\"(\
			    piece_name text NOT NULL,\
			    team smallint DEFAULT -1,\
			    units smallint DEFAULT 0 NOT NULL,\
			    player text DEFAULT '',\
			    \"timestamp\" timestamp with time zone DEFAULT now() NOT NULL\
			);\
			\
			 ALTER TABLE state.\""+GAME_ID+"\" OWNER TO ccadmin;\
			\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('olin_lib');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('sage_chapel');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('barnes');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('day');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('lr_conference');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('comstock');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('sage');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('bradfield');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('teagle');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('bio_tech');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('duffield_phillips');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('carpenter');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('stimson');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('mudd_corson');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('ad_white_house');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('olin');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('willard_straight');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('malott');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('caldwell');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('ccc');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('taylor');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('hollister');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('morill');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('bailey');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('snee');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('mcgraw_uris');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('newman');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('morris');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('rand');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('friedmen');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('white');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('olive_taiden');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('uris');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('statler');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('hoy');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('barton');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('baker_olin');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('roberts_kennedy');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('mann');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('ives');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('warren');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('van_ren');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('schoellkopf');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('johnson');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('plant_sci');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('psb_clarke');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('upson');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('ktb');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('rockefeller');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('goldwin');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('rpcc');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('balch');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('dickson');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('ckb');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('low_rises');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('hr5');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('donlon');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('townhouses');\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('appel');\
      ";
		this.db.query(query, function(err, result) {
				
				if (err) {
				  console.log(query);
				  console.log(err);
				} else {
				
				  var all_teams = this.getCornellTeamList();
				  var game_teams = [];
				  for (var i = 0; i < all_teams.length; i++) {
				    if (data[all_teams[i]]) {
				      game_teams.push(all_teams[i]);
				    }
				
				  }
				  utils.shuffle(game_teams);
				  for (var i = 0; i < game_teams.length; i++) {
          var query = "INSERT INTO teams.\"" + GAME_ID + "\" VALUES (" + i + ",'"+ game_teams[i] + "',1,TRUE,'')";
				    this.db.query(query, function(err) {
				      if (err) {
				        console.log('ERROR CREATING GAME');
                console.log(query);
                console.log(err);
				      }
				    });
				  }
        // XXX TODO FIXME game manage requires game be in db
        // db requires it be in game manager...
        // CIRCULAR DEPENDENCY!! :'(
        this.getDbState(GAME_ID, function(state) {
          var new_game = this.gm.createGame(state);
          callback(new_game);
        }.bind(this));
      }
		}.bind(this));
  },
  forkGame : function(GAME_ID) {
    var game_info = {game_id : GAME_ID + " - copy" , game_desc: "Copy of " + GAME_ID};
    this.getState(GAME_ID, function(state_to_copy) {
      console.log('forkGame: state_to_copy', state_to_copy);
      // avoid name collisions for multiple copies of same game
      while (this.gm.gameExists(game_info.game_id)) {
        game_info.game_id += "*";
      }
      this.createGame(game_info, function(new_game) {
        new_game.updateGameData(state_to_copy);
      }.bind(this));
    }.bind(this));
  },
  deleteGame : function(GAME_ID){
  	var query = "\
  			DELETE FROM \"global\".\"games\"  WHERE id = \'"+GAME_ID+ "\';\
			DROP TABLE IF EXISTS teams.\""+GAME_ID+"\";\
			DROP TABLE IF EXISTS state.\""+GAME_ID+"\";\
			";

		this.db.query(query, function(err, result) {
      if (err) {
        console.log(err);
      } else{
 console.log("Dropped Game " + GAME_ID);
}
  	});
  },
getOpenGames : function(callback){
 this.db.query('SELECT "id","desc" FROM "global"."games"', function(err, result){
    var ret = result.rows;
    ret.sort(function(a,b) {
      return a.id > b.id;
    });
    callback(ret);
  });
},

  // gets the current state of game id <string>  and runs callback(state) when done
  // includes data in memory like waiting_on 
  getState : function(id, callback) {
  	this.getDbState(id, function(data){
  		 data.waiting_on = this.gm.getGame(id).getWaitingOn();
  		 callback(data);
  	}.bind(this));
  },
  
  // gets the state from the DB, 
  // does not include temp info like whose turn it is
  getDbState : function(id, callback){
  
    var ret = {
      status : 200
    };
    this.db.query('SELECT * FROM "global"."games" WHERE id=\'' + id + '\'', function(err, result) {

      var data = result.rows[0];
      if (err || data === undefined) {
        callback({
          status : 500, 
          message : "game not found",
        });
        return;
      }
      ret.id = data.id;
      ret.map = data.map;
      ret.stage = data.stage;
      ret.turn = data.turn;
      ret.team_order = {};
      ret.current_team = data.cur_team;
      
      // add the key in the object for better layout of getState()
      ret.waiting_on = undefined;


      this.db.query('SELECT * FROM "state"."' + id + '"', function(err, result) {
        if (err) {
          callback({
            status : 500
          });
          return;
        }
        ret.state = {};
        for (var i = 0; i < result.rows.length; i++) {
          var piece = result.rows[i];
          ret.state[piece.piece_name] = {
            team : piece.team,
            units : piece.units,            
          }
        }
        this.db.query('SELECT * FROM "teams"."' + id + '"', function(err, result) {
	        if (err) {
	          callback({
	            status : 500
	          });
	          return;
	        }
	        ret.team_order = [];
	        var order = ret.team_order;
	        for (var i = 0; i < result.rows.length; i++) {
            var r = result.rows[i];
            order[r.index] = r.id;
	        }
	        callback(ret);
	      }.bind(this));
      }.bind(this));
    }.bind(this));
  },


// TODO  make reinforcment count dynamic
  getReinforcements : function(game_id, team_id, callback){
  	if(!this.gm.gameExists(game_id)){
  		console.log('GAME DOES NOT EXIST');
      callback({status: 500, error: "game not found"});
  	}
    var game = this.gm.getGame(game_id);
    var team_index = game.getTeamIndexFromId(team_id);

    if(team_index < 0) {
      callback({status: 500, error: "team id not found"});
    } else {
      var state = game.state;
      
      var piece_count = 0;
      for (var id in state) {
        if (state.hasOwnProperty(id)) {
          s = state[id]; 
          if (s.team === team_index) {
            piece_count++;
          }
        }
      }
      var reinforcements = Math.ceil(piece_count / 3);
      callback({status: 200, id:game_id, team:team_index, reinforcements: reinforcements});
    }
  },
  /**
   * A set of overrides for debugging
   */
  handleMasterRequest : function(req, callback) {
    console.log("MASTER REQUEST RECEIVED");
    var game_id = req.game_id;
    if(!this.gm.gameExists(game_id)){
  	  console.log('GAME DOES NOT EXIST');
      callback({success: false});
    }
    var g = this.gm.getGame(game_id);
    var key = req.key;
    var command = req.command;
    var data = req.data;
     
    this.io.to(game_id).emit('override');
    switch (command){
      case "reset-turn":
        g.forceResetTurn();
        break;
      case "next-turn":
        g.forceNextTurn();
        break;
      case "set-piece-state":
        var p = data.piece;
        var new_state = {};
        new_state[p] = {
          "units": parseInt(data.units), 
          "team": parseInt(data.team),
        };
        g.updatePartialState(new_state);
        this.io.to(game_id).emit('update partial state', new_state);
        break;
    }
    callback({success: true});
  },
}

module.exports = Api;
