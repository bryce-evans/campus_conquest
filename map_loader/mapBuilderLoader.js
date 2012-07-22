//var json = '<?php echo $map?>';
// var myObject = JSON.parse(myJSONtext, reviver);
var jsonString = '{ "Cornell": { "Continents": { "EngineeringQuad": [ "duffield_phillips", "rhodes", "upson" ], "ArtsQuad": [ "goldwin", "mcgraw_uris", "taylor" ], "Central": [ "statler", "sage" ] }, "Territories": { "duffield_phillips": [ "upson", "hoy", "taylor" ], "taylor": [ "sage", "mcgraw_uris" ], "hoy": [ "upson" ], "sage": [ "statler", "mcgraw_uris", "duffield_phillips" ] } } }';

var json = eval('(' + jsonString + ')');

// alert("getBuildingList: " + getBuildingList());
// alert("getBuilding: " + getBuilding("sage"));

/**
 * creates a string array of buildings
 */

var terr = json["Cornell"]["Territories"];
var buildingList = new Array(terr.length);
var i = 0;

jQuery.each(terr, function(key, val) {
	buildingList[i++] = key;
});

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

loadBoard = function() {
	var loader = new THREE.JSONLoader();
	var material;
	var rhodes, upson, hoy, sage;

	var dir = "../rsc/obj/";
	var unfinished_models = ["ad_white_house", "alumni", "appel", "bailey", "baker_olin", "balch", "barnes", "barton", "bio_tech", "bradfield", "caldwell", "carpenter", "ccc", "ckb", "comstock", "day", "dickson", "donlon", "duffield_phillips", "friedmen", "goldwin", "h_newman", "hollister", "hoy", "hr5", "ives", "jameson", "johnson", "kane", "ktb", "low_rises", "lr_conference", "malott", "mann", "morill", "morris", "mudd_corson", "newman", "observatory", "olive_taiden", "plant_sci", "psb_clarke", "rand", "roberts_kennedy", "rockefeller", "sage_chapel", "schoellkopf", "snee", "statler", "stimson", "teagle", "townhouses", "upson", "van_ren", "warren", "white", "willard_straight"];
	var models = ["sage", "mcgraw_uris", "uris"];

	loader.load(dir + "aaa_ground/ground.js", function(geometry) {

		var material = new THREE.MeshFaceMaterial();
		var mesh = new THREE.Mesh(geometry, material);

		mesh.scale.set(scale, scale, scale);
		mesh.position.y = 0;
		mesh.included = false;

		scene.add(mesh);

	});

	load = function(model) {

		loader.load(dir + model + "/" + model + ".js", function(geometry) {

			geometry.computeMorphNormals();

			material = new THREE.MeshLambertMaterial({
				map : THREE.ImageUtils.loadTexture(dir + model + "/" + model + ".png"),
				color : 0xcc6666,
				shading : THREE.FlatShading
			});

			var mesh = new THREE.Mesh(geometry, material);

			mesh.scale.set(scale, scale, scale);
			mesh.id = model;
			buildings[model] = mesh;
			mesh.position.y = 0;
			mesh.team = 0;
			board.push(mesh);
			scene.add(mesh);

		});
	}
	loadBasic = function(model) {

		loader.load(dir + model + "/" + model + ".js", function(geometry) {

			geometry.computeMorphNormals();

			material = new THREE.MeshLambertMaterial({
				color : 0xcc6666,
				shading : THREE.FlatShading
			});

			var mesh = new THREE.Mesh(geometry, material);
			mesh.connected = json["Cornell"]["Territories"][model];

			mesh.scale.set(scale, scale, scale);
			mesh.team = 0;
			mesh.position.y = 0;

			///////////////////////////////////////////

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

			///////////////////////////////////////////
			mesh.id = model;
			buildings[model] = mesh;
			board.push(mesh);
			scene.add(mesh);
		});
	}
	// for(index in buildingList) {
	// var model = buildingList[index];
	// loadBasic(model);
	// }

	for (index in unfinished_models) {
		var model = unfinished_models[index];
		loadBasic(model);
	}

	for (index in models) {
		var model = models[index];
		loadBasic(model);
	}
}
