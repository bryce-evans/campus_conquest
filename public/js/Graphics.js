/**
 * Graphics Handler
 *  manages rendering and animating the scene
 * @param {Object} world
 */

Graphics = function(world) {
  this.world = world;

  this.scene = new THREE.Scene();
  this.camera;
  this.projector;
  this.renderer;

  this.current_hover_obj;

  this.container;
  this.stats;

  this.init = function() {

    this.container = document.createElement('page');
    document.body.appendChild(this.container);
    this.container.appendChild(document.getElementById('info'));

    this.camera = new THREE.PerspectiveCamera(30, this.world.window_handler.aspect_ratio, 1, 2000);
    this.camera.position.set(0, 600, 0);
    this.camera.target = new THREE.Vector3(0, 0, 0);
    this.camera.position.x = 0;
    this.camera.position.z = 150;
    this.scene.add(this.camera);

    this.projector = new THREE.Projector();

    var light = new THREE.DirectionalLight(0xffffff, 1.3);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(-1, 1, -1);
    this.scene.add(light);

    this.world.map.loadBoard();

    this.renderer = new THREE.WebGLRenderer({
      antialias : true
    });

    this.renderer.sortObjects = false;
    this.renderer.autoClear = false;

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.renderer.setSize(this.world.window_handler.dimensions.width, this.world.window_handler.dimensions.height);

    this.container.appendChild(this.renderer.domElement);

		this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.children[ 0 ].children[0].style.color = "#666";
    this.stats.domElement.children[0].style.background = "transparent";
    this.stats.domElement.children[ 0 ].children[1].style.display = "none";
    this.container.appendChild(this.stats.domElement);

  }
  this.animate = function() {
    requestAnimationFrame(this.animate);
    this.render();
    this.stats.update();
  }.bind(this)

  this.render = function() {

    this.world.mouse_controls.panAuto(this.mouseX, this.mouseY);

    this.camera.lookAt(this.camera.target);

    this.renderer.clear();

    this.renderer.render(this.scene, this.camera);

  }

  this.startRender = function() {

    //initialize to center to prevent unwanted pan
    var mouseX = this.world.window_handler.dimensions.width / 2;
    var mouseY = this.world.window_handler.dimensions.height / 2;

    this.init();
    this.animate();

  }
}
