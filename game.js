function Game(id, io, db) {
  this.id = id;
  this.io = io;
  this.db = db;

  this.stage = 'start';

  // ordering of teams, e.g. [5,2,7,1]
  this.team_order = [];
  this.turn_index = 0;
  this.team_count = 0;  

  // players[team_id] returns player socket list
  this.teams = {};
  
}

Game.prototype = {
  addTeam : function(id) {
      this.team_count += 1;
      this.teams[id] = [];
  },
  addPlayer : function(socket, team_id) {
  
  socket.join(this.id);

  if(!(team_id in this.teams)){
    this.addTeam(team_id);
  }
  this.teams[team_id].push(socket);

     // handle global messages
  socket.on('global message', function(msg) {
    console.log('recieved message:' + msg);
    this.io.emit('global message', msg);
  }.bind(this));

  // handle selecting buildings
  socket.on('building click', function(move_data) {

    console.log("update " + move_data.piece + " to team " + move_data.team);

    this.db.query('select exists(select true from "state"."'+this.id+'" where piece_name=\'' + move_data.piece + '\')', function(err, result) {

      if (result.rows[0]["?column?"]) {
        var query_string = 'UPDATE "state"."test" SET team =\'' + move_data.team + '\', player =\'Bryce\' WHERE  piece_name = \'' + move_data.piece + '\'';
      } else {
        var query_string = 'INSERT INTO "state"."test"(piece_name, team, player) VALUES (\'' + move_data.piece + '\',' + move_data.team + ',\'Bryce\')';
      }

      this.db.query(query_string);

    }.bind(this));

    this.io.to(this.id).emit('building click', move_data);
  }.bind(this));

  },
  move : function(data) {
    var team = data.team;
    var piece = data.piece;
    if(this.team_order[this.turn_index] != team){
      return false;
    } 
    this.turn_index = (this.turn_index + 1) % this.team_count;
    
  },

  // gets the current state and runs callback(state) when done
  getState : function(callback) {
    var ret = {
      status : 200
    };
    this.db.query('SELECT * FROM "global"."games" WHERE id=\'' + this.id + '\'', function(err, result) {

      var data = result.rows[0];
      if (err) {
        callback({
          status : 500
        });
        return;
      }
      ret.id = data.id;
      ret.teams = data.teams;
      ret.stage = data.stage;
      ret.turn = data.turn;
      
      this.db.query('SELECT * FROM "state"."' + this.id + '"', function(err, result) {
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
            team : piece.team
          }
        }
        callback(ret);
      }.bind(this));
    }.bind(this));
  },
  createGame : function(GAME_ID, GAME_DESC, GAME_PRIVACY){

    var query = "\
			INSERT INTO \"global\".\"games\" (id, \"desc\", teams, players, privacy) VALUES (\'"+GAME_ID+"\', \'"+GAME_DESC+"\', 1, 1, "+GAME_PRIVACY+" );\
			\
			SET search_path = teams, pg_catalog;\
			\
			CREATE TABLE \""+GAME_ID+"\"(\
			index smallint NOT NULL,\
			player_count integer DEFAULT 0 NOT NULL,\
			id public.cc_team DEFAULT 'none'::public.cc_team\
			);\
			\
			ALTER TABLE teams.\""+GAME_ID+"\" OWNER TO ccadmin;\
			\
			SET search_path = state, pg_catalog;\
			\
			CREATE TABLE \""+GAME_ID+"\"(\
			    piece_name text NOT NULL,\
			    team smallint DEFAULT 0,\
			    player text DEFAULT '',\
			    \"timestamp\" timestamp with time zone DEFAULT now() NOT NULL\
			);\
			\
			 ALTER TABLE state.\""+GAME_ID+"\" OWNER TO ccadmin;\
			\
			INSERT INTO \""+GAME_ID+"\" (piece_name) VALUES ('duffield');\
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
		          console.log(err);
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
      }
  	});
  }
}

module.exports = Game;
