var url = require('url');
var logger = require('morgan');

var socket = require('socket.io');
var express = require('express');
var http = require('http');
var pg = require('pg');

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

function newGame(id, io, db) {
  if ( id in games) {
    return false;
  } else {
    games[id] = new Game(id, io, db);
  }
}

newGame('test', io, db);

app.use('/rsc', express.static(__dirname + '/public/rsc'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.get('/open-games', function(req, res) {
 api.getOpenGames(res);
});

app.get('/state', function(req, res) {
  if (req.query.id in games) {
    api.getState(req.query.id, utils.curry(utils.writeData,res));
  } else {
    utils.writeData(res, {status : 404});
  }
});

app.get('/game', function(req, res) {
  res.sendFile(__dirname + '/public/game.html');
});

io.on('connection', function(socket) {
  clients.push(socket);

  console.log('user ' + socket.id + ' connected');

  socket.on('join game', function(data){
    if(data.id in games){
      games[data.id].addPlayer(socket, data.team);
    } else {
      socket.emit('joined',true);
    }
  });

}.bind(this));

server.listen(constants.port);
