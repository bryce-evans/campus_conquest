Map = function() {

  this.map_dir = "/rsc/models/map/";
  this.loader = new THREE.JSONLoader();

  this.map = {};
  this.map_territories = {};
  this.arrow_meshes = [];

  // map: string id -> connected (string[] ids)
  this.buildings = new Array();

  // mesh[]
  this.selectable_objects = [];
  this.scale = 15;

}
Map.prototype = {
  getObj : function(id) {
    return this.buildings[id];
  },

  /**
   * given an object
   * returns string array of connected buildings
   * Precondition: obj must have field called name
   */
  getConnectedByMesh : function(obj) {
    return this.map_territories[obj.game_piece.id];
  },
  /**
   * returns string[] ids of connected buildings
   * returns undefined if str not in scene
   */
  getConnectedById : function(id) {
    return this.map_territories[id];
  },
  /*
   "state_id": "1",
   "t_id": "dickson",
   "u_id": "1",
   "num_troops": "174",
   "game_id": "1"
   */

  loadFromState : function(state) {

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
  },

  load : function(model_name, init_state) {

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

      var game_piece = new GamePiece(this, model_name, mesh, piece_owner, init_state[model_name].units);
      world.graphics.scene.add(mesh);

    }.bind(this));
  },

  loadGround : function() {
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
}

GamePiece = function(map, id, mesh, init_team, init_units) {

  this.id = id;
  this.mesh = mesh;
  this.team = undefined;
  this.units = init_units || 0;

  mesh.game_piece = this;

  this.connected = map.map_territories[id];
  this.setTeam(init_team);

  mesh.scale.set(map.scale, map.scale, map.scale);
  mesh.position.y = 0;

  var sumx = 0;
  var sumy = 0;
  var sumz = 0;
  var counter = 0;
  var verts = mesh.geometry.vertices;
  for (index in verts) {
    sumx += verts[index].x;
    sumy += verts[index].y;
    sumz += verts[index].z;
    counter++;
  }
  this.mesh.center = new THREE.Vector3(map.scale * sumx / counter, map.scale * sumy / counter, map.scale * sumz / counter);

  map.buildings[id] = mesh;
  map.selectable_objects.push(mesh);

}
// @team_number : int
GamePiece.prototype = {
  setTeam : function(team_number) {
    if (team_number > world.state_handler.team_order.length) {
      console.error("set piece to invalid team");
    }
    var new_material = this.mesh.material;
    var new_color = world.state_handler.getTeamColorFromIndex(team_number);
    new_material.color.copy(new THREE.Color(new_color));
    this.mesh.material = new_material;
    this.team = team_number;
  },
  // also updates team data
  setTroops : function(newTroops) {
    var oldTroops = mesh.troops;
    this.troops = newTroops;
    this.teams[this.team].troops += newTroops - oldTroops;
  },
  highlight : function() {
    $('#current-selection').text(this.id);

    // this.mesh.material.color.copy(new THREE.Color(1,1,1));
    // return;
    //
    // this.mesh.material.color.r = (this.mesh.material.color.r + 1) / 2;
    // this.mesh.material.color.g = (this.mesh.material.color.g + 1) / 2;
    // this.mesh.material.color.b = (this.mesh.material.color.b + 1) / 2;
    //
    // // keep color after moving mouse off of piece
    //
    // return;
    //
    // this.mesh.material.color.r ^=1;
    // this.mesh.material.color.g ^=1;
    // this.mesh.material.color.b ^=1;
    // return;

    var outline_amount = 0.1;

    var color = TEAM_DATA[world.state_handler.team_order[this.team]].colors.secondary;

    var outlineMaterial = new THREE.MeshBasicMaterial({
      color : color ^ 0xffffff,
      side : THREE.BackSide
    });
    var outlineMesh = new THREE.Mesh(this.mesh.geometry, outlineMaterial);
    this.highlighted_mesh = outlineMesh;

    // push the center so scaling keeps mesh centered on building
    // only needed because geometry center is not world center
    var distance = outlineMesh.position.distanceTo(this.mesh.center);
    outlineMesh.position.copy(this.mesh.center).multiplyScalar(-outline_amount);

    outlineMesh.scale.multiplyScalar(world.map.scale * (1 + outline_amount));
    world.graphics.scene.add(outlineMesh);

  },

  unhighlight : function() {
    $('#current-selection').text('');
    world.graphics.scene.remove(this.highlighted_mesh);
    return;

    this.mesh.material.color.copy(TEAM_DATA[world.state_handler.team_order[this.team]].colors.primary);
    return;
    this.mesh.material.color.r = (this.mesh.material.color.r * 2) - 1;
    this.mesh.material.color.g = (this.mesh.material.color.g * 2) - 1;
    this.mesh.material.color.b = (this.mesh.material.color.b * 2) - 1;
    return;

    this.mesh.material.color.r ^=1;
    this.mesh.material.color.g ^=1;
    this.mesh.material.color.b ^=1;
    return;

    world.graphics.scene.remove(this.highlightedMesh);

  }
}

/*
 * Generates an arrow between two buildings
 *
 * id1- string id of start building
 * id2- string id of end building
 * strength- thickness of arrow
 */
Arrow = function(id1, id2) {

  var start_mesh = world.map.getObj(id1);
  var end_mesh = world.map.getObj(id2);

  this.start = id1;
  this.end = id2;
  this.strength = 100;
  // start_mesh.game_piece.troops - 1;

  var p1 = start_mesh.center;
  var p2 = end_mesh.center;

  var scale = 15;

  // find arrow polar coords
  var mag = Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.z - p1.z), 2));
  var theta = -(Math.atan((p2.z - p1.z) / (p2.x - p1.x)));

  //correct for atan range
  if (p2.x > p1.x) {
    theta += Math.PI;
  }

  //get mesh object
  var x, z;
  world.map.loader.load("../rsc/models/map/arrow/arrow.js", function(geometry) {

    geometry.computeMorphNormals();

    material = new THREE.MeshLambertMaterial({
      color : 0xff0000,
      shading : THREE.SmoothShading
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(mag - .5 * (scale), .1 * mag, .03 * this.strength * scale + .5);

    mesh.position.x = start_mesh.center.x;
    mesh.position.z = start_mesh.center.z;
    mesh.position.y = 15;
    mesh.rotation.y = theta;

    x = mesh.position.x;
    z = mesh.position.z;

    this.mesh = mesh;
    this.center = new THREE.Vector3(x - mag * Math.cos(theta) / 2, .015 * mag + 5, z + mag * Math.sin(theta) / 2);

    world.map.arrow_meshes.push(mesh);

    world.graphics.scene.add(mesh);

  }.bind(this));

  function setStrength(s) {
    this.strength = s;
    this.command.strength = s;
    //mesh.scale.z = .03 * strength * scale + .5;
  }

}

