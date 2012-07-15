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
function onMouseDown(event) {

	event.preventDefault();

	var vector = new THREE.Vector3((event.clientX / window.innerWidth ) * 2 - 1, -(event.clientY / window.innerHeight ) * 2 + 1, 0.5);
	projector.unprojectVector(vector, camera);

	var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

	var intersects = ray.intersectObjects(board)[0];

	if (intersects) {

		var weight = .2;

		//***SOLID COLORATION
		// var newmat = new THREE.MeshBasicMaterial({
		// color : (colors[curPlayer]), // HEX, not string or array
		// reflectivity : 0,
		// ambient : [0, 0, 0]
		//
		// });//
		// intersects.object.material = newmat;

		var newmat = intersects.object.material;
		var newColor = (colors[curPlayer] * weight + 0xffffff * (1 - weight));
		newmat["color"] = new THREE.Color(newColor);
		intersects.object.material = newmat;

		curPlayer = (curPlayer + 1) % numPlayers;

	}

}

const sensitivity = 6;
const border = .08;

function pan(event) {

	mouseX = event.x;
	mouseY = event.y;

	if (event.x > (1 - border) * window.innerWidth) {
		camera.position.x += sensitivity;
		camera.target.x += sensitivity;

	} else if (event.x < border * window.innerWidth) {
		camera.position.x -= sensitivity;
		camera.target.x -= sensitivity;

	}

	if (event.y > (1 - border) * window.innerHeight) {
		camera.position.z += sensitivity;
		camera.target.z += sensitivity;

	} else if (event.y < border * window.innerHeight) {
		camera.position.z -= sensitivity;
		camera.target.z -= sensitivity;

	}

}

function panAuto(x, y) {

	if (x > (1 - border) * window.innerWidth) {
		camera.position.x += sensitivity;
		camera.target.x += sensitivity;

	} else if (x < border * window.innerWidth) {
		camera.position.x -= sensitivity;
		camera.target.x -= sensitivity;

	}

	if (y > (1 - border) * window.innerHeight) {
		camera.position.z += sensitivity;
		camera.target.z += sensitivity;

	} else if (y < border * window.innerHeight) {
		camera.position.z -= sensitivity;
		camera.target.z -= sensitivity;

	}

}