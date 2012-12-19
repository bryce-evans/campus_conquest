<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

	<html lang="en">

		<head>

			<title>Attack Phase | Campus Conquest</title>

			<meta charset="utf-8">

			<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
			<LINK REL=StyleSheet HREF="../css/gamelayout.css" TYPE="text/css">

		</head>

		<body>
			<div id="info">
				Attack Phase-
				<span>&copy; 2012 Campus Conquest</span>
			</div>

			<canvas id="canvas2D" width="1300" height="728" ></canvas>
			<canvas id="canvas3D"></canvas>
			<canvas id="popup" width="600" height="400"></canvas>

			<script type="text/javascript" src="../js/lib/jQuery.js"></script>

			<script src="../js/lib/Three.js"></script>
			<script src="../js/lib/Detector.js"></script>
			<script src="../js/lib/Stats.js"></script>

			<script src="../js/AttackPanel.js"></script>
			<script src="../js/AttackPhase.js"></script>
			<script src="../js/overlayText.js"></script>
			<script src="../map_loader/Loader.js"></script>

			<script type="text/javascript">
				if (!Detector.webgl)
					Detector.addGetWebGLMessage();

				var SCREEN_WIDTH = window.innerWidth;
				var SCREEN_HEIGHT = window.innerHeight;
				const WIDTH_INIT = SCREEN_WIDTH;
				const HEIGHT_INIT = SCREEN_WIDTH;
				const aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

				var buildings = new Array();
				function getObj(id) {
					return buildings[id];
				}

				var arrows = new Array();
				var arrowMeshes = new Array();
				function getArr(start, end) {
					for (i in arrows) {
						if (arrows[i].start == start && arrows[i].end == end) {
							return arrows[i];
						}
					}

					var arr = new arrow(start, end);
					return arr;
				}


				//initialize to center to prevent unwanted pan
				var mouseX = SCREEN_WIDTH / 2;
				var mouseY = SCREEN_HEIGHT / 2;
				var curHoverObj;

				var container, stats;
				var camera, scene, renderer3D;
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
					parseState();

					canvas2D = document.getElementById('canvas2D');
					renderer2D = new THREE.CanvasRenderer({
						canvas : canvas2D
					});

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

					renderer3D.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

					camera.updateProjectionMatrix();

					$("canvas2D").width = SCREEN_WIDTH + 'px';
					$("canvas2D").height = SCREEN_HEIGHT + 'px';

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

			</script>

		</body>

	</html>

