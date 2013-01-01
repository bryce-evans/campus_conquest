var loader = new THREE.JSONLoader();
var dir = "../rsc/obj/";
var global_data = undefined;

var teams = teamdata.getTeams();

var buildings = new Array();
function getObj(id) {
	console.log("getting mesh");
	return buildings[id];
}

function parseState() {

	/*
	 "state_id": "1",
	 "t_id": "dickson",
	 "u_id": "1",
	 "num_troops": "174",
	 "game_id": "1"
	 */

	var game_id = $.ajax({
		url : "/ajax/get_gameid.php",
		async : false
	}).responseText.trim();

	$.ajax({
		url : "ajax/get_state.php?game_id=" + game_id,
		dataType : 'json',
		success : function(jsonobj) {

			jQuery.each(jsonobj, function(ignore, building) {

				var b = getObj(building.t_id);
				if (b) {
					b.setTeam(building.u_id);
					b.troops = building.num_troops;

				} else {
					console.log("ERROR PARSING " + building.t_id);
				}

			});
		},
		error : function(a, b, e) {
			console.log("ERROR CODE IS " + e + ", " + b + ", " + a);
		}
	});

}

loadBoard = function() {

	var material;
	var rhodes, upson, hoy, sage;

	if (global_data == undefined) {
		global_data = $.ajax({
			url : "../map_loader/MapReader.php",
			async : false
		}).responseText;

	} else {
		console.log("Got global data without ajax");
	}

	///////////////////////////////////////////////////

	/**
	 * given an object
	 * returns string array of connected buildings
	 * Precondition: obj must have field called name
	 */
	function getConnected(obj) {
		var name = obj["name"];
		return json["Cornell"]["Territories"][name];
	}

	/**
	 * returns the object in the scene with str as a name
	 * returns undefined if str not in scene
	 */
	function getBuilding(str) {
		return json["Cornell"]["Territories"][str];
	}

	load = function(model) {

		loader.load(dir + model + "/" + model + ".js", function(geometry) {

			geometry.computeMorphNormals();

			material = new THREE.MeshLambertMaterial({
				color : teamdata.getColors()[0],
				shading : THREE.FlatShading,
			});

			var mesh = new THREE.Mesh(geometry, material);
			mesh.connected = json["Cornell"]["Territories"][model];

			mesh.setTeam = function(id) {
				var newmat = mesh.material;
				var newColor = teamdata.getColors()[id];
				newmat["color"] = new THREE.Color(newColor);
				mesh.material = newmat;
				mesh.team = id;//teams[id];
				
			}
			
			// also updates team data
			mesh.setTroops = function(newTroops) {
				oldTroops = mesh.troops;
				mesh.troops = newTroops;
				teams[mesh.team].troops += newTroops - oldTroops;
				
			}


			mesh.scale.set(scale, scale, scale);

			thisTeam = Math.floor((Math.random() * teamdata.getNumPlayers()) + 1);
			mesh.setTeam(thisTeam);
			
			thisTroops = Math.floor((Math.random() * 150) + 100);
			mesh.setTroops(thisTroops);
			
			var team = teams[thisTeam];
	

			mesh.position.y = 0;

			////////

			var sumx = 0;
			var sumy = 0;
			var sumz = 0;
			var counter = 0;
			var verts = mesh.geometry.vertices;
			var center = new Array(3);
			for (index in verts) {
				sumx += verts[index].x;
				sumy += verts[index].y;
				sumz += verts[index].z;
				counter++;

			}

			mesh.center = new Array(scale * sumx / counter, scale * sumy / counter, scale * sumz / counter);

			///////////
			mesh.id = model;
			buildings[model] = mesh;
			board.push(mesh);

			scene.add(mesh);

			//******RAND LOAD

		});
	}
	loadGround = function() {
		loader.load(dir + "aaa_ground/ground.js", function(geometry) {

			material = new THREE.MeshLambertMaterial({
				map : THREE.ImageUtils.loadTexture(dir + "aaa_ground/ground.png"),
				shading : THREE.SmoothShading,
			});

			// var material = new THREE.MeshFaceMaterial();
			var mesh = new THREE.Mesh(geometry, material);

			mesh.scale.set(scale, scale, scale);
			mesh.position.y = 0;
			try {
				scene.add(mesh);
			} catch(err) {
				alert(e.stack);
			}
		});
	}
	///////////////////////////////////////////

	/**
	 * creates a string array of buildings
	 */
	var json = eval('(' + global_data + ')');
	var terr = json["Cornell"]["Territories"];
	var buildingList = new Array();
	var i = 0;

	jQuery.each(terr, function(key, val) {
		buildingList[i++] = key;
	});

	/////////

	loadGround();

	for (index in buildingList) {
		load(buildingList[index]);
	}

}
