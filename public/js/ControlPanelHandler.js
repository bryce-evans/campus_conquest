ControlPanelHandler = function() {
  this.width = 260;

  if (world.id > 0) {
    $('#msgs-global').keypress(function(e) {
      if (e.keyCode == 13) {
        socket.emit('global message', $('#msgs-global').val());
        $('#msgs-global').val('');
      }
    });
    socket.on('global message', function(msg) {
      $('#messages').append($('<li>').text(msg));
    });

  } else {
    $('#msgs-global').keypress(function(e) {
      if (e.keyCode == 13) {
        $('#messages').append($('<li>').text($('#msgs-global').val()));
        $('#msgs-global').val('');
      }
    });

  }
  this.addListeners = function() {

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