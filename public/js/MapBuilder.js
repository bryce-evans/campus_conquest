MapBuilder = function() {

  this.scene = new THREE.Scene();
  this.loader = new THREE.JSONLoader();

  this.dir = "rsc/models/map/buildings/";

  this.models = ["sage", "mcgraw_uris", "uris", "ad_white_house", "alumni", "appel", "bailey", "baker_olin", "balch", "barnes", "barton", "bio_tech", "bradfield", "caldwell", "carpenter", "ccc", "ckb", "comstock", "day", "dickson", "donlon", "duffield_phillips", "friedmen", "goldwin", "h_newman", "hollister", "hoy", "hr5", "ives", "jameson", "johnson", "kane", "ktb", "low_rises", "lr_conference", "malott", "mann", "morill", "morris", "mudd_corson", "newman", "observatory", "olive_taiden", "plant_sci", "psb_clarke", "rand", "roberts_kennedy", "rockefeller", "sage_chapel", "schoellkopf", "snee", "statler", "stimson", "teagle", "townhouses", "upson", "van_ren", "warren", "white", "willard_straight"];
  this.mesh_lookup = {};
  this.mesh_list = [];
  
  this.map = {
    area : 'Cornell',
    continents : {},
    pieces : {}
  }

  this.colors = {
    current : 0xffc038,
    connected : 0x544aaaa,
    included : 0x544aaaa,
    excluded : 0xcc6666,
    edge : 0x00ff33,
    highlight : 0xffff00,
  };

  this.scroll_sensitivity = 6;
  this.border = .08;

  this.scale = 15

  this.animate = function() {
    requestAnimationFrame(this.animate);
    this.render();
  }.bind(this);
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
   *click function, colors buildings for territory grab
   */
  onMouseDown : function(event) {

    //event.preventDefault();

    var hitobj = this.getHitObject();

    if (hitobj) {

      console.log(hitobj);

      //select building
      if (!cur_building) {

        hitobj.material = new THREE.MeshLambertMaterial({
          color : this.colors.current
        });

        this.cur_building = hitobj.game_piece;

        if (!this.map.pieces.contains(this.cur_building.game_piece.id)) {
          this.map.pieces[cur_building.id] = []
          this.cur_building.included = true;

        } else {

          for (connected in this.map.pieces[cur_building.id]) {
            this.objLookup(this.map.pieces[cur_building.id][connected]).material = new THREE.MeshLambertMaterial({
              color : this.colors.connected
            });

          }
        }

      } else {

        //deselect current building
        if (hitobj == this.cur_building) {

          this.cur_building.material = new THREE.MeshLambertMaterial({
            color : this.colors.included
          });

          for (connected in this.map.pieces[this.cur_building.id]) {
            console.log(this.map.pieces[this.cur_building.id][connected]);
            this.objLookup(this.map.pieces[this.cur_building.id][connected]).material = new THREE.MeshLambertMaterial({
              color : this.colors.included
            });
          }

          this.cur_building = null;

          //add connected to current building
        } else if (!this.map.pieces[this.cur_building.id].contains(hitobj.id)) {

          hitobj.material = new THREE.MeshLambertMaterial({
            color : this.colors.connected
          });

          this.map.pieces[this.cur_building.id].push(hitobj.id);
          hitobj.included = true;

          // create non-directed graph

          //add connected to main list
          if (!this.map.pieces.contains(hitobj.id)) {
            this.map.pieces[hitobj.id] = [];
          }

          //append the cur_buildinging to list of connected of this building
          this.map.pieces[hitobj.id].push(this.cur_building.id);

          //add line

          var geo = new THREE.Geometry();
          geo.vertices.push(new THREE.Vector3(hitobj.center[0], 2 * hitobj.center[1] + 5, hitobj.center[2]));
          geo.vertices.push(new THREE.Vector3(this.cur_building.center[0], 2 * this.cur_building.center[1] + 5, this.cur_building.center[2]));

          var mat = new THREE.LineBasicMaterial({
            color : this.colors.edge,
          });

          var line = new THREE.Line(geo, mat);
          this.scene.add(line);

          //removes from connected if connected already (deselect)
        } else {
          hitobj.material = new THREE.MeshLambertMaterial({
            color : this.colors.included
          });

          this.map.pieces[this.cur_building.id].pop(hitobj.id);

          // maintain non-directed graph
          this.map.pieces[hitobj.id].pop(this.cur_building.id);
        }
      }
    }
  },
  onMouseMove : function(event) {

    const highlight = new THREE.Color(this.colors.highlight);

    //refresh mouse location for use in other functions
    this.mouseX = event.x;
    this.mouseY = event.y;

    //*****highlights hovered
    this.cur_obj = this.getHitObject();

    // if mouse is over a new object than last frame
    // make sure you:
    // have a current object
    // either don't have an old one (was over nothing previously)
    // or the old object isnt the same as the current
    if (this.cur_obj && (!this.old_obj || (this.cur_obj !== this.old_obj))) {

      if (this.old_obj) {
        if (this.old_obj.included == true) {
          if (this.old_obj == cur_building) {
            this.old_obj.material["color"] = new THREE.Color(this.colors.current);
          } else {
            this.old_obj.material["color"] = new THREE.Color(this.colors.included);
          }
        } else {
          this.old_obj.material["color"] = new THREE.Color(this.colors.excluded);
        }

      }

      //set new obj to highlight
      mat = this.cur_obj.material;

      curmat = this.blend(this.cur_obj.material["color"], highlight);

      this.old_obj = this.cur_obj;
    }

    //undoes highlight if no obj hovered over
    else if (!this.cur_obj) {
      if (this.old_obj) {
        if (this.old_obj.included == true) {
          if (this.old_obj == this.cur_building) {
            this.old_obj.material["color"] = new THREE.Color(this.colors.included);
          } else {
            this.old_obj.material["color"] = new THREE.Color(this.colors.included);
          }
        } else {
          this.old_obj.material["color"] = new THREE.Color(this.colors.excluded);
        }

        this.old_obj = null;
      }
    }
  },

  panAuto : function(x, y) {

    if (x > (1 - this.border) * window.innerWidth) {
      this.camera.position.x += scroll_sensitivity;
      this.camera.target.x += scroll_sensitivity;

    } else if (x < this.border * window.innerWidth) {
      this.camera.position.x -= scroll_sensitivity;
      this.camera.target.x -= scroll_sensitivity;
    }

    if (y > (1 - this.border) * window.innerHeight) {
      this.camera.position.z += scroll_sensitivity;
      this.camera.target.z += scroll_sensitivity;

    } else if (y < this.border * window.innerHeight) {
      this.camera.position.z -= scroll_sensitivity;
      this.camera.target.z -= scroll_sensitivity;
    }

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

      var list = ray.intersectObjects(this.scene.children, true);
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
  }.bind(this),

  blend : function(mat1, mat2) {
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

      for (connected in this.map.pieces[this.cur_building.id]) {
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
      mesh.connected = this.map.pieces[model];

      mesh.scale.x = this.scale;
      mesh.scale.y = this.scale;
      mesh.scale.z = this.scale;
      mesh.team = 0;
      mesh.position.y = 0;

      ///////////////////////////////////////////

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

      mesh.center = new Array(this.scale * sumx / counter, this.scale * sumy / counter, this.scale * sumz / counter);

      ///////////////////////////////////////////
      mesh.id = model;
      this.mesh_lookup[model] = mesh;
      this.mesh_list.push(mesh);
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
    var jsonString = '{ "Cornell": { "Continents": { "EngineeringQuad": [ "duffield_phillips", "rhodes", "upson" ], "ArtsQuad": [ "goldwin", "mcgraw_uris", "taylor" ], "Central": [ "statler", "sage" ] }, "Territories": { "duffield_phillips": [ "upson", "hoy", "taylor" ], "taylor": [ "sage", "mcgraw_uris" ], "hoy": [ "upson" ], "sage": [ "statler", "mcgraw_uris", "duffield_phillips" ] } } }';

    var json = eval('(' + jsonString + ')');

    // alert("getBuildingList: " + getBuildingList());
    // alert("getBuilding: " + getBuilding("sage"));

    /**
     * creates a string array of buildings
     */

    var terr = this.map.pieces;
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
    return this.map.pieces[obj.name];
  },

  /**
   * returns the object in the scene with str as a name
   * returns undefined if str not in scene
   */
  getBuilding : function(building) {
    return this.map.pieces[building];
  },
  loadBoard : function() {

    var material;
    for (var i = 0; i < this.models.length; i++) {
      this.loadBasic(this.models[i]);
    }
  },

  initRender : function() {

    this.container = document.createElement('page');
    document.body.appendChild(this.container);

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

    this.canvas3D = $('#canvas3D');

    this.renderer = new THREE.WebGLRenderer({
      canvas : this.canvas3D[0],
      antialias : true,
      alpha : true,
    });

    this.renderer.sortObjects = false;
    this.renderer.autoClear = false;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.container.appendChild(this.renderer.domElement);

    this.loadBoard();

  },

  render : function() {
    this.panAuto(this.mouseX, this.mouseY);
    this.camera.lookAt(this.camera.target);
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
}

Array.prototype.contains = function(key) {

  var ret = false;
  jQuery.each(this, function(testkey, value) {

    if ((String(testkey)).localeCompare(key) == 0) {
      ret = true;
    }
  }.bind(this));

  return ret;
}