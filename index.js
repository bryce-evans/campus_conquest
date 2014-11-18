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

var Game = require('./game.js');
var games = {};

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

app.get('/state', function(req, res) {
  function writeState(state) {
    var json = JSON.stringify(state);
    res.writeHead(200, {
      'content-type' : 'application/json',
      'content-length' : Buffer.byteLength(json)
    });
    res.end(json);
  }

  if (req.query.id in games) {
    games[req.query.id].getState(writeState);
  } else {
    writeState({
      status : 404
    });
  }
});

app.get('/model', function(req, res) {
  res.sendFile(__dirname + '/public/campus.html');
});

app.get('/test', function(req, res) {
  res.sendFile(__dirname + '/public/socket-io-test.html');
});

//var nsp = io.of('/');

this.current_turn = 1;
this.teams = 7;
this.clients = [];
this.nextTurn = function() {
  this.current_turn = (this.current_turn + 1) % this.teams + 1;
}

io.on('connection', function(socket) {
  this.clients.push(socket);

  console.log('user ' + socket.id + ' connected');

  // handle global messages
  socket.on('global message', function(msg) {
    console.log('recieved message:' + msg);
    io.emit('global message', msg);
  });

  // handle selecting buildings
  socket.on('building click', function(move_data) {

    console.log("update " + move_data.piece + " to team " + move_data.team);

    db.query('select exists(select true from "state"."test" where piece_name=\'' + move_data.piece + '\')', function(err, result) {

      if (result.rows[0]["?column?"]) {
        var query_string = 'UPDATE "state"."test" SET team =\'' + move_data.team + '\', player =\'Bryce\' WHERE  piece_name = \'' + move_data.piece + '\'';
      } else {
        var query_string = 'INSERT INTO "state"."test"(piece_name, team, player) VALUES (\'' + move_data.piece + '\',' + move_data.team + ',\'Bryce\')';
      }

      db.query(query_string);

    });

    io.emit('building click', move_data);
  });
}.bind(this));

server.listen(constants.port);
