function Api(io, db) {
  this.io = io;
  this.db = db;
}

Api.prototype = {

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
  },
getOpenGames : function(res){
 this.db.query('SELECT "id","desc","players","privacy" FROM "global"."games"', function(err, result){
    var games = Array(result.rows.length);
    for (var i = 0; i < result.rows.length; i++) {
          var data = result.rows[i];
          var game = {};
          game.id = data.id;
          game.desc = data.desc;
          game.players = data.players;
          game.privacy = data.privacy;

          games[i] = game;          
      }

 var json = JSON.stringify(games);

  res.writeHead(200, {
    'content-type' : 'application/json',
    'content-length' : Buffer.byteLength(json)
  });
  res.end(json);

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
      ret.teams = data.teams;
      ret.stage = data.stage;
      ret.turn = data.turn;
      
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
            team : piece.team
          }
        }
        callback(ret);
      }.bind(this));
    }.bind(this));
  },

}

module.exports = Api;
