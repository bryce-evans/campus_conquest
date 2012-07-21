<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

	<html lang="en">

		<head>

			<title>Model Test</title>

			<meta charset="utf-8">

			<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">

			<style>
				body {
					cursor: url(rsc/images/icons/crosshairs_red.png) -12px -12px, crosshair;
					background: #000;
					color: #fff;
					padding: 0;
					margin: 0;
					font-weight: bold;
					overflow: hidden;
				}

				span {
					color: #ffaa55;
				}

				#info {
					position: absolute;
					top: 0px;
					width: 100%;
					color: #ffffff;
					padding: 5px;
					font-family: Monospace;
					font-size: 13px;
					text-align: center;
					z-index: 1000;
				}

				#controls {
					position: absolute;
					float: right;
					bottom: 10px;
					width: 100%;
					height: 160px;
					background-color: rgba(0,0,0,.5);
					-moz-border-radius: 10px;
					border-radius: 10px;
					color: #ccc;
					font-family: georgia;
					font-size: 13px;
					text-align: center;
					z-index: 1000;
				}

			</style>

		</head>

		<body>
			<div id="info">
				Map Builder Test-
				<span>&copy; 2012 Campus Conquest</span>
			</div>

			<div id="controls">
				Controls

				<!-- 				<form>
				<input id="terr_b" type="button" onclick="onclick();" value="Edit Territories" />

				<br />
				<input id="cont_b" type="button" onclick="onclick();" value="Edit Continents" />
				<br />
				<input id="export_b" type="button" onclick="onclick();" value="Export" />

				</form> -->

			</div>

			<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
			<script src="js/Three.js"></script>
			<script src="js/Detector.js"></script>
			<script src="js/Stats.js"></script>
			<!-- <script src="js/MouseControls.js"></script> -->
			<script src="js/mapBuilder.js"></script>
			<!-- <script src="map_loader/loadMap.php"></script> -->
			<script src="map_loader/Loader.js"></script>

			<?php $map; ?>

			<script type="text/javascript">
                window.onload = maxWindow;

                function onclick() {
                    console.log("clicked!");
                }

                function maxWindow() {
                    window.moveTo(0, 0);

                    if(document.all) {
                        top.window.resizeTo(screen.availWidth, screen.availHeight);
                    } else if(document.layers || document.getElementById) {
                        if(top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
                            top.window.outerHeight = screen.availHeight;
                            top.window.outerWidth = screen.availWidth;
                        }
                    }
                }

			</script>
			<script type="text/javascript">
                if(!Detector.webgl)
                    Detector.addGetWebGLMessage();

                var SCREEN_WIDTH = window.innerWidth;
                var SCREEN_HEIGHT = window.innerHeight;
                const WIDTH_INIT = SCREEN_WIDTH;
                const HEIGHT_INIT = SCREEN_WIDTH;
                const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

                var buildings = new Array();
                function objLookup(id) {
                    return buildings[id];
                }

                //initialize to center to prevent unwanted pan
                var mouseX = SCREEN_WIDTH / 2;
                var mouseY = SCREEN_HEIGHT / 2;
                var curHoverObj;

                var container, stats;
                var camera, scene, renderer;
                var board = new Array();

                var scale = 15;

                var numPlayers = 6;
                var curPlayer = 1;
                var colors = new Array(numPlayers + 1);

                colors[0] = 0xffffff;
                colors[1] = 0xff0000;
                colors[2] = 0xffff00;
                colors[3] = 0x00ff00;
                colors[4] = 0x00ffff;
                colors[5] = 0x0000ff;
                colors[6] = 0xff00ff;

                init();
                animate();

                function init() {

                    container = document.createElement('page');

                    document.body.appendChild(container);

                    var info = document.getElementById('info');

                    container.appendChild(info);

                    //

                    scene = new THREE.Scene();

                    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
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

                    renderer = new THREE.WebGLRenderer({
                        antialias : true
                    });

                    renderer.sortObjects = false;
                    renderer.autoClear = false;

                    renderer.gammaInput = true;
                    renderer.gammaOutput = true;

                    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

                    container.appendChild(renderer.domElement);

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
                    document.oncontextmenu = new Function("return false")

                    //Add Listeners
                    window.addEventListener('resize', onWindowResize, false);
                    document.addEventListener('mousedown', onMouseDown, false);
                    document.addEventListener('mousedown', zoom, false);
                    document.addEventListener('mousewheel', zoom, false);
                    document.addEventListener('keypress', keyControls, false);
                    document.addEventListener('mousemove', onMouseMove, false);

                }

                //

                function onWindowResize(event) {

                    SCREEN_WIDTH = window.innerWidth;
                    SCREEN_HEIGHT = window.innerHeight;

                    // if(SCREEN_WIDTH > WIDTH_INIT) {
                    // renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT/ aspect);
                    // }

                    // if(SCREEN_HEIGHT > HEIGHT_INIT) {
                    // renderer.setSize(SCREEN_WIDTH * aspect, SCREEN_WIDTH);
                    // }

                    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT / aspect);

                    //***Changes aspect ratio on resize -- causes distortion
                    // renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

                    //camera.aspect = 0.5 * SCREEN_WIDTH / SCREEN_HEIGHT;
                    camera.updateProjectionMatrix();

                }

                //

                function animate() {

                    requestAnimationFrame(animate);

                    render();

                    stats.update();

                }

                function render() {

                    objLookup("duffield_phillips").rotation.y += .1;

                    panAuto(mouseX, mouseY);

                    camera.lookAt(camera.target);

                    renderer.clear();

                    renderer.render(scene, camera);

                }

			</script>

		</body>

	</html>

