/**
 * Map Builder
 * contains all of the functions needed for the map builder
 * 
 * TODO currently has duplicated code from other scripts
 * because of small changes, but should extend other classes 
 */
MapBuilder = function() {

  this.scene = new THREE.Scene();
  this.loader = new THREE.JSONLoader();

  this.campus = "example";

  this.dir = "rsc/campuses/" + this.campus + "/models/";

  // <string> id : <THREE.Mesh>
  this.mesh_lookup = {};
 
  // <THREE.Mesh[]> - used for intersection on click
  this.mesh_list = [];

  // <string> id1+id2 (sorted) : <THREE.Line>
  this.edges = {};

  this.export_data = {
    campus : this.campus,
    map : "my_map_name",
    regions : {},
    pieces : {},
  };

  this.colors = {
    current : 0xffc038,
    connected : 0x18cd00,
    included : 0x544aaaa,
    excluded : 0xcc6666,
    edge : 0x00ff33,
    highlight : 0xffff00,
  };

  this.scroll_sensitivity = 6;
  this.border = .02;

  this.scale = 15;

  this.allowPanning = true;

  this.animate = function() {
    requestAnimationFrame(this.animate);
    this.render();
  }.bind(this);

  this.initListeners = function() {
    //disable right click
    //document.oncontextmenu = new Function("return false")

    //Add Listeners
    $('#canvas3D').mouseup(function(event) {
      this.onMouseDown(event);
    }.bind(this));

     //document.addEventListener('mousewheel', this.zoom, false);
    
    // don't include event as a fn parameter
    $(document).mousemove(function() {
      this.onMouseMove(event);
    }.bind(this));

    //$('#canvas3D').mousedown(this.zoom);
    //$('#canvas3D').keypress(getKeyCode);

  }
}

MapBuilder.prototype = {

  zoom : function(event) {
    const scroll_sensitivity = 0.6;
    const ceiling = 800;
    const floor = 50;

    var delta = 0;
    delta = event.wheelDelta * scroll_sensitivity;
    var newPos = this.camera.position.y - delta;
    if (delta && newPos < ceiling && newPos > floor) {
      this.camera.position.y = newPos;
    }

    //prevent default scrolling on page
    //if (event.preventDefault)
    //  event.preventDefault();
    //event.returnValue = false;
  },

  /**
   * Auto generates a map by finding close buildings
   */
  autoBuild : function() {
    var pieces = Object.keys(this.mesh_lookup);
    for (var i = 0; i < pieces.length; i++) {
      var p1 = pieces[i];
      for (var j = 0; j < pieces.length; j++) {
        var p2 = pieces[j];
        
        if (i === j || p1 > p2) continue;
        
        var m1 = this.mesh_lookup[p1];
        var m2 = this.mesh_lookup[p2];

        var dist = m1.center.distanceTo(m2.center);
        const radius = 70;
        if(dist < radius) {
          var weight = Math.ceil((radius - dist) / 5 + 4) / 10;
          weight = Math.min(1.0, weight);
          this.setWeight(p1, p2, weight);
            m1.material = new THREE.MeshLambertMaterial({
              color : this.colors.included,
            });
            m2.material = new THREE.MeshLambertMaterial({
              color : this.colors.included,
            });
        }
      }
    }
  },

  addConnection : function(id1, id2, weight) {
    new Connection(id1, id2, weight);
  },

  addEdge : function(mesh1, mesh2) {
    var geo = new THREE.Geometry();
    geo.vertices.push(mesh2.center);
    geo.vertices.push(mesh1.center);

    var mat = new THREE.LineBasicMaterial({
      color : this.colors.edge,
    });

    var line = new THREE.Line(geo, mat);
    var sorted = [mesh1.game_piece.id, mesh2.game_piece.id].sort();
    this.edges[sorted[0] + sorted[1]] = line;

    this.scene.add(line);
  },
  removeEdge : function(id1, id2) {
    var sorted = [id1, id2].sort();
    var line = this.edges[sorted[0] + sorted[1]];
    this.scene.remove(line);
  },

  onMouseDown : function(event) {

    //event.preventDefault();

    var hitobj = this.getHitObject();

    if (hitobj) {

      //select building
      if (!this.cur_building) {

        hitobj.material = new THREE.MeshLambertMaterial({
          color : this.colors.current
        });

        this.prev_mat = new THREE.Color(this.colors.current);

        this.cur_building = hitobj.game_piece;

        // new addition to map
        if (!(this.cur_building.id in this.export_data.pieces)) {
          this.export_data.pieces[this.cur_building.id] = {};
          this.cur_building.included = true;

          // already exists in map
        } else {

          //change color of all connected
          var keys = Object.keys(this.export_data.pieces[this.cur_building.id]);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            this.mesh_lookup[key].material = new THREE.MeshLambertMaterial({
              color : this.colors.connected
            });
          }
        }

      } else {

          // open editor to edit weight
        if (event.ctrlKey) {
          this.openWeightEditor(this.cur_building.id, hitobj.game_piece.id);
          return;
        }

        //deselect current building
        if (hitobj == this.cur_building.mesh) {

          //change back color of all connected
          var keys = Object.keys(this.export_data.pieces[this.cur_building.id]);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            this.mesh_lookup[key].material = new THREE.MeshLambertMaterial({
              color : this.colors.included,
            });
          }

          // remove from map entirely if not connected to anything
          if (Object.keys(this.export_data.pieces[hitobj.game_piece.id]).length == 0) {
            var new_color = this.colors.excluded;
            delete this.export_data.pieces[hitobj.game_piece.id];
          } else {
            var new_color = this.colors.included;
          }

          this.cur_building.mesh.material = new THREE.MeshLambertMaterial({
            color : new_color
          });

          this.prev_mat = new THREE.Color(new_color);

          this.cur_building = null;

          //add connected to current building
        } else if (!(hitobj.game_piece.id in this.export_data.pieces[this.cur_building.id])) {

          // TODO RESUME remove connected building to current
          hitobj.material = new THREE.MeshLambertMaterial({
            color : this.colors.connected
          });

          this.prev_mat = new THREE.Color(this.colors.connected);

          hitobj.game_piece.included = true;
          hitobj.game_piece.connected = true;

          // create non-directed graph
          this.setWeight(this.cur_building.id, hitobj.game_piece.id, 1.0);

          // deselect connected
        } else {
          this.deselectConnected(this.cur_building.id, hitobj.game_piece.id);
        }
      }
    }
  },
  deselectConnected : function(id_fst, id_snd) {
    var hitobj = this.mesh_lookup[id_snd];
    delete this.export_data.pieces[id_fst][id_snd];
    delete this.export_data.pieces[id_snd][id_fst];

    this.removeEdge(id_fst, id_snd);

    // remove from map entirely
    if (Object.keys(this.export_data.pieces[id_snd]).length == 0) {
      hitobj.material = new THREE.MeshLambertMaterial({
        color : this.colors.excluded
      });
      this.prev_mat = new THREE.Color(this.colors.excluded);
      delete this.export_data.pieces[id_snd];

    } else {
      hitobj.material = new THREE.MeshLambertMaterial({
        color : this.colors.included
      });
      this.prev_mat = new THREE.Color(this.colors.included);
    }
  },
  setWeight : function(id1, id2, weight) {
    var prev_weight = this.export_data.pieces[id1] && this.export_data.pieces[id1][id2];
    this.setOneWeight(id1, id2, weight);
    this.setOneWeight(id2, id1, weight);
    if (!prev_weight && weight > 0) {
      this.addEdge(this.mesh_lookup[id1], this.mesh_lookup[id2]);
      this.prev_mat = new THREE.Color(this.colors.connected);
      this.mesh_lookup[id2].material = new THREE.MeshLambertMaterial({
        color : this.colors.connected,
      });
    } else if (prev_weight && weight === 0) {
      this.removeEdge(id1, id2);
      delete this.export_data.pieces[id1][id2];
      delete this.export_data.pieces[id2][id1];
      // not connected at all
      if (Object.keys(this.export_data.pieces[id2]).length === 0) {
        this.mesh_lookup[id2].material = new THREE.MeshLambertMaterial({
          color : this.colors.excluded,
        });
    
        }
      }
    },
    setOneWeight : function(id_fst, id_snd, weight) {
     if (!(id_fst in this.export_data.pieces)) {
        this.export_data.pieces[id_fst] = {};
      }
      this.export_data.pieces[id_fst][id_snd] = weight;
    },
    onMouseMove : function(event) {

      const highlight = new THREE.Color(this.colors.highlight);

      //refresh mouse location for use in other functions
      this.mouseX = event.x;
      this.mouseY = event.y;

      //*****highlights hovered
      var cur_obj = this.getHitObject();

      // mouse is over a new object
      // make sure you:
      // have a current object
      // either don't have an old one (was over nothing previously)
      // or the old object isnt the same as the current
      if (cur_obj && cur_obj !== this.prev_obj) {

        if (this.prev_obj) {
          this.prev_obj.material.color = this.prev_mat;
        }

        this.prev_obj = cur_obj;

        var c = cur_obj.material.color;
        this.prev_mat = new THREE.Color(c.r, c.g, c.b);

        this.blend(cur_obj.material.color, highlight);

      }

      //undoes highlight if no obj hovered over
      else if (!cur_obj && this.prev_obj) {
        this.prev_obj.material.color = this.prev_mat;

        this.prev_mat = null;
        this.prev_obj = null;
      }
    },

    panAuto : function(x, y) {

    if (x > (1 - this.border) * window.innerWidth) {
      this.camera.position.x += this.scroll_sensitivity;
      this.camera.target.x += this.scroll_sensitivity;

    } else if (x < this.border * window.innerWidth) {
      this.camera.position.x -= this.scroll_sensitivity;
      this.camera.target.x -= this.scroll_sensitivity;
    }

    if (y > (1 - this.border) * window.innerHeight) {
      this.camera.position.z += this.scroll_sensitivity;
      this.camera.target.z += this.scroll_sensitivity;

    } else if (y < this.border * window.innerHeight) {
      this.camera.position.z -= this.scroll_sensitivity;
      this.camera.target.z -= this.scroll_sensitivity;
    }

  },

  openWeightEditor : function(start_id, end_id) {
     
      var prev_weight = this.export_data.pieces[start_id][end_id] || 1;

      this.setWeight(start_id, end_id, prev_weight);
      
      $('#attack-panel').show();

      $('#attack-panel .from').text(start_id);
      $('#attack-panel .to').text(end_id);

      // init force changes
      // same changes occur on slider.slide
      $("#attack-unit-count").text('Range Multiplier: ' + (prev_weight));

      $("#attack-slider").slider({
        range : "min",
        value : prev_weight * 10,
        min : 0,
        max : 10,
        step: 1,
        slide : function(event, ui) {
          var weight = ui.value / 10;
          $("#attack-unit-count").text('Range Multiplier: ' + weight);
          this.setWeight(start_id, end_id, weight);
        }.bind(this),
      });

      // remove old listener so canceling doesnt clear everything!
      $('#attack-panel .button.cancel').unbind('click');

      $('#attack-panel .button.cancel').click( function() {
        $('#attack-panel').hide();
        $("#attack-slider").slider("destroy");
      }.bind(this));

      $('#attack-panel .button.okay').unbind('click');
      $('#attack-panel .button.okay').click(function() {
        var start_id = this.start_id;
        var end_id = this.end_id;

        // initialize move data map [<from> : <to>]
        if (this.pieces[start_id][end_id] == 0.0) {
          this.this_var.deselectConnected(start_id, end_id);
        }

        $('#attack-panel').hide();
        $("#attack-slider").slider("destroy");
      }.bind({
        this_var : this,
        pieces : this.export_data.pieces,
        start_id : start_id,
        end_id : end_id,
      }));

  },

  getHitObject : function() {
    try {

      var vector = new THREE.Vector3();
      // vector.x = (this.mouseX - 115) / $('#canvas3D').width() * 2 - 1;
      // vector.y = -((this.mouseY - 1.5 * world.nav.height) / $('#canvas3D').height() ) * 2 + 1;

      vector.x = 2 * (this.mouseX / $('#canvas3D').width()) - 1;
      vector.y = 1 - 2 * ((this.mouseY / $('#canvas3D').height()));
      vector.z = 0.5;

      vector.unproject(this.camera);

      var ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

      var list = ray.intersectObjects(this.mesh_list);
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
  },

  // has side effects!!
  // adds 50% of mat2 into mat1
  blend : function(mat1, mat2) {
    if (!mat1 || !mat2) {
      return;

    }
    mat1.r = (mat1.r + mat2.r) / 2;
    mat1.g = (mat1.g + mat2.g) / 2;
    mat1.b = (mat1.b + mat2.b) / 2;
    return mat1;
  },

  keyControls : function(e) {
    e = window.event || e;
    e = e.charCode || e.keyCode;

    //enter key
    if (e == 13 && this.cur_building) {

      this.cur_building.material = new THREE.MeshLambertMaterial({
        color : this.colors.included
      });

      for (connected in this.export_data.pieces[this.cur_building.id]) {
        console.log(map.Territories[this.cur_building.id][connected]);
        this.objLookup(map.Territories[this.cur_building.id][connected]).material = new THREE.MeshLambertMaterial({
          color : this.colors.included
        });
      }

      this.cur_building = null;

      //s key
    } else if (e == 115) {
      console.log(JSON.stringify(jsonobj));
      alert("Exported to Console \n [Ctrl + Shift + I]");
    }
  },
  getExportedMap : function() {
    return JSON.stringify(this.export_data);
  },
  load : function(model) {

    this.loader.load(this.dir + model + "/" + model + ".js", function(geometry) {

      geometry.computeMorphNormals();

      var material = new THREE.MeshLambertMaterial({
        color : 0xcc6666,
        shading : THREE.FlatShading
      });

      var mesh = new THREE.Mesh(geometry, material);

      mesh.scale.x = this.scale;
      mesh.scale.y = this.scale;
      mesh.scale.z = this.scale;

      mesh.id = model;
      this.mesh_lookup[model] = mesh;
      mesh.position.y = 0;
      mesh.team = 0;
      this.mesh_list.push(mesh);

      this.scene.add(mesh);

    });
  },
  loadBasic : function(model) {

    this.loader.load(this.dir + model + "/" + model + ".js", function(geometry) {

      geometry.computeMorphNormals();

      var material = new THREE.MeshLambertMaterial({
        color : 0xcc6666,
        shading : THREE.FlatShading
      });

      var mesh = new THREE.Mesh(geometry, material);
      mesh.connected = this.export_data.pieces[model];

      mesh.scale.x = this.scale;
      mesh.scale.y = this.scale;
      mesh.scale.z = this.scale;
      mesh.team = 0;
      mesh.position.y = 0;

      ///////////////////////////////////////////

      geometry.computeBoundingBox();
      mesh.center = geometry.boundingBox.center().multiplyScalar(15);
      mesh.center.y += 10;

      ///////////////////////////////////////////
      mesh.id = model;
      this.mesh_lookup[model] = mesh;
      this.mesh_list.push(mesh);

      var game_piece = new GamePiece(this, model, mesh);

      this.scene.add(mesh);
    }.bind(this));
  },

  /********************************************************
   *
   */

  // MAP BUILDER LOADER
  load : function() {
    //var json = '<?php echo $map?>';
    // var myObject = JSON.parse(myJSONtext, reviver); 
    var json =  {  "regions": { "EngineeringQuad": [ "duffield_phillips", "rhodes", "upson" ], "ArtsQuad": [ "goldwin", "mcgraw_uris", "taylor" ], "Central": [ "statler", "sage" ] }, "pieces": { "duffield_phillips": [ "upson", "hoy", "taylor" ], "taylor": [ "sage", "mcgraw_uris" ], "hoy": [ "upson" ], "sage": [ "statler", "mcgraw_uris", "duffield_phillips" ] } };

    // alert("getBuildingList: " + getBuildingList());
    // alert("getBuilding: " + getBuilding("sage"));

    /**
     * creates a string array of buildings
     */

    var terr = this.export_data.pieces;
    var buildingList = new Array(terr.length);
    var i = 0;

    jQuery.each(terr, function(key, val) {
      buildingList[i++] = key;
    });
  },
  /**
   * given an object
   * returns string array of connected buildings
   * Precondition: obj must have field called name
   */

  getConnected : function(obj) {
    return this.export_data.pieces[obj.name];
  },

  /**
   * returns the object in the scene with str as a name
   * returns undefined if str not in scene
   */
  getBuilding : function(building) {
    return this.export_data.pieces[building];
  },
  loadBoard : function() {
    $.get('/model-list', {campus: this.campus}, function(model_list) {
      for (var i = 0; i < model_list.length; i++) {
        this.loadBasic(model_list[i]);
      }
    }.bind(this));
  },

  initRender : function() {

    this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 2000);
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

    this.container = $('#container');
    this.canvas3D = $('#canvas3D');

    this.renderer = new THREE.WebGLRenderer({
      canvas : this.canvas3D[0],
      antialias : true,
      alpha : false,
    });

    this.renderer.sortObjects = false;
    this.renderer.autoClear = false;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container.append(this.renderer.domElement);

    this.loadBoard();

  },

  render : function() {
    if (this.allowPanning) {
      this.panAuto(this.mouseX, this.mouseY);
    }
    this.camera.lookAt(this.camera.target);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
}

GamePiece = function(map, id, mesh) {

  this.id = id;
  this.mesh = mesh;

  this.isIncluded = false;
  this.isConnected = false;

  mesh.game_piece = this;

  this.connected = map_builder.export_data.pieces[id];

}
GamePiece.prototype = {
  connectTo : function(piece) {
  },
}
 
