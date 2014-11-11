ClientListeners = function() {

  //speed of panning
  this.pan_speed = 6;
  this.zoom_speed = 0.6;

  this.zoom_ceiling = 800;
  this.zoom_floor = 50;

  // % of frame that allows for panning
  this.border = .1;

  // weight of highlight colors vs texture
  this.weight = .8;

  this.old_obj
  this.cur_obj
  this.mat

  this.mouseX
  this.mouseY

  // must use this.fn for listeners to bind this obj to this instead of window or the event
  this.addListeners = function() {
    //disable right click
    //document.oncontextmenu = new Function("return false")

    //Add Listeners
    $('#canvas3D').click(this.onMouseDown);
    document.addEventListener('mousedown', this.zoom, false);
    document.addEventListener('mousewheel', this.zoom, false);
    document.addEventListener('keypress', this.getKeyCode, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
  }

  this.zoom = function(event) {
    var delta = event.wheelDelta * this.pan_speed;
    var newPos = world.graphics.camera.position.y - delta;
    if (delta && newPos < this.zoom_ceiling && newPos > this.zoom_floor) {
      world.graphics.camera.position.y = newPos;
    }

    //prevent default scrolling on page
   // if (event.preventDefault) {
   //   event.preventDefault();
   // }
   // event.returnValue = false;
  }.bind(this)

  // click function, colors buildings for territory grab
  this.onMouseDown = function(event) {

    //event.preventDefault();

    var hit_object = this.getHitObject();

    if (hit_object) {
      // send move
      socket.emit('building click', [world.state_handler.current.player, hit_object.game_piece.id]);
    }

  }.bind(this)

  this.onMouseMove = function(event) {
    const highlight = new THREE.Color(0xffff00);

    //refresh mouse location for use in other functions
    this.mouseX = event.x;
    this.mouseY = event.y;

    //*****highlights hovered
    this.cur_obj = this.getHitObject();

    // CASE: mouse is over a new object than last frame
    // make sure:
    // have a current object
    // either don't have an old one (was over nothing previously)
    //or the old object isnt the same as the current
    if (this.cur_obj && (!this.old_obj || (this.cur_obj !== this.old_obj))) {

      //set old obj mat back
      if (this.old_obj) {
        this.old_obj.material.color = new THREE.Color(world.state_handler.team_colors[this.old_obj.game_piece.team]);
      }

      //set new obj to highlight
      var material = this.cur_obj.material;

      //***SOLID HIGHLIGHT
      //cur_obj.object.material["color"] = highlight;
      var current_material = this.blend(this.cur_obj.material.color, highlight);

      this.old_obj = this.cur_obj;
    }

    //undoes highlight if no obj hovered over
    else if (!this.cur_obj) {
      if (this.old_obj) {
        this.old_obj.material.color = new THREE.Color(world.state_handler.team_colors[this.old_obj.game_piece.team]);
        this.old_obj = null;
      }
    }

  }.bind(this)

  this.panAuto = function(x, y) {
    var camera = world.graphics.camera;
    var screen_width = world.window_handler.dimensions.width;
    var screen_height = world.window_handler.dimensions.height;

    //right
    if (x > (1 - this.border) * screen_width && camera.target.x < 450) {
      camera.position.x += this.pan_speed;
      camera.target.x += this.pan_speed;

      //left
    } else if (x < this.border * screen_width && camera.target.x > -300) {
      camera.position.x -= this.pan_speed;
      camera.target.x -= this.pan_speed;

    }

    //bottom
    if (y > (1 - this.border) * screen_height && camera.target.z < 120) {
      camera.position.z += this.pan_speed;
      camera.target.z += this.pan_speed;

      //top
    } else if (y < this.border * screen_height && camera.target.z > -450) {
      camera.position.z -= this.pan_speed;
      camera.target.z -= this.pan_speed;
    }

  }.bind(this)

  this.getHitObject = function() {
    try {
      console.log(this.mouseX, this.mouseY);
      var vector = new THREE.Vector3((this.mouseX - 115) / $('#canvas3D').width() * 2 - 1, -((this.mouseY - 1.5 * world.nav.height) / $('#canvas3D').height() ) * 2 + 1, 0.5);
      console.log(vector);
      world.graphics.projector.unprojectVector(vector, world.graphics.camera);

      var ray = new THREE.Ray(world.graphics.camera.position, vector.subSelf(world.graphics.camera.position).normalize());

      return ray.intersectObjects(world.map.selectable_objects)[0].object;

      // clicked on empty space, fail silently
    } catch(err) {
      return null;
    }
  }.bind(this)

  this.printrgb = function(mat) {
    console.log(mat.color.r + " " + mat.color.g + " " + mat.color.b);
  }

  this.blend = function(mat1, mat2) {
    mat1.r = (mat1.r + mat2.r) / 2;
    mat1.g = (mat1.g + mat2.g) / 2;
    mat1.b = (mat1.b + mat2.b) / 2;
    return mat1;

  }
}