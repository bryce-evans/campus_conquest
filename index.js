var url = require('url');
var logger = require('morgan');

var socket = require('socket.io');
var express = require('express');
var http = require('http');
var pg = require('pg');
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server);

var constants = require('./constants.js');

var db = new pg.Client(constants.db_url);
db.connect();

var utils = require('./utils.js');
var Api = require('./api.js');
var GameManager = require('./gameManager.js')
var CampusManager = require('./campusManager.js')

var debug = require('./debug.js');

// resolve circular dependencies
// initialize, then set fields
var api = new Api(io,db);
var gm = new GameManager(api);
var cm = new CampusManager();

cm.loadAll();
api.setCampusManager(cm);
api.setGameManager(gm);
gm.setCampusManager(cm);
gm.initGames();

GLOBAL.CC_GLOBALS = {};
var clients = [];

app.use(bodyParser.urlencoded({
  extended : true
}));

app.use('/rsc', express.static(__dirname + '/public/rsc'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.get('/template', function(req, res) {
  res.sendFile(__dirname + '/public/template.html');
});

app.get('/open-games', function(req, res) {
  api.getOpenGames(utils.curry(utils.writeData, res));
});

app.get('/state', function(req, res) {
  var game_id = req.query.id;
  if (game_id && gm.gameExists(game_id)) {
    api.getState(game_id, utils.curry(utils.writeData, res));
  } else {
    res.end('{"status":500,"message":"Game does not exist"}');
  }

});

app.get('/reinforcements', function(req, res) {

  if (req.query.id && req.query.team) {
    api.getReinforcements(req.query.id, req.query.team, utils.curry(utils.writeData, res));
  } else {
    res.end('{"status":500}');
  }

});

app.get('/rooms', function(req, res) {
  console.log(io.sockets.adapter.rooms);
  res.end('wrote data to console');
});

app.get('/about', function(req, res) {
  res.sendFile(__dirname + '/public/about.html');
});

app.get('/sound-test', function(req, res) {
  res.sendFile(__dirname + '/public/sound-test.html');
});

app.get('/design-doc', function(req, res) {
  res.sendFile(__dirname + '/public/DESIGN_DOC.html');
});

app.get('/mcgraw', function(req, res) {
  res.sendFile(__dirname + '/public/mcgraw.html');
});

app.get('/barton', function(req, res) {
  res.sendFile(__dirname + '/public/snow_cloth.html');
});

app.get('/map-editor', function(req, res) {
  res.sendFile(__dirname + '/public/map_builder.html');
});

app.get('/new-game', function(req, res) {
  res.sendFile(__dirname + '/public/create.html');
});

app.get('/remove-game', function(req, res) {
  res.sendFile(__dirname + '/public/remove.html');
});

app.get('/fork', function(req, res) {
  res.sendFile(__dirname + '/public/fork.html');
});

app.post('/create-game', function(req, res) {
  console.log(req.body);
  api.createGame(req.body, function(new_game) {
    console.log("Created game " + new_game.id);
  });
});

app.post('/fork-game', function(req, res) {
  console.log(req.body);
  api.forkGame(req.body.id);
});

app.post('/delete-game', function(req, res) {
  api.deleteGame(req.body.id);
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

app.post('/master-controller', function(req, res) {
  console.log(req.body);
  api.handleMasterRequest(req.body, function(success) {
    utils.writeData(res, success); 
  });
});

io.on('connection', function(socket) {
  clients.push(socket);

  console.log('user ' + socket.id + ' connected');

  // handle messages
  socket.on('message', function(msg_data) {
    console.log('recieved message to ' + msg_data.scope);
    io.to(msg_data.scope).emit('message', msg_data.message);
  }.bind(this));

  /**
   * data contains field game_id : <string>
   * and player : <object>
   *
   * data.player has fields id <string>, name <string>, team <string>
   */
  socket.on('join game', function(data) {
    if (gm.gameExists(data.game_id)) {
      gm.getGame(data.game_id).addPlayer(socket, data.player.team);

      // game this socket is currently in
      socket.game_id = data.game_id;
    } else {
      console.log('failed to join game ' + data.game_id);
      socket.emit('joined', true);
    }
  });

  socket.on('disconnect', function() {
    // disconnect from game if in on
    if (socket.game_id) {
      gm.getGame(socket.game_id).removeClientFromActive(socket);
      console.log('user ' + socket.id + ' disconnected from game ' + socket.game_id);
    }
  });

}.bind(this));

server.listen(constants.port);

