var cur_build;
var map = new Object;

const cur_build_color = 0x00ff33;
const connected_color = 0x0088cc;

/*
 * Generates an arrow between two buildings
 *
 * id1- string id of start building
 * id2- string id of end building
 * strength- thickness of arrow
 */
arrow = function(id1, id2, strength) {

	arrows.push(this);

	var thisArr = this;

	var start = id1;
	var end = id2;

	this.start = start;
	this.end = end;
	this.strength = strength;

	p1 = getObj(start).center;
	var p2 = getObj(end).center;

	var mag = Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[2] - p2[2]), 2));
	var theta = -(Math.atan((p2[2] - p1[2]) / (p2[0] - p1[0]))) + Math.PI;

	//correct for atan range
	if (p2[0] < p1[0]) {
		theta += Math.PI;
	}

	var loader = new THREE.JSONLoader();
	var x, z;
	loader.load("../rsc/obj/aaa_arrow/arrow.js", function(geometry) {

		geometry.computeMorphNormals();

		material = new THREE.MeshLambertMaterial({
			color : 0xff0000,
			shading : THREE.SmoothShading
		});

		var mesh = new THREE.Mesh(geometry, material);

		mesh.scale.set((1 / (scale)) * mag * scale - .5 * (scale), .1 * mag * scale, .03 * strength * scale + .5);

		mesh.position.x = getObj(id1).center[0];
		mesh.position.z = getObj(id1).center[2];
		mesh.position.y = 15;
		mesh.rotation.y = theta;

		x = mesh.position.x;
		z = mesh.position.z;
		thisArr.midpt = new Array(x - mag * Math.cos(theta) / 2, .015 * mag * scale + 5, z + mag * Math.sin(theta) / 2);

		scene.add(mesh);

	});

	function start() {
		return start;
	}

	function end() {
		return end;
	}

	function startPt() {
		return p1;
	}

	function endPt() {
		return p2;
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

		//console.log(hitobj);

		//select building
		if (!cur_build) {

			cur_build = hitobj;

			cur_build.material = new THREE.MeshBasicMaterial({
				color : cur_build_color
			});

			// loop through connected
			// for (connected in map.territories[cur_build.id]) {
			// instance(map.territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
			// color : connected_color
			// });
			//
			// }

		} else {

			//deselect current building
			if (hitobj == cur_build) {

				cur_build.material = new THREE.MeshBasicMaterial({
					color : 0xffffff
				});

				// for (connected in map.territories[cur_build.id]) {
				// console.log(map.territories[cur_build.id][connected]);
				// getObj(map.territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
				// color : 0xffffff
				// });
				// }

				cur_build = null;

				//add arrow
			} else if (cur_build.troops > 1) {

				new arrow(cur_build.id, hitobj.id, (cur_build.troops - 1));
				
				var panel = new attackPanel(cur_build, hitobj);
				
				cur_build.troops = 1;

			}
		}
	}

}

const sensitivity = 6;
const border = .08;

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
			old_obj.material["color"] = new THREE.Color(colors[old_obj.team]);
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
			old_obj.material["color"] = new THREE.Color(colors[old_obj.team]);
			old_obj = null;
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

		return ray.intersectObjects(board)[0].object;
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
	if (e == 13 && cur_build) {

		cur_build.material = new THREE.MeshBasicMaterial({
			color : 0xffffff
		});

		for (connected in map.territories[cur_build.id]) {

			getObj(map.territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
				color : 0xffffff
			});
		}

		cur_build = null;
	}

}