teamData = function() {

	var numPlayers = 6;
	var curPlayer = 1;

	var colors = new Array(numPlayers + 1);

	colors[0] = 0xffffff;
	colors[1] = 0xff0000;
	colors[2] = 0xff8a00;
	colors[3] = 0xe4ff00;
	colors[4] = 0x19d500;
	colors[5] = 0x00b2d2;
	colors[6] = 0x7100d0;

	const myTeam = 5;

	this.getColors = function() {
		return colors;
	}

	this.getCurPlayer = function() {
		return curPlayer;
	}
	this.getNumPlayers = function() {
		return numPlayers;
	}
	this.getMyTeam = function() {
		return myTeam;
	}
	//color in form 0x999999
	team = function(id, name, color) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.territories = new Array();
		this.troops = 0;

	}
	//returns array of team data,
	// index 0 is collective data (total troops, undefined color)
	this.getTeams = function() {
		teams = new Array(numPlayers);

		for (var i = 1; i <= numPlayers; i++) {
			if (i === myTeam) {
				teams[i] = new team(i, "ME", colors[i]);
			} else {
				teams[i] = new team(i, "COM", colors[i]);
			}
		}
		return teams;
	}
}
var teamdata = new teamData();
