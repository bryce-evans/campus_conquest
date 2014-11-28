ControlPanelHandler = function() {
  this.socket
  this.width = 260;
}

ControlPanelHandler.prototype = {
  connectToSocket : function(socket) {
    this.socket = socket;
    if (world.id != '') {
      $('#msgs-global').keypress( function(e) {
        if (e.keyCode == KEYS.ENTER) {
          this.socket.emit('message', {
            scope : world.id,
            message : $('#msgs-global').val()
          });
          $('#msgs-global').val('');
        }
      }.bind(this));
      this.socket.on('message', function(msg) {
        $('#messages').append($('<li>').text(msg));
      });

    } else {
      $('#msgs-global').keypress(function(e) {
        if (e.keyCode == KEYS.ENTER) {
          $('#messages').append($('<li>').text($('#msgs-global').val()));
          $('#msgs-global').val('');
        }
      });
    }
  },
  // goes to data keys and sets text of #panel-<KEY> to value
  updateTextFields : function(data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        $('.' + key).text(data[key]);
      }
    }
  },
  initWheel : function(teams, start) {
    for (var i = start; i < start + teams.length; i++) {
      jQuery('<div/>').css("background-color", '#' + ("000000" + TEAM_DATA[teams[i % teams.length]].colors.primary.toString(16)).slice(-6)).appendTo('#panel-wheel');
    }
    $('#panel-wheel div').css("width", (100 / teams.length) + "%");
  },
  updateWheelToNext : function() {
    $($('#panel-wheel').children()[0]).appendTo('#panel-wheel');
  }
}
// ControlPanel = function() {
//
// this.teams = world.teams;
// this.cur_angle = -Math.PI / 2;
// this.total_troops = (teamdata.getNumPlayers()) * 20;
//
// this.canvas = document.getElementById('turn_wheel');
// this.context = canvas.getContext('2d');
// this.x = canvas.width / 2;
// this.y = canvas.height / 2;
// this.radius = 60;
//
// //color a hex string, no leading # or 0x; ex - "ff8800"
// draw_arc = function(color, troops) {
// var startAngle = cur_angle;
// var endAngle = startAngle - (troops / total_troops) * 2 * Math.PI;
// cur_angle = endAngle;
//
// var counterClockwise = true;
//
// context.beginPath();
// context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
// context.lineWidth = 25;
//
// // line color
// context.strokeStyle = "#" + color;
// context.stroke();
// }
// update_wheel = function() {
//
// for (var i = 0; i < players; i++) {
// draw_arc(teamdata.getTeams[i].color, teamdata.getTeams[i].troops);
// }
// }
// for (var i = 1; i <= players; i++) {
// var team = teams[i];
// var color = team.color;
// draw_arc(color, 20);
// }
// }