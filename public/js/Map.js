/**
 *
 * Map
 *
 * Loads and manages the models displayed in Graphics.js
 *
 * REQUIRES: World.js, Graphics.js
 *
 */

Map = function() {

  this.map_dir = "rsc/campuses/cornell/maps/";
  this.loader = new THREE.JSONLoader();
  
  // id and name for current map loaded
  this.id = undefined;
  this.name = undefined;

  // {<String> id : Region} 
  this.regions = {};

  // {<String> id : GamePiece
  this.game_pieces = {}

  // ids of all game_pieces
  this.piece_ids = []

  // meshes of all selectable pieces
  this.selectable_objects = [];

  // list of geometries for frequently created objects like arrows
  // {<string> id : <geometry>}
  this.geometries = {};


  // Arrow lookup map- <string> start-id : {<string> end-id : Arrow}
  this.arrows = {};

  this.scale = 15;
  this.show_edges = false;

  this.colors = {
    current : 0xffc038,
    connected : 0x18cd00,
    included : 0x544aaaa,
    excluded : 0xcc6666,
    edge : 0x00ff33,
    highlight : 0xffff00,
  };
}

Map.prototype = {
    
  // TODO dynamically load different maps
  loadMapFile : function(filename, callback) {
    $.ajax({
      url : this.map_dir + filename,
    }).done( function(data) {
      this.id = data.id;
      this.name = data.name;
     
      $.each(data.regions, function(id, r) {
        this.regions[id] = new Region(id, r.name, r.connected, r.value);
      }.bind(this));

      $.each(data.pieces, function(start_id, connections) {
        this.piece_ids.push(start_id);
        // pushes to this.game_pieces
        this.loadPiece({id: start_id, connected: connections});
      }.bind(this));
      
      if (world.graphics.complex_geometry == true) {
        this.loadGround();
      }
      callback(this.piece_ids);
    }.bind(this));
  },

  loadPiece : function(piece_data) {
    var piece_id = piece_data.id;
    var name = piece_data.name;
// XXX
    var connected =  piece_data.connected;

    // model is not in this game
    if (!world.state_handler.current.state[piece_id]) {
      console.log(piece_id + ' not included in this map');
      return;
    }
    // TODO migrate models to campus directory
    this.loader.load("rsc/models/map/" + "buildings/" + piece_id + "/" + piece_id + ".js", function(geometry) {

      geometry.computeMorphNormals();

      var material = new THREE.MeshLambertMaterial({
        blending : THREE.FlatShading,
      });

      var mesh = new THREE.Mesh(geometry, material);
      mesh.name = piece_id;

      this.game_pieces[piece_id] = new GamePiece(this, piece_id, name, mesh, connected);
      
      this.selectable_objects.push(mesh);
      mesh.computeCenter();

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
      mesh.name = "ground";
 
      mesh.scale.set(this.scale, this.scale, this.scale);
      mesh.position.y = 0;
      try {
        world.graphics.scene.add(mesh);
      } catch(err) {
        console.log(err.stack);
      }
    }.bind(this));
  },

  addEdge : function(id1, id2) {
    var sorted = [id1, id2].sort();

    // check to see if it already exists
    var edge = this.edges[sorted[0] + sorted[1]];
    if (edge) {
      if (edge.parent) {
        return;
      } else {
        world.graphics.scene.add(edge);
      }
    }

    var mesh1 = this.game_pieces[id1].mesh;
    var mesh2 = this.game_pieces[id2].mesh;

    var geo = new THREE.Geometry();
    geo.vertices.push(new THREE.Vector3(mesh2.center.x, 2 * mesh2.center.y + 5, mesh2.center.z));
    geo.vertices.push(new THREE.Vector3(mesh1.center.x, 2 * mesh1.center.y + 5, mesh1.center.z));

    var mat = new THREE.LineBasicMaterial({
      color : this.colors.edge,
    });

    var line = new THREE.Line(geo, mat);
    this.edges[sorted[0] + sorted[1]] = line;
    
    line.name = sorted[0] + "--" + sorted[1];
    world.graphics.scene.add(line);
  },
  getEdge : function(id1, id2) {
    var sorted = [id1, id2].sort();
    return this.edges[sorted[0] + sorted[1]];
  },
  removeEdge : function(id1, id2) {
    var sorted = [id1, id2].sort();
    world.graphics.scene.remove(this.edges[sorted[0] + sorted[1]]);
  },
  toggleEdges : function() {
    if(!this.show_edges){
      this.addEdges();
    } else{
      this.removeEdges();
    }
    this.show_edges = !this.show_edges;
  },
  addEdges : function() {
    this.edges = {};
    $.each(this.game_pieces, function(piece_id, piece) {
      var connections = Object.keys(piece.connected);
      for (var i = 0; i < connections.length; i++) {
        this.addEdge(piece_id, connections[i]);
      }
    }.bind(this));

  },
  removeEdges : function() {
    $.each(this.game_pieces, function(piece_id, piece) {
      var connections = Object.keys(piece.connected);
      for (var i = 0; i < connections.length; i++) {
        this.removeEdge(piece_id, connections[i]);
      }
    }.bind(this));
  },
  
  /**
   * Loads all models not associated with the specific map
   */
  loadGeometries : function() {
    this.loadArrowGeometry();
  },

  loadArrowGeometry : function() {
    this.loader.load("../rsc/models/map/arrow/arrow.js", function(geometry) {

      geometry.computeMorphNormals();
      this.geometries.arrow = geometry;
    }.bind(this));

  },

  // gets an arrow from start_id to end_id.
  // creates one if one doesn't exist
  getArrow : function(start_id, end_id, half_size) {
    if (this.arrows[start_id] && this.arrows[start_id][end_id]) {
      return this.arrows[start_id][end_id];
    } else {
      return new Arrow(start_id, end_id, half_size);
    }
  },
  removeAllArrows : function() {
    for (var start in this.arrows) {
      for (var end in this.arrows[start]) {
        var arrow = this.arrows[start][end];
        arrow.setUnits(0);
        delete arrow;
      }
    }
    this.arrows = {};
  },
  newExplosion : function(center) {
    var explosion = new Explosion(center);
    world.graphics.animation_handler.addAnimation(explosion);
  },
  newFountain : function(piece_id) {
    var fountain = new Fountain(piece_id);
    world.graphics.animation_handler.addAnimation(fountain);
  },
  newAttackRadius : function(piece_id) {
    // singleton
    if (world.map.attack_radius) {
      world.map.attack_radius.setTo(piece_id);
      return;
    }

   // add geometry to expand, showing attack radius
    var atk_rad = new AttackRadius(piece_id);
    this.attack_radius = atk_rad;
  },
  unsetAttackRadius : function(piece_id) { 
    this.attack_radius.unset();
  },
  newAnimatedEdge : function(piece1, piece2) {
    var edge = new AnimatedEdge(piece1, piece2);
    world.graphics.animation_handler.addAnimation(edge);
    return edge;
  },
}

Region = function(id, name, pieces, value) {
  this.id = id;
  this.name = name;
  this.pieces = pieces;
  this.value = value;
}

GamePiece = function(map, id, name, mesh, connected) {

  this.id = id;
  this.name = name;
  this.mesh = mesh;
  this.connected = connected;

  mesh.game_piece = this;

  this.setTeam();

  mesh.scale.set(map.scale, map.scale, map.scale);
  mesh.position.y = 0;
}


// @team_number : int
GamePiece.prototype = {
  /**
   * updates materials to match owner in current state
   */
  setTeam : function() {
    var team_number = world.state_handler.current.state[this.id].team;
    if (team_number > world.state_handler.team_order.length) {
      console.error("set piece to invalid team");
    }
    var new_material = this.mesh.material;
    var new_color = world.state_handler.getTeamColorFromIndex(team_number);
    new_material.color.copy(new THREE.Color(new_color));
    this.mesh.material = new_material;
    this.team = team_number;
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

    // this.mesh.material.color.copy(TEAM_DATA[world.state_handler.team_order[this.team]].colors.primary);
    // return;
    // this.mesh.material.color.r = (this.mesh.material.color.r * 2) - 1;
    // this.mesh.material.color.g = (this.mesh.material.color.g * 2) - 1;
    // this.mesh.material.color.b = (this.mesh.material.color.b * 2) - 1;
    // return;
    //
    // this.mesh.material.color.r ^=1;
    // this.mesh.material.color.g ^=1;
    // this.mesh.material.color.b ^=1;
    // return;
    //
    // world.graphics.scene.remove(this.highlightedMesh);

  }
}

/*
 * Generates an arrow between two buildings
 *
 * id1- string id of start building
 * id2- string id of end building
 * half_size: half the length if true
 */
Arrow = function(id1, id2, half_size) {
  half_size = half_size || false;

  var start_mesh = world.map.game_pieces[id1].mesh;
  var end_mesh = world.map.game_pieces[id2].mesh;

  // the id of the piece the arrow originates
  this.start = id1;

  // id of piece ends at
  this.end = id2;

  if (!world.map.arrows[id1]) {
    world.map.arrows[id1] = {};
  }
  world.map.arrows[id1][id2] = this;

  // units this arrow represents
  this.units = 0;

  var p1 = start_mesh.center;
  var p2 = end_mesh.center;

  var scale = world.map.scale;

  // find arrow polar coords
  var mag = Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.z - p1.z), 2));
  var theta = -(Math.atan((p2.z - p1.z) / (p2.x - p1.x)));

  //correct for atan range
  if (p2.x > p1.x) {
    theta += Math.PI;
  }

  //get mesh object
  var x, z;
  var geometry = world.map.geometries.arrow;

  material = new THREE.MeshLambertMaterial({
    color : 0xff0000,
    shading : THREE.SmoothShading
  });

  var mesh = new THREE.Mesh(geometry, material);
  mesh.name = id1 + "=>" + id2;
  this.mesh = mesh;

  if (!half_size) {
    mesh.scale.set(mag - .5 * (scale), .1 * mag, this.units * scale + .5);
  } else {
    mag /= 2;
    mesh.scale.set(mag, 0.1* mag, this.units * scale + .5);
  }

  mesh.position.x = start_mesh.center.x;
  mesh.position.z = start_mesh.center.z;
  mesh.position.y = 15;
  mesh.rotation.y = theta;

  x = mesh.position.x;
  z = mesh.position.z;

  // set the appropriate color
  this.unhighlight();

  // get center for displaying text at this point
  this.center = new THREE.Vector3(x - mag * Math.cos(theta) / 2, .015 * mag + 5, z + mag * Math.sin(theta) / 2);

  // don't add to scene until units > 0
  if (this.units !== 0) {
    this.mesh.scale.z = this.units * world.map.scale + .5;
    world.graphics.scene.add(this.mesh);
  }

}
Arrow.prototype = {
  setUnits : function(u) {
    var prev_units = this.units;
    this.units = u;
    
    var diff = u - prev_units;
    if (diff >= world.state_handler.current.state[this.start]) {
      // set max cap
      this.units = diff - 1;
    }

    world.state_handler.current.state[this.start].units -= diff;

    if (this.mesh) {
      this.mesh.scale.z = Math.min(300, u * world.map.scale);
    }

    // remove
    if (u === 0 && this.mesh) {
      world.graphics.scene.remove(this.mesh);
      return;
    }
    // add back
    else if (prev_units === 0 && u !== 0 && this.mesh) {
      world.graphics.scene.add(this.mesh);
    }

  },

  highlight : function() {
    this.mesh.material.color.set(new THREE.Color(1,0,0));
  },

  unhighlight : function() {
     var team = world.state_handler.current.state[this.start].team;

     var color = new THREE.Color(world.state_handler.getSecondaryTeamColorFromIndex(team));
     this.mesh.material.color.set(color);
  },
  setFullLength : function() {
    if (!this.full_length) {
      var scale = world.map.scale;
      this.mesh.scale.x *= 2;
      this.mesh.scale.x += 0.5 * scale;
      this.mesh.scale.y *= 2;
    }
    this.full_length = true;
  },
}

/**
 * 
 */
Animateable = function() {
  this.mesh;
  this.current_frame;
  this.lifetime;
}
Animateable.prototype = {
  update : function(){},
}

Explosion = function(center) {
  //////////////settings/////////
  this.points = undefined;  
  this.point_count= 500;
  this.dirs = [];
  this.lifetime = 12;

  // only used on init
  var objectSize = 3;
  var movementSpeed = 7;
  var colors = [0xFFFFFF];

  var geometry = new THREE.Geometry();
 
  for (i = 0; i < this.point_count; i ++) { 
    geometry.vertices.push( center.clone() );
    this.dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new THREE.PointsMaterial( { size: objectSize,  color: colors[Math.round(Math.random() * colors.length)] });
  this.points = new THREE.Points( geometry, material );
  
  this.status = true;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  world.graphics.scene.add(this.points); 
}

Explosion.prototype = {
 update: function() {
    if (this.status == true) {
      var pCount = this.point_count;
      while(pCount--) {
        var particle =  this.points.geometry.vertices[pCount];
        particle.y += this.dirs[pCount].y;
        particle.x += this.dirs[pCount].x;
        particle.z += this.dirs[pCount].z;
      }
      this.points.geometry.verticesNeedUpdate = true;
      this.lifetime--;
      if(this.lifetime < 0){
        world.graphics.scene.remove(this.points);
        this.status == false;
      }
      return false;
    } else {
      return true;
    }
  },
}

Fountain = function(piece_id) {
  //////////////settings/////////
  this.points = undefined;  
  this.point_count= 500;
  this.dirs = [];
  this.lifetime = 12;

  // only used on init
  var objectSize = 3;
  var movementSpeed = 7;
  var colors = [0xFFFFFF];

  var geometry = new THREE.Geometry();
 
  for (i = 0; i < this.point_count; i ++) { 
    geometry.vertices.push( center.clone() );
    this.dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y: movementSpeed, z:(Math.random() * movementSpeed)-(movementSpeed/2)});
  }
  var material = new THREE.PointsMaterial( { size: objectSize,  color: colors[Math.round(Math.random() * colors.length)] });
  this.points = new THREE.Points( geometry, material );
  
  this.status = true;
  
  this.xDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.yDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  this.zDir = (Math.random() * movementSpeed)-(movementSpeed/2);
  
  world.graphics.scene.add(this.points); 

}
Fountain.prototype = {
  update: function() {
    if (this.status == true){
      var pCount = this.point_count;
      while(pCount--) {
        var particle =  this.points.geometry.vertices[pCount];
        particle.y += this.dirs[pCount].y;
        particle.x += this.dirs[pCount].x;
        particle.z += this.dirs[pCount].z;
      }
      this.points.geometry.verticesNeedUpdate = true;
      this.lifetime--;
      if(this.lifetime < 0){
        world.graphics.scene.remove(this.points);
        this.status == false;
      }
    }
  }, 
}

AttackRadius = function(piece_id) {
  this.max_radius = 2;
  this.frames = 20;
  this.looping = false;
  
  this.frames_remaining;
  this.center_piece = world.map.game_pieces[piece_id]; 
  this.connections;  
  this.animated_edges = [];

  var geometry = new THREE.CircleGeometry(30,64);
  var material = new THREE.MeshLambertMaterial({
    color: new THREE.Color(1,0,0),
    transparent: true,
    opacity: 0.4, 
  });
  this.mesh = new THREE.Mesh(geometry, material);
  this.mesh.rotation.x = -Math.PI/2;
 
  this.setTo(piece_id);
}
AttackRadius.prototype = {
  update : function() {
    if (this.frames_remaining > 0) {
      this.mesh.scale.addScalar(1/this.frames * this.max_radius);
      this.frames_remaining--;
      var cur_rad = (1 -this.frames_remaining/this.frames) * this.connections[this.connections.length - 1].dist;
      
      var connection = this.connections[this.cur_conn];
      while (connection && connection.dist <= cur_rad) {
        var edge = world.map.newAnimatedEdge(this.center_piece, connection.piece);
        this.animated_edges.push(edge);
        //this.pieces_enclosed[i].piece.mesh.material.color.set(new THREE.Color(0,1,0));
        this.cur_conn++;
        connection = this.connections[this.cur_conn];
      }
      return false;
    } else {
      this.cur_conn = 0;
      return true;
    }
  },
  setTo : function(piece_id) {

    this.removeAnimatedEdges();

    world.graphics.animation_handler.addAnimation(this);
    this.center_piece = world.map.game_pieces[piece_id];

    this.connections = [];
    var keys = Object.keys(this.center_piece.connected);
    for (var i = 0; i < keys.length; i++) {
      var piece = world.map.game_pieces[keys[i]];
      this.connections.push({weight: this.center_piece.connected[keys[i]], piece: piece, dist: this.distanceTo(piece)});
    }
    this.connections.sort(function(a, b) {
      return a.dist - b.dist;
    });
    
    // which connection is being drawn on this frame
    this.cur_conn  = 0;
    this.animated_edges = [];
 
    var center = this.center_piece.mesh.center;
    this.mesh.position.copy(center);
    this.mesh.position.y = -1;

    var small = 0.001;
    this.mesh.scale.set(small, small, small);
    
    // TODO reset highlighting of previous pieces
    // for (piece in this.pieceS_enclosed) ...
    

    //this.getPiecesEnclosed(center);

    this.frames_remaining = 20;
    world.graphics.scene.add(this.mesh);
  },
  unset : function() {
    this.removeAnimatedEdges();
    world.graphics.scene.remove(this.mesh);
  },
  removeAnimatedEdges : function() {
    for(var i = 0; i < this.animated_edges.length; i++) {
      var is_animated = this.animated_edges[i].clear();
      if (is_animated) {
        world.graphics.animation_handler.addAnimation(this.animated_edges[i]);
      }
    }
  },
  getPiecesEnclosed : function(center) {
    console.error("getPiecesEnclosed is deprecated");
    this.pieces_enclosed = [];
   
    var keys = Object.keys(world.map.game_pieces); 
    for (var i = 0; i < keys.length; i++) {
      var piece = world.map.game_pieces[keys[i]];
      var dist = this.distanceTo(piece);
      if (dist < world.map.scale * 5) {
        this.pieces_enclosed.push({piece: piece, distance: dist});
      }
    }
    this.pieces_enclosed.sort(function(a,b) {
      return a.distance - b.distance;
    });
  },
  distanceTo : function(piece) {
      return piece.mesh.center.distanceTo(this.center_piece.mesh.center);
  },
}

AnimatedEdge = function(piece1, piece2) {

  this.start_piece = piece1;
  this.end_piece = piece2;

  var same_team = piece1.team === piece2.team;

  var mesh1 = piece1.mesh;
  var mesh2 = piece2.mesh;

  var geo = new THREE.Geometry();
  this.start_pt = new THREE.Vector3(mesh1.center.x, 2 * mesh1.center.y + 5, mesh1.center.z);
  
  this.cur_pt = new THREE.Vector3();
  this.cur_pt.copy(this.start_pt);

  this.end_pt = new THREE.Vector3(mesh2.center.x, 2 * mesh2.center.y + 5, mesh2.center.z);
  geo.vertices.push(this.start_pt);
  geo.vertices.push(this.cur_pt);

  var mat = !same_team 
    ? new THREE.LineBasicMaterial({
      color : world.map.colors.edge,
    })
    : new THREE.LineBasicMaterial({
      color : 0x444444,
      opacity: 0.6,
      transparent: true,
    });


  var line = new THREE.Line(geo, mat);
    
  line.name = "anim: " + piece1.id + "--" + piece2.id;
  world.graphics.scene.add(line);

  this.mesh = line;
  this.current_frame = 0;
  this.lifetime = Math.floor(this.start_pt.distanceTo(this.end_pt) / 5); 
  
  this.delta = new THREE.Vector3();
  this.delta.copy(this.end_pt);
  this.delta.sub(this.start_pt);
  this.delta.multiplyScalar(1/this.lifetime);
}

AnimatedEdge.prototype = {
  update : function() {
    if (this.current_frame < this.lifetime) {
      this.cur_pt.add(this.delta);
      this.mesh.geometry.verticesNeedUpdate = true;
      this.current_frame++;
      return false;
    } else {
      return true;
    }
  },
  
  clear : function() {
    this.current_frame = 0;
    var speed = 2;
    this.delta.multiplyScalar(speed);
    this.lifetime = Math.floor(this.lifetime/speed);
    this.update = function() {
      if (this.current_frame < this.lifetime) {
        this.cur_pt.sub(this.delta);
        this.mesh.geometry.verticesNeedUpdate = true;
        this.current_frame++;
        return false;
      } else {
        world.graphics.scene.remove(this.mesh);
        return true;
      }
    };
    return true;
  },
}

THREE.Mesh.prototype.computeCenter = function() {
  this.geometry.computeBoundingBox();
  this.center = this.geometry.boundingBox.center().multiplyScalar(15);

  // old code
  var sumx = 0;
  var sumy = 0;
  var sumz = 0;
  var counter = 0;
  var verts = this.geometry.vertices;
  for (index in verts) {
    sumx += verts[index].x;
    sumy += verts[index].y;
    sumz += verts[index].z;
    counter++;
  }
  var map = world.map;
  this.center =  new THREE.Vector3(map.scale * sumx / counter, map.scale * sumy / counter, map.scale * sumz / counter);
}
