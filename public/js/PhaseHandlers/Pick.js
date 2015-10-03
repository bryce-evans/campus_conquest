if (!Detector.webgl)
	Detector.addGetWebGLMessage();
	
	var controls_height = 0;

//dimensions of map pane
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight - controls_height;

const WIDTH_INIT = SCREEN_WIDTH;
const HEIGHT_INIT = SCREEN_WIDTH;

const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

var buildings = new Array();
function getObj(id) {
	return buildings[id];
}


//initialize to center to prevent unwanted pan
var mouseX = SCREEN_WIDTH / 2;
var mouseY = SCREEN_HEIGHT / 2;

var container, stats;
var camera, scene, renderer3D;
var board = new Array();

var scale = 15;

var numPlayers = teamdata.getNumPlayers();
var curPlayer = teamdata.getCurPlayer();
var colors = teamdata.getColors();

init();
animate();

function init() {

	//container holding 2D,3D canvas objects
	// does NOT hold controls or other pop ups
	container = document.getElementById("container");
	document.body.appendChild(container);
	var info = document.getElementById('info');
	container.style.height =  SCREEN_HEIGHT;
	container.style.width =  SCREEN_WIDTH;
	container.appendChild(info);

	//

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(30, SCREEN_WIDTH  / SCREEN_HEIGHT, 1, 2000);
	camera.position.set(0, 600, 0);
	camera.target = new THREE.Vector3(0, 0, 0);
	camera.position.x = 0;
	camera.position.z = 150;
	//for ~60deg angle look down
	scene.add(camera);

	projector = new THREE.Projector();

	//

	var light = new THREE.DirectionalLight(0xffffff, 1.3);

	light.position.set(1, 1, 1);

	scene.add(light);

	var light = new THREE.DirectionalLight(0xffffff, 0.1);

	light.position.set(-1, 1, -1);

	scene.add(light);

	//

	loadBoard();
	//parseState();

	canvas2D = document.getElementById('canvas2D');
	renderer2D = new THREE.CanvasRenderer({
		canvas : canvas2D
	});

	renderer2D.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	canvas3D = document.getElementById('canvas3D');
	renderer3D = new THREE.WebGLRenderer({
		antialias : true,
		canvas : canvas3D
	});

	renderer3D.sortObjects = false;
	renderer3D.autoClear = false;

	renderer3D.gammaInput = true;
	renderer3D.gammaOutput = true;

	renderer3D.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	container.appendChild(renderer3D.domElement);

	//***STATS- TO BE REMOVED
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.children[ 0 ].children[0].style.color = "#666";
	stats.domElement.children[0].style.background = "transparent";
	stats.domElement.children[ 0 ].children[1].style.display = "none";
	container.appendChild(stats.domElement);

	//
	function getKeyCode(e) {
		e = window.event || e;
		e = e.charCode || e.keyCode;
		console.log("Key " + e + " pressed");
	}

	//disable right click
	//document.oncontextmenu = new Function("return false")

	//Add Listeners
	window.addEventListener('resize', onWindowResize, false);
	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('mousedown', zoom, false);
	document.addEventListener('mousewheel', zoom, false);
	document.addEventListener('keypress', getKeyCode, false);
	document.addEventListener('mousemove', onMouseMove, false);

}

//

function onWindowResize(event) {

	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight - controls_height;

	renderer3D.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

	camera.updateProjectionMatrix();

}

//

function animate() {

	requestAnimationFrame(animate);

	render();
	overlayText();

	stats.update();

}

function render() {

	panAuto(mouseX, mouseY);

	camera.lookAt(camera.target);

	renderer3D.clear();

	renderer3D.render(scene, camera);

}