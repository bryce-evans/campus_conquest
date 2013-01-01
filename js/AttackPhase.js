var cur_build;
var map = new Object;
var myTeam = teamdata.getMyTeam();

var pane = new attackPanel("test");

const cur_build_color = 0x8888ff;
const connected_color = 0x0088cc;

/**
 * Centers the current container
 */
jQuery.fn.center = function() {
	this.css("position", "absolute");
	this.css("top", Math.max(0, (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop()) + "px");
	this.css("left", Math.max(0, (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
	return this;
}
/*
 * Generates an arrow between two buildings
 *
 * id1- string id of start building
 * id2- string id of end building
 * strength- thickness of arrow
 */
arrow = function(id1, id2) {

	var thisArr = this;

	arrows.push(thisArr);

	var origin = getObj(id1);
	var end = getObj(id2);
	
	console.log(origin);
	console.log("#" + zeroPad(teams[origin.team].color.toString(16)));

	this.start = id1;
	this.end = id2;
	this.strength = origin.troops - 1;

	var p1 = origin.center;
	var p2 = end.center;

	// find arrow polar coords
	var mag = Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[2] - p2[2]), 2));
	var theta = -(Math.atan((p2[2] - p1[2]) / (p2[0] - p1[0]))) + Math.PI;

	//correct for atan range
	if (p2[0] < p1[0]) {
		theta += Math.PI;
	}

	//get mesh object
	var loader = new THREE.JSONLoader();
	var x, z;
	loader.load("../rsc/obj/aaa_arrow/arrow.js", function(geometry) {

		geometry.computeMorphNormals();

		material = new THREE.MeshLambertMaterial({
			color : 0xff0000,
			shading : THREE.SmoothShading
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.scale.set((1 / (scale)) * mag * scale - .5 * (scale), .1 * mag * scale, .03 * thisArr.strength * scale + .5);

		mesh.position.x = getObj(id1).center[0];
		mesh.position.z = getObj(id1).center[2];
		mesh.position.y = 15;
		mesh.rotation.y = theta;

		x = mesh.position.x;
		z = mesh.position.z;

		thisArr.mesh = mesh;
		thisArr.midpt = new Array(x - mag * Math.cos(theta) / 2, .015 * mag * scale + 5, z + mag * Math.sin(theta) / 2);

		arrowMeshes.push(mesh);

		scene.add(mesh);

	});

	function setStrength(s) {
		this.strength = s;
		//mesh.scale.z = .03 * strength * scale + .5;
	}

}
function zoom(event) {
	const sensitivity = 0.6;
	const ceiling = 800;
	const floor = 50;

	var delta = 0;
	delta = event.wheelDelta * sensitivity;
	var newPos = camera.position.y - delta;
	if (delta && newPos < ceiling && newPos > floor) {
		camera.position.y = newPos;
	}

	//prevent default scrolling on page
	if (event.preventDefault)
		event.preventDefault();
	event.returnValue = false;
}

/**
 *click function, colors buildings for territory grab
 *
 */
var weight = .8;
function onMouseDown(event) {

	event.preventDefault();

	var hitobj = getHitObject();

	if (hitobj) {

		//select building		
		if (!cur_build && hitobj.team == myTeam) {

			cur_build = hitobj;

			cur_build.material = new THREE.MeshLambertMaterial({
				color : cur_build_color
			});

			// loop through connected
			// for (connected in map.territories[cur_build.id]) {
			// instance(map.territories[cur_build.id][connected]).material = new THREE.MeshLambertMaterial({
			// color : connected_color
			// });
			//
			// }

		} else {

			//deselect current building
			if (hitobj == cur_build) {

				cur_build.material["color"] = new THREE.Color(colors[hitobj.team]);

				cur_build = null;

				//change selection
			} else if (hitobj.team == cur_build.team) {
				cur_build.material["color"] = new THREE.Color(colors[old_obj.team]);
				cur_build = hitobj;

				//add attack command
			} else{// if (cur_build.troops > 1 /* && map.contains(hitobj) */ ) {
				console.log(cur_build);
				cur_build.material["color"] = new THREE.Color(colors[cur_build.team]);

				var new_arr = getArr(cur_build.id, hitobj.id);
				new_arr.strength = (cur_build.troops - 1);

				pane.setTo(cur_build, hitobj);

				$("#popup").center();
				$("#popup").css({
					"display" : "block"
				});

				//cur_build.troops = 1;
				cur_build = null;

			}
		}
	} else {
		var cur_arr = getHitArrow();

		if (cur_arr) {
			pane.setTo(getObj(cur_arr.start), getObj(cur_arr.end));
			cur_arr.material["color"] = new THREE.Color(0x00ff00);
		}

	}
}

const sensitivity = 6;
const border = .02;

var old_obj;
var cur_obj;
var mat;

function onMouseMove(event) {

	const highlight = new THREE.Color(0xffff00);

	//refresh mouse location for use in other functions
	mouseX = event.x;
	mouseY = event.y;

	//*****highlights hovered
	cur_obj = getHitObject();

	//if mouse is over a new object than last frame
	//make sure you:
	// have a current object
	// either don't have an old one (was over nothing previously)
	//or the old object isnt the same as the current
	if (cur_obj && (!old_obj || (cur_obj !== old_obj))) {

		//set old obj mat back
		if (old_obj) {

			if (old_obj == cur_build) {
				old_obj.material["color"] = new THREE.Color(cur_build_color);
			} else {
				old_obj.material["color"] = new THREE.Color(colors[old_obj.team]);
			}
		}

		//set new obj to highlight
		mat = cur_obj.material;

		//***SOLID HIGHLIGHT
		//cur_obj.object.material["color"] = highlight;

		curmat = blend(cur_obj.material["color"], highlight);

		old_obj = cur_obj;
	}

	//undoes highlight if no obj hovered over
	else if (!cur_obj) {
		if (old_obj) {
			if (old_obj == cur_build) {
				old_obj.material["color"] = new THREE.Color(cur_build_color);
			} else {
				old_obj.material["color"] = new THREE.Color(colors[old_obj.team]);
			}
			old_obj = null;
		}

		var cur_arr = getHitArrow();

		if (cur_arr) {
			cur_arr.material["color"] = new THREE.Color(0x00ff00);
		}

	}

}

function panAuto(x, y) {
	//right
	if (x > (1 - border) * window.innerWidth && camera.target.x < 450) {
		camera.position.x += sensitivity;
		camera.target.x += sensitivity;

		//left
	} else if (x < border * window.innerWidth && camera.target.x > -300) {
		camera.position.x -= sensitivity;
		camera.target.x -= sensitivity;

	}

	//bottom
	if (y > (1 - border) * window.innerHeight && camera.target.z < 120) {
		camera.position.z += sensitivity;
		camera.target.z += sensitivity;

		//top
	} else if (y < border * window.innerHeight && camera.target.z > -450) {
		camera.position.z -= sensitivity;
		camera.target.z -= sensitivity;

	}
}

function getHitObject() {
	try {
		var vector = new THREE.Vector3((mouseX / window.innerWidth ) * 2 - 1, -(mouseY / window.innerHeight ) * 2 + 1, 0.5);
		projector.unprojectVector(vector, camera);

		var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

		// if (ray.intersectObjects(arrows)[0].object) {
		// return ray.intersectObjects(arrows)[0].object;
		// } else {

		return ray.intersectObjects(board)[0].object;
		// }
	} catch(err) {
		return null;
	}
}

function getHitArrow() {
	try {
		var vector = new THREE.Vector3((mouseX / window.innerWidth ) * 2 - 1, -(mouseY / window.innerHeight ) * 2 + 1, 0.5);
		projector.unprojectVector(vector, camera);

		var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

		return ray.intersectObjects(arrowMeshes)[0].object;
		// }
	} catch(err) {
		return null;
	}
}

function blend(mat1, mat2) {
	mat1.r = (mat1.r + mat2.r) / 2;
	mat1.g = (mat1.g + mat2.g) / 2;
	mat1.b = (mat1.b + mat2.b) / 2;
	return mat1;
}

function contains(obj, array) {

	for (index in array) {

		if (index == obj) {
			return true;
		}
	}
	return false;
}

//
function keyControls(e) {
	e = window.event || e;
	e = e.charCode || e.keyCode;

	//enter key
	if (e == 13) {
		pane.active = false;
	}

}