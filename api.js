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
  setCampusManager : function (cm) {
    this.cm = cm;
  },
	
  createGame : function(data, callback){
		debugger;
    console.log(data);
		if (data.game_id == undefined) {
		  return false;
		}

		var GAME_ID = data.game_id;
		var GAME_DESC = data.game_desc || "";
		var GAME_PRIVACY = 2; //data.privacy
    var GAME_CAMPUS = data.campus || "cornell";
    var GAME_MAP = data.map || "cornell";

    var campus = this.cm.getCampusData(GAME_CAMPUS);

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
			";
    
    var pieces = campus.getPieceList();
    for (var i = 0; i < pieces.length; i++) {
      query += "INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('"+pieces[i]+"');";
    }
		this.db.query(query, function(err, result) {
				
				if (err) {
				  console.log(query);
				  console.log(err);
				} else {
				
				  var all_teams = campus.getTeamList();
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
    
      var reinforcements = {};

      // contribution from number of pieces owned
      var piece_count = 0;
      for (var id in state) {
        if (state.hasOwnProperty(id)) {
          s = state[id]; 
          if (s.team === team_index) {
            piece_count++;
          }
        }
      }
     
     reinforcements.piece_count = Math.ceil(piece_count / 3);

     // contribution from regions
     var regions = game.campus.map.regions;
     debugger;
     var keys =  Object.keys(regions);
     for (var i = 0; i < keys.length; i++) {
       var pieces = regions[keys[i]].pieces;
       var bonus = regions[keys[i]].value;
       for (var j = 1; j < pieces.length; j++) {
         if (state[pieces[j]].team !== team_index) {
           bonus = 0;
           break;
         }
       }
       if (bonus !== 0) {
         reinforcements[keys[i]] = bonus;
       }
     }

     // contribution from contiguous

     // contribution from other
     var total = 0;
     var keys = Object.keys(reinforcements);
     for (var i = 0; i < keys.length; i++) {
       total += reinforcements[keys[i]];
     }

     // always have at least 1 reinforcement
     if (total === 0) {
       reinforcements.other = 1;
       total++;
     }
     
     reinforcements.total = total;

      callback({status: 200, id: game_id, team: team_index, reinforcements : reinforcements});
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
