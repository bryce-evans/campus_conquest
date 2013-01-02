teamData = function() {

	var numPlayers = 6;
	var curPlayer = 1;

	var colors = new Array(numPlayers + 1);

	colors[0] = "ffffff";
	colors[1] = "ff0000";
	colors[2] = "ff8a00";
	colors[3] = "e4ff00";
	colors[4] = "19d500";
	colors[5] = "00b2d2";
	colors[6] = "7100d0";

	const myTeam = 1;

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
	
	this.teams = new Array(numPlayers);

	for (var i = 1; i <= numPlayers; i++) {
		if (i === myTeam) {
			this.teams[i] = new team(i, "ME", colors[i]);
		} else {
			this.teams[i] = new team(i, "COM", colors[i]);
		}
	}

	this.getTeams = function() {
		return this.teams;
	}
	//returns array of team data,
	// index 0 is collective data (total troops, undefined color)

}
var teamdata = new teamData();
