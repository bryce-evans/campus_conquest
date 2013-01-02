var TROOPS_INIT = 100;
var is_my_turn = true;

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
	
	if (!is_my_turn){
		alert("not my turn");
		return;
	}

	var jsonobj = new Object;
	var u_id = $.ajax({ url : "ajax/get_id.php", async : false}).responseText.trim();
	var game_id =  $.ajax({ url : "ajax/get_gameid.php", async : false}).responseText.trim();
	
	if (u_id == -1 || game_id == -1){
		return;
	}
	
	jsonobj.u_id = u_id;
	jsonobj.num_troops = TROOPS_INIT;
	
	var hitobj = getHitObject();

	if (hitobj) {

		console.log("Clicked: " + hitobj.id);
		console.log(hitobj);

		if (hitobj.team == 0) {
			//***SOLID COLORATION
			// var newmat = new THREE.MeshBasicMaterial({
			// color : (colors[curPlayer]), // HEX, not string or array
			// reflectivity : 0,
			// ambient : [0, 0, 0]
			//
			// });//
			// hitobj.material = newmat;

			var newmat = hitobj.material;
			var newColor = (("0x" + colors[curPlayer]) * weight + 0xffffff * (1 - weight));
			newmat["color"] = new THREE.Color(newColor);
			hitobj.material = newmat;
			hitobj.team = curPlayer;

			jsonobj.t_id = hitobj.id;
			jsonobj.game_id = game_id;
			
			$.ajax({
			  type: 'POST',
			  url: "ajax/get_territory.php",
			  data: { json : jsonobj },
			  datatype: "json",
			  success: function(result){
			  	alert("Picked " + hitobj.id);
			  }
			});
			
			// const conn_color = 0xffffff;
			// var conbuilds = "";
			// for(building in hitobj["connected"]) {
			// try {
			// objLookup(hitobj["connected"][building]).material["color"] = new THREE.Color(0x888888);
			// conbuilds = conbuilds + " " + (hitobj["connected"][building]);
			// } catch(err) {
			// }
			// }
			// console.log("Connected: " + conbuilds);
			curPlayer = curPlayer % numPlayers + 1;
		} else {
			console.log(hitobj.team);
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
			old_obj.material["color"] = new THREE.Color("0x" + colors[old_obj.team]);
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
			old_obj.material["color"] = new THREE.Color("0x" + colors[old_obj.team]);
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

function printrgb(mat) {
	console.log(mat["color"].r + " " + mat["color"].g + " " + mat["color"].b);
}

function blend(mat1, mat2) {
	mat1.r = (mat1.r + mat2.r) / 2;
	mat1.g = (mat1.g + mat2.g) / 2;
	mat1.b = (mat1.b + mat2.b) / 2;
	return mat1;
}
