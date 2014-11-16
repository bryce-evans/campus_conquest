Map = function() {

  this.map_dir = "/rsc/models/map/";
  this.loader = new THREE.JSONLoader();

  this.map
  this.map_territories

  // map: string id -> connected (string[] ids)
  this.buildings = new Array();

  // mesh[]
  this.selectable_objects = new Array();
  this.scale = 15;

  // this.ctx2d = world.renderer2D.domElement.getContext('2d');
}
Map.prototype.getObj = function(id) {
  return this.buildings[id];
}

Map.prototype.loadBoard = function(options) {
  hasGround = options.has_ground || false;

  if (options.game_id > 0) {
    $.ajax({
      url : "/state",
    }).done( function(init_data) {
      this.loadFromState(init_data);
    }.bind(this));
  } else {
    $.ajax({
      url : "/rsc/maps/example_state.json",
    }).done( function(init_data) {
      this.loadFromState(init_data);
    }.bind(this));
  }
}
/**
 * given an object
 * returns string array of connected buildings
 * Precondition: obj must have field called name
 */
Map.prototype.getConnectedByMesh = function(obj) {
  return this.map_territories[obj.game_piece.id];
}
/**
 * returns string[] ids of connected buildings
 * returns undefined if str not in scene
 */
Map.prototype.getConnectedById = function(id) {
  return this.map_territories[id];
}
/*
 "state_id": "1",
 "t_id": "dickson",
 "u_id": "1",
 "num_troops": "174",
 "game_id": "1"
 */

Map.prototype.loadFromState = function(state) {
  $.ajax({
    url : "/rsc/maps/cornell_basic.json",
  }).done( function(data) {
    this.map = data;
    this.map_territories = this.map.Cornell.Territories;

    var i = 0;
    jQuery.each(this.map_territories, function(key, val) {
      this.buildings[i++] = key;
    }.bind(this));

    if (world.graphics.complex_geometry == true) {
      this.loadGround();
    }

    // load models
    for (var index in this.buildings) {
      this.load(this.buildings[index], state);
    }
  }.bind(this));
}

Map.prototype.load = function(model_name, init_state) {

  this.loader.load(this.map_dir + "buildings/" + model_name + "/" + model_name + ".js", function(geometry) {

    geometry.computeMorphNormals();

    var material = new THREE.MeshLambertMaterial({
      shading : THREE.FlatShading,
    });

    var mesh = new THREE.Mesh(geometry, material);
    var piece_owner;
    if (init_state[model_name]) {
      piece_owner = init_state[model_name].team;
    }

    var game_piece = new GamePiece(this, model_name, mesh, piece_owner);
    world.graphics.scene.add(mesh);

  }.bind(this));
}

Map.prototype.loadGround = function() {
  this.loader.load(this.map_dir + "ground/ground.js", function(geometry) {

    var material = new THREE.MeshLambertMaterial({
      map : THREE.ImageUtils.loadTexture(this.map_dir + "ground/ground.png"),
      shading : THREE.SmoothShading,
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(this.scale, this.scale, this.scale);
    mesh.position.y = 0;
    try {
      this.scene.add(mesh);
    } catch(err) {
      console.log(err.stack);
    }
  }.bind(this));
}
Map.prototype.overlayText = function() {
  ctx2d.clearRect(0, 0, window.innerWidth, window.innerHeight);

  const ceil = 800;
  const floor = 50;

  const min_font = 18;
  const max_font = 40;

  var height = camera.position.y;

  var size = (min_font - max_font) * (height - floor) / (ceil - floor) + max_font;
  var font = " Goudy Trajan Regular";
  ctx2d.font = "18px" + font;

  ctx2d.fillStyle = "#0088ff";
  ctx2d.shadowOffsetX = 1;
  ctx2d.shadowOffsetY = 1;
  ctx2d.shadowBlur = 2;
  ctx2d.shadowColor = "#000000";
  ctx2d.textAlign = 'center';

  for (building in buildings) {

    var obj = getObj(building);
    var pos = new THREE.Vector3(obj.center[0], obj.center[1], obj.center[2]);

    coord = toScreenXY(pos);
    // ctx2d.fillText(obj.id, coord.x, coord.y);

    if (obj.troops > 0) {

      //size = 3*(coord.z + 1917) + 5;
      //ctx2d.font = size + "px helvetica";
      ctx2d.font = (size + 2) + "px" + font;
      // ctx2d.font = "20px helvetica";

      ctx2d.fillStyle = "#0088ff";
      ctx2d.fillText(obj.troops, coord.x, coord.y);

      ctx2d.font = "14px" + font;
      ctx2d.fillStyle = "#4466aa";
      ctx2d.fillText(obj.id, coord.x, coord.y + 15);

    } else {
      ctx2d.fillText(obj.id, coord.x, coord.y);
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

  if ( typeof arrows !== 'undefined') {
    for (index in arrows) {
      var arr = arrows[index];
      if (arr.midpt) {
        var pos = new THREE.Vector3(arr.midpt[0], arr.midpt[1], arr.midpt[2]);

        coord = toScreenXY(pos);
        // ctx2d.fillText(obj.id, coord.x, coord.y);

        ctx2d.fillText(arr.strength, coord.x, coord.y);
      }
    }
  }

}

Map.prototype.toScreenXY = function(pos) {

  var projScreenMat = new THREE.Matrix4();
  projScreenMat.multiply(camera.projectionMatrix, camera.matrixWorldInverse);
  projScreenMat.multiplyVector3(pos);

  return {
    x : (pos.x + 1 ) * renderer3D.domElement.width / 2,
    y : (-pos.y + 1) * renderer3D.domElement.height / 2,
  };

}
GamePiece = function(map, id, mesh, init_team) {

  this.id = id;
  this.mesh = mesh;
  this.team

  mesh.game_piece = this;

  this.connected = map.map_territories[id];
  this.setTeam(init_team || 0);

  mesh.scale.set(map.scale, map.scale, map.scale);
  mesh.position.y = 0;

  var sumx = 0;
  var sumy = 0;
  var sumz = 0;
  var counter = 0;
  var verts = mesh.geometry.vertices;
  var center = new Array(3);
  for (index in verts) {
    sumx += verts[index].x;
    sumy += verts[index].y;
    sumz += verts[index].z;
    counter++;
  }
  this.mesh.center = new Array(map.scale * sumx / counter, map.scale * sumy / counter, map.scale * sumz / counter);

  map.buildings[id] = mesh;
  map.selectable_objects.push(mesh);

}
// @team_number : int
GamePiece.prototype.setTeam = function(team_number) {
  if (team_number > world.state_handler.team_count) {
    console.error("set piece to invalid team");
  }
  var new_material = this.mesh.material;
  var new_color = world.state_handler.team_colors[team_number];
  new_material.color = new THREE.Color(new_color);
  this.mesh.material = new_material;
  this.team = team_number;
}
// also updates team data
GamePiece.prototype.setTroops = function(newTroops) {
  var oldTroops = mesh.troops;
  this.troops = newTroops;
  this.teams[this.team].troops += newTroops - oldTroops;
}

