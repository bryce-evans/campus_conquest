MouseControls = function(world) {

  this.world = world;

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

}

MouseControls.prototype.addListeners = function() {
  //disable right click
  document.oncontextmenu = new Function("return false")

  //Add Listeners
  document.addEventListener('mousedown', this.onMouseDown, false);
  //document.addEventListener('mousedown', this.zoom, false);
  document.addEventListener('mousewheel', this.zoom, false);
  document.addEventListener('keypress', this.getKeyCode, false);
  document.addEventListener('mousemove', this.onMouseMove, false);
}

MouseControls.prototype.zoom = function(event) {
  var delta = event.wheelDelta * this.pan_speed;
  var newPos = this.world.graphics.camera.position.y - delta;
  if (delta && newPos < this.zoom_ceiling && newPos > this.zoom_floor) {
    this.world.graphics.camera.position.y = newPos;
  }

  //prevent default scrolling on page
  if (event.preventDefault) {
    event.preventDefault();
  }
  event.returnValue = false;
}.bind(this)

// click function, colors buildings for territory grab
MouseControls.prototype.onMouseDown = function(event) {

  event.preventDefault();

  var hit_object = this.getHitObject();

  if (hit_object) {
    // send move
    socket.emit('building click', [this.world.state_handler.current.player, hit_object.game_piece.id]);
  }

}.bind(this)

MouseControls.prototype.onMouseMove = function(event) {
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
      this.old_obj.material.color = new THREE.Color(this.world.state_handler.team_colors[this.old_obj.game_piece.team]);
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
      this.old_obj.material.color = new THREE.Color(this.world.state_handler.team_colors[this.old_obj.game_piece.team]);
      this.old_obj = null;
    }
  }

}.bind(this)

MouseControls.prototype.panAuto = function(x, y) {
  var camera = this.world.graphics.camera;
  var screen_width = this.world.window_handler.dimensions.width;
  var screen_height = this.world.window_handler.dimensions.height;

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

}

MouseControls.prototype.getHitObject = function() {
  try {
    var vector = new THREE.Vector3((this.mouseX / this.world.window_handler.dimensions.width ) * 2 - 1, -(this.mouseY / this.world.window_handler.dimensions.height ) * 2 + 1, 0.5);
    this.world.graphics.projector.unprojectVector(vector, this.world.graphics.camera);

    var ray = new THREE.Ray(this.world.graphics.camera.position, vector.subSelf(this.world.graphics.camera.position).normalize());

    return ray.intersectObjects(this.world.map.selectable_objects)[0].object;

    // clicked on empty space, fail silently
  } catch(err) {
    return null;
  }
}

MouseControls.prototype.printrgb = function(mat) {
  console.log(mat.color.r + " " + mat.color.g + " " + mat.color.b);
}

MouseControls.prototype.blend = function(mat1, mat2) {
  mat1.r = (mat1.r + mat2.r) / 2;
  mat1.g = (mat1.g + mat2.g) / 2;
  mat1.b = (mat1.b + mat2.b) / 2;
  return mat1;

}