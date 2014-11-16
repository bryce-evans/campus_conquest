/**
 * Graphics Handler
 *  manages rendering and animating the scene
 * @param {Object} world
 */

Graphics = function() {
  this.scene = new THREE.Scene();
  this.camera
  this.projector
  this.renderer

  this.current_hover_obj

  this.container
  this.stats
  
  this.complex_geometry = false;
  this.shaders_on = false;

  // must be unique to class because of requestAnimationFrame properties
  this.animate = function() {
    requestAnimationFrame(this.animate);
    this.render();
    this.stats.update();
  }.bind(this);
}

Graphics.prototype.init = function() {

  this.container = document.createElement('page');
  document.body.appendChild(this.container);

  this.camera = new THREE.PerspectiveCamera(30, world.window_handler.aspect_ratio, 1, 2000);
  this.camera.position.set(0, 600, 0);
  this.camera.target = new THREE.Vector3(0, 0, 0);
  this.camera.position.x = 0;
  this.camera.position.z = 150;
  this.scene.add(this.camera);

  var light = new THREE.DirectionalLight(0xffffff, 1.3);
  light.position.set(1, 1, 1);
  this.scene.add(light);

  var light = new THREE.DirectionalLight(0xffffff, 0.1);
  light.position.set(-1, 1, -1);
  this.scene.add(light);

  world.map.loadBoard({game_id: world.id});

  this.canvas3D = $('#canvas3D');
  this.renderer = new THREE.WebGLRenderer({
  	canvas : canvas3D,
    antialias : true,
    alpha : true,
  });

  this.renderer.sortObjects = false;
  this.renderer.autoClear = false;
  this.renderer.gammaInput = true;
  this.renderer.gammaOutput = true;

  this.renderer.setSize(world.window_handler.dimensions.width, world.window_handler.dimensions.height);

  this.container.appendChild(this.renderer.domElement);

  this.stats = new Stats();
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.bottom = '0px';
  this.stats.domElement.children[ 0 ].children[0].style.color = "#666";
  this.stats.domElement.children[0].style.background = "transparent";
  this.stats.domElement.children[ 0 ].children[1].style.display = "none";
  this.container.appendChild(this.stats.domElement);

}

Graphics.prototype.render = function() {

  world.client_listeners.panAuto(this.mouseX, this.mouseY);

  this.camera.lookAt(this.camera.target);

  this.renderer.clear();

  this.renderer.render(this.scene, this.camera);

}

Graphics.prototype.startRender = function() {

  //initialize to center to prevent unwanted pan
  var mouseX = world.window_handler.dimensions.width / 2;
  var mouseY = world.window_handler.dimensions.height / 2;

  this.init();
  this.animate();

}

