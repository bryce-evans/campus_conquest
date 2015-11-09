/**
 * Graphics Handler
 * manages rendering and animating the scene
 * @param {World} world
 */

Graphics = function() {

  this.renderer2D = undefined;
  this.renderer3D = undefined;

  this.scene = new THREE.Scene();
  this.camera = undefined;
  this.projector = undefined;

  this.animation_handler = new AnimationHandler();
  this.current_hover_obj = undefined;

  this.container = undefined;
  this.stats = undefined;

  /*
   *
   *
   canvas2D = document.getElementById('canvas2D');
   renderer3D2D =;

   renderer3D2D.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
   */

  this.complex_geometry = false;
  this.shaders_on = false;

  // must be unique to class because of requestAnimationFrame properties
  this.animate = function() {
    requestAnimationFrame(this.animate);
    this.render();
    this.stats.update();
    this.animation_handler.updateAll();
  }.bind(this);
}

Graphics.prototype = {
  init : function() {

    this.container = $('#container')[0];
    this.ctx2d = $('#canvas2D')[0].getContext('2d');

    this.camera = new THREE.PerspectiveCamera(30, world.window_handler.aspect_ratio, 1, 2000);
    this.camera.position.set(0, 600, 150);
    this.camera.target = new THREE.Vector3(0, 0, 0);
   // this.camera.lookAt(this.camera.target);
    //this.camera.position.x = 0;
    //this.camera.position.z = 150;
    this.scene.add(this.camera);

    var light = new THREE.DirectionalLight(0xffffff, 1.3);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    var light = new THREE.DirectionalLight(0xffffff, 0.1);
    light.position.set(-1, 1, -1);
    this.scene.add(light);

    //world.loadWorld({has_ground: false});

    this.renderer2D = new THREE.CanvasRenderer({
      canvas : $('#canvas2D')[0],
      alpha : true,
    });

    this.renderer3D = new THREE.WebGLRenderer({
      canvas : $('#canvas3D')[0],
      antialias : true,
      alpha : true,
    });

    this.renderer3D.sortObjects = false;
    this.renderer3D.autoClear = false;
    this.renderer3D.gammaInput = true;
    this.renderer3D.gammaOutput = true;

    this.renderer3D.setSize(world.window_handler.dimensions.width, world.window_handler.dimensions.height);

    //this.container.appendChild(this.renderer3D.domElement);

    this.stats = new Stats();
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.bottom = '0px';
    this.stats.domElement.children[ 0 ].children[0].style.color = "#666";
    this.stats.domElement.children[0].style.background = "transparent";
    this.stats.domElement.children[ 0 ].children[1].style.display = "none";
    this.container.appendChild(this.stats.domElement);

  },

  lookAtPiece : function(piece_mesh) {
    var target = piece_mesh.center;
    
    var diff = new THREE.Vector3();
    diff.subVectors(target, this.camera.target);

    this.camera.target.x = target.x;
    this.camera.target.z = target.z;
    
    this.camera.position.x += diff.x;
    this.camera.position.z += diff.z;
    
  },

  render : function() {
    world.client_listeners.panAuto();
    this.overlayText();
    this.camera.lookAt(this.camera.target);
    this.renderer3D.clear();
    this.renderer3D.render(this.scene, this.camera);
  },

  overlayText : function() {

    var ctx2d = this.ctx2d;

    ctx2d.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const ceil = 800;
    const floor = 50;

    const min_font = 18;
    const max_font = 40;

    var height = this.camera.position.y;

    var size = (min_font - max_font) * (height - floor) / (ceil - floor) + max_font;
    var font = ' Goudy Trajan Regular';
    ctx2d.font = "10px" + font;

    ctx2d.fillStyle = "#ffffff";
    ctx2d.shadowOffsetX = 1;
    ctx2d.shadowOffsetY = 1;
    ctx2d.shadowBlur = 2;
    ctx2d.shadowColor = "#000000";
    ctx2d.textAlign = 'center';

    for (var i in world.map.selectable_objects) {

      var mesh = world.map.selectable_objects[i];
      var piece = mesh.game_piece;
      var piece_state = world.state_handler.current.state[piece.id];

      var coord = this.toScreenXY(mesh.center);

      // show name on grab, show units in all other stages
      if (world.state_handler.current.stage == 'grab') {

        ctx2d.fillText(piece.id, coord.x, coord.y);

      } else {
        // text shrinks for pieces far away
        //size = 3*(coord.z + 1917) + 5;
        //ctx2d.font = size + "px helvetica";
        ctx2d.font = (size + 2) + "px" + font;

        // set styles again
        ctx2d.fillStyle = "#ffffff";
        ctx2d.textAlign = 'center';
        
        var units_displayed = piece_state.units;
        /*if (world.state_handler.current.stage === "orders" &&
            world.state_handler.move_data[piece.id]){
            $.each(world.state_handler.move_data[piece.id], function(key, val){
            units_displayed -= val;
            });
          
        }*/
        
        ctx2d.fillText(units_displayed, coord.x, coord.y);
        // XXX TODO
        if (world.state_handler.current.stage === "reinforcement") {
          var to_be_added = world.state_handler.move_data[piece.id];
          if (to_be_added > 0) {
            ctx2d.fillStyle = "#ff3811";
            ctx2d.textAlign = 'left';
            ctx2d.fillText("+" + to_be_added, coord.x + ctx2d.measureText(piece_state.units).width, coord.y);
          }
        }
      }
    }

    ctx2d.font = "22px" + font;
    //ctx2d.font = coord.z + "px helvetica";
    ctx2d.fillStyle = "#ff8800";
    ctx2d.shadowOffsetX = 1;
    ctx2d.shadowOffsetY = 1;
    ctx2d.shadowBlur = 2;
    ctx2d.shadowColor = "#ffffff";
    ctx2d.textAlign = 'center';

    for (var start in world.map.arrows) {
      var bucket = world.map.arrows[start];
      for (var end in bucket) {
        var arrow = bucket[end];
        if (arrow.center && arrow.units > 0) {
          var coord = this.toScreenXY(arrow.center);
          ctx2d.fillText(arrow.units, coord.x, coord.y);
        }
      }
    }
  },

  toScreenXY : function(pos) {

    var projScreenMat = new THREE.Matrix4();
    projScreenMat.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);

    // copy so you don't have side effects!
    var position = new THREE.Vector3();
    position.copy(pos).applyProjection(projScreenMat);
    return {
      x : (position.x + 1 ) * this.renderer3D.domElement.width / 2,
      y : (-position.y + 1) * this.renderer3D.domElement.height / 2,
    };

  }
}
