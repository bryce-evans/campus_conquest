var game = require('./game.js');
var index = require('./index.js');

function Api(io, db) {
  this.io = io;
  this.db = db;
}

Api.prototype = {

  createGame : function(data){
if(data.id == undefined){
return false;
}
var GAME_ID = data.id;
var GAME_DESC = data.desc || "";
var GAME_PRIVACY = 2; //data.privacy

    var query = "\
			INSERT INTO \"global\".\"games\" (id, \"desc\", privacy) VALUES (\'"+GAME_ID+"\', \'"+GAME_DESC+"\', "+GAME_PRIVACY+" );\
			\
			SET search_path = teams, pg_catalog;\
			\
			CREATE TABLE \""+GAME_ID+"\"(\
			index smallint NOT NULL,\
			id public.cc_team DEFAULT 'none'::public.cc_team,\
      reinforcements smallint DEFAULT 20,\
      waiting_on boolean DEFAULT false,\
			player_count integer DEFAULT 0 NOT NULL,\
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
			";
		this.db.query(query, function(err, result) {
		        if (err) {
		          console.log(query);
              console.log(err);
		        }else{
              console.log('created game ' + GAME_ID);
}
		});
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
    callback(result.rows);
  });
},

  // gets the current state and runs callback(state) when done
  getState : function(id, callback) {

    var ret = {
      status : 200
    };

    this.db.query('SELECT * FROM "global"."games" WHERE id=\'' + id + '\'', function(err, result) {

      var data = result.rows[0];
      if (err) {
        callback({
          status : 500
        });
        return;
      }

      ret.id = data.id;
      ret.map = data.map;
      ret.stage = data.stage;
      ret.turn = data.turn;
      ret.team_order = {};
      ret.current_team = data.cur_team;
      ret.waiting_on = []; 

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
            if(r.waiting_on) {ret.waiting_on.push(r.index);}
            order[r.index] = r.id;
	        }

	        callback(ret);
	      }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  getReinforcements : function(id, team, callback){
    var team_index = CC_GLOBALS.games[id].team_order.indexOf(team);
    if(team_index < 0) {
      callback({status: 500, error: "team id not found"});
    } else {
    callback({status: 200, id:id, team:team_index, reinforcements: 3});
    }
  }
}

module.exports = Api;
