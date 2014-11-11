var url = require('url');
var logger = require('morgan');

var socket = require('socket.io');
var express = require('express');
var http = require('http');
var pg = require('pg');

var app = express();
var server = http.createServer(app);
var io = socket.listen(server);

var port = 18099;

var conString = "postgres://ccadmin:ccadmin@web469.webfaction.com:5432/bryce_campus_conquest_db";
var db = new pg.Client(conString);
db.connect();
//app.use(logger('dev'));

app.use('/rsc', express.static(__dirname + '/public/rsc'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.get('/state', function(req, res) {
  db.query('SELECT * FROM "territory_grab"."test"', function(err, result) {
    //NOTE: error handling not present

    var ret = {};
    for (var i = 0; i < result.rows.length; i++) {
      var piece = result.rows[i];
      ret[piece.piece_name] = {
        team : piece.team
      }
    }
    var json = JSON.stringify(ret);
    res.writeHead(200, {
      'content-type' : 'application/json',
      'content-length' : Buffer.byteLength(json)
    });
    res.end(json);
  });
});

app.get('/model', function(req, res) {
  res.sendFile(__dirname + '/public/campus.html');
});

app.get('/test', function(req, res) {
  res.sendFile(__dirname + '/public/socket-io-test.html');
});

//var nsp = io.of('/');
io.on('connection', function(socket) {

  console.log('a user connected');

  // handle global messages
  socket.on('global message', function(msg) {
    io.emit('global message', msg);
  });

  // handle selecting buildings
  socket.on('building click', function(move_data) {

    console.log("update " + move_data[1] + " to team " + move_data[0]);

    db.query('select exists(select true from "territory_grab"."test" where piece_name=\'' + move_data[1] + '\')', function(err, result) {

      if (result.rows[0]["?column?"]) {
        var query_string = 'UPDATE "territory_grab"."test" SET team =\'' + move_data[0] + '\', player =\'Bryce\' WHERE  piece_name = \'' + move_data[1] + '\'';
      } else {
        var query_string = 'INSERT INTO "territory_grab"."test"(piece_name, team, player) VALUES (\'' + move_data[1] + '\',' + move_data[0] + ',\'Bryce\')';
      }

      db.query(query_string);

    });

    io.emit('building click', move_data);
  });
});

server.listen(port);
