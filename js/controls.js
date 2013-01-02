var players = teamdata.getNumPlayers();
var teams = teamdata.getTeams();
var cur_angle = -Math.PI / 2;
total_troops = (teamdata.getNumPlayers()) * 20;
var canvas = document.getElementById('turn_wheel');
var context = canvas.getContext('2d');
var x = canvas.width / 2;
var y = canvas.height / 2;
var radius = 60;

//color a hex string, no leading # or 0x; ex - "ff8800"
draw_arc = function(color, troops) {
	var startAngle = cur_angle;
	var endAngle = startAngle - (troops / total_troops) * 2 * Math.PI;
	cur_angle = endAngle;

	var counterClockwise = true;

	context.beginPath();
	context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	context.lineWidth = 25;

	// line color
	context.strokeStyle = "#" + color;
	context.stroke();
}
update_wheel = function() {

	for (var i = 0; i < players; i++) {
		draw_arc(teamdata.getTeams[i].color, teamdata.getTeams[i].troops);
	}
}
for (var i = 1; i <= players; i++) {
	var team = teams[i];
	var color = team.color;
	draw_arc(color, 20);
}