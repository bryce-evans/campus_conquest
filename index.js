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

var api = new Api(io,db);

var Game = require('./game.js');
var games = {};
var clients = [];

function initGames(io, db) {
api.getOpenGames(function(game_data){
  for(var i in game_data){
    var data= game_data[i]; 
    api.getState(data.id,function(state){
      var data = this;
      data.stage = state.stage;
      data.state = state.state;
      data.turn = state.turn;
       games[data.id] = new Game(data, io, db);
    }.bind(data));
}

});
}

initGames(io, db);


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/rsc', express.static(__dirname + '/public/rsc'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.get('/open-games', function(req, res) {
 api.getOpenGames(utils.curry(utils.writeData,res));
});

app.get('/state', function(req, res) {
  if (req.query.id) {
    api.getState(req.query.id, utils.curry(utils.writeData,res));
  }
});

app.get('/rooms', function(req, res) {
 console.log(io.sockets.adapter.rooms);
//utils.writeData(io.sockets.adapter.rooms, res);

});




app.get('/new-game', function(req, res) {
    res.sendFile(__dirname + '/public/create.html');
});


app.get('/remove-game', function(req, res) {
    res.sendFile(__dirname + '/public/remove.html');
});

app.post('/create-game', function(req, res) {
    console.log(req.body);
    api.createGame(req.body);
});

app.post('/delete-game', function(req, res) {
    api.deleteGame(req.body.id);
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

io.on('connection', function(socket) {
  clients.push(socket);

  console.log('user ' + socket.id + ' connected');

     // handle messages
  socket.on('message', function(msg_data) {
    console.log('recieved message to ' + msg_data.scope);
    io.to(msg_data.scope).emit('message', msg_data.message);
  }.bind(this));

  socket.on('join game', function(data){
    if(data.game_id in games){
     console.log('joined game ' + data.game_id);
      games[data.game_id].addPlayer(socket, data.team);
    } else {
      console.log('failed to join game ' + data.game_id);
      socket.emit('joined',true);
    }
  });

 

}.bind(this));

server.listen(constants.port);
