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
  this.initListeners = function() {
    //disable right click
    //document.oncontextmenu = new Function("return false")

    //Add Listeners
    $('#canvas3D').click(function() {
      onMouseDown();
    });

    //document.addEventListener('mousewheel', zoom(), false);
    document.addEventListener('mousemove', function() {
      this.onMouseMove(event);
    }.bind(this));

    //$('#canvas3D').mousedown(this.zoom);
    //$('#canvas3D').keypress(getKeyCode);

  }
  var zoom = function(event) {
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
  var onMouseDown = function(event) {
		
    var hit_object = this.getHitObject();
    if(!hit_object){return;}
    if (world.id != '') {
      world.state_handler.move(hit_object);
      
      // TEMP XXX will fix, copied from socket handlers
    } else {
      var team = data[0];
      var building_id = data[1];
      var building = world.map.buildings[building_id];
      building.material.color = new THREE.Color(world.state_handler.getTeamColorFromIndex(team));
      building.game_piece.team = team;
      world.state_handler.nextTurn();
    }

  }.bind(this)

  this.onMouseMove = function(event) {

    const highlight = new THREE.Color(0xffff00);

    //refresh mouse location for use in other functions
    this.mouseX = event.x;
    this.mouseY = event.y - 50;

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
        this.old_obj.material.color = new THREE.Color(world.state_handler.getTeamColorFromIndex(this.old_obj.game_piece.team));
        //$('#canvas3D').css('cursor', 'url(rsc/images/cursors/pointer-green.png)');
      }

      //set new obj to highlight
      var material = this.cur_obj.material;

      //***SOLID HIGHLIGHT
      //cur_obj.object.material["color"] = highlight;
      var current_material = this.blend(this.cur_obj.material.color, highlight);
       //$('#canvas3D').css('cursor', 'url(rsc/images/cursors/pointer-green-dot-red.png)');
      this.old_obj = this.cur_obj;
    }

    //undoes highlight if no obj hovered over
    else if (!this.cur_obj) {
      if (this.old_obj) {
        this.old_obj.material.color = new THREE.Color(world.state_handler.getTeamColorFromIndex(this.old_obj.game_piece.team));
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

      var vector = new THREE.Vector3();
      // vector.x = (this.mouseX - 115) / $('#canvas3D').width() * 2 - 1;
      // vector.y = -((this.mouseY - 1.5 * world.nav.height) / $('#canvas3D').height() ) * 2 + 1;

      vector.x = 2 * (this.mouseX / $('#canvas3D').width()) - 1;
      vector.y = 1 - 2 * ((this.mouseY / $('#canvas3D').height()));
      vector.z = 0.5;

      vector.unproject(world.graphics.camera);

      var ray = new THREE.Raycaster(world.graphics.camera.position, vector.sub(world.graphics.camera.position).normalize());

      list = ray.intersectObjects(world.graphics.scene.children, true);
      //world.map.selectable_objects, true);
      if (list.length > 0) {
        return list[0].object;
      } else {
        return null;
      }

      // clicked on empty space, fail silently
    } catch(err) {
      console.log(err);
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