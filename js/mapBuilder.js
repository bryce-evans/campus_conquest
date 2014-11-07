MapBuilder = function() {

  
  this.jsonobj = new Object;
  jsonobj.Cornell = new Object;
  this.map = jsonobj.Cornell;
  map.Territories = new Object;

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

	this.cur_building
  this.old_obj
  this.cur_obj
  this.mat

  this.zoom = function(event) {
    const scroll_sensitivity = 0.6;
    const ceiling = 800;
    const floor = 50;

    var delta = 0;
    delta = event.wheelDelta * scroll_sensitivity;
    var newPos = camera.position.y - delta;
    if (delta && newPos < ceiling && newPos > floor) {
      camera.position.y = newPos;
    }

    //prevent default scrolling on page
    if (event.preventDefault)
      event.preventDefault();
    event.returnValue = false;
  }

  /**
   *click function, colors buildings for territory grab
   */
  this.onMouseDown = function(event) {

    event.preventDefault();

    var hitobj = getHitObject();

    if (hitobj) {

      console.log(hitobj);

      //select building
      if (!cur_building) {

        cur_building = hitobj;

        cur_building.material = new THREE.MeshLambertMaterial({
          color : this.colors.current
        });

        if (!contains(cur_building.id, map.Territories)) {
          map.Territories[cur_building.id] = []
          cur_building.included = true;

        } else {

          for (connected in map.Territories[cur_building.id]) {
            objLookup(map.Territories[cur_building.id][connected]).material = new THREE.MeshLambertMaterial({
              color : this.colors.connected
            });

          }
        }

      } else {

        //deselect current building
        if (hitobj == cur_building) {

          cur_building.material = new THREE.MeshLambertMaterial({
            color : this.colors.included
          });

          for (connected in map.Territories[cur_building.id]) {
            console.log(map.Territories[cur_building.id][connected]);
            objLookup(map.Territories[cur_building.id][connected]).material = new THREE.MeshLambertMaterial({
              color : this.colors.included
            });
          }

          cur_building = null;

          //add connected to current building
        } else if (!contains(hitobj.id, map.Territories[cur_building.id])) {

          hitobj.material = new THREE.MeshLambertMaterial({
            color : this.colors.connected
          });

          map.Territories[cur_building.id].push(hitobj.id);
          hitobj.included = true;

          // create non-directed graph

          //add connected to main list
          if (!contains(hitobj.id, map.Territories)) {
            map.Territories[hitobj.id] = [];
          }

          //append the cur_buildinging to list of connected of this building
          map.Territories[hitobj.id].push(cur_building.id);

          //add line

          var geo = new THREE.Geometry();
          geo.vertices.push(new THREE.Vector3(hitobj.center[0], 2 * hitobj.center[1] + 5, hitobj.center[2]));
          geo.vertices.push(new THREE.Vector3(cur_building.center[0], 2 * cur_building.center[1] + 5, cur_building.center[2]));

          var mat = new THREE.LineBasicMaterial({
            color : this.colors.edge,
          });

          var line = new THREE.Line(geo, mat);
          scene.add(line);

          //removes from connected if connected already (deselect)
        } else {
          hitobj.material = new THREE.MeshLambertMaterial({
            color : this.colors.included
          });

          map.Territories[cur_building.id].pop(hitobj.id);

          // maintain non-directed graph
          map.Territories[hitobj.id].pop(cur_building.id);
        }
      }
    }
  }

  this.onMouseMove = function(event) {

    const highlight = new THREE.Color(this.colors.highlight);

    //refresh mouse location for use in other functions
    mouseX = event.x;
    mouseY = event.y;

    //*****highlights hovered
    this.cur_obj = getHitObject();

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

      curmat = blend(this.cur_obj.material["color"], highlight);

      this.old_obj = this.cur_obj;
    }

    //undoes highlight if no obj hovered over
    else if (!this.cur_obj) {
      if (this.old_obj) {
        if (this.old_obj.included == true) {
          if (this.old_obj == cur_building) {
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
  }

  this.panAuto = function(x, y) {

    if (x > (1 - border) * window.innerWidth) {
      camera.position.x += scroll_sensitivity;
      camera.target.x += scroll_sensitivity;

    } else if (x < border * window.innerWidth) {
      camera.position.x -= scroll_sensitivity;
      camera.target.x -= scroll_sensitivity;

    }

    if (y > (1 - border) * window.innerHeight) {
      camera.position.z += scroll_sensitivity;
      camera.target.z += scroll_sensitivity;

    } else if (y < border * window.innerHeight) {
      camera.position.z -= scroll_sensitivity;
      camera.target.z -= scroll_sensitivity;

    }

  }

  this.getHitObject = function() {
    try {
      var vector = new THREE.Vector3((mouseX / window.innerWidth ) * 2 - 1, -(mouseY / window.innerHeight ) * 2 + 1, 0.5);
      projector.unprojectVector(vector, camera);

      var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

      return ray.intersectObjects(board)[0].object;
    } catch(err) {
      return null;
    }
  }

  this.blend = function(mat1, mat2) {
    mat1.r = (mat1.r + mat2.r) / 2;
    mat1.g = (mat1.g + mat2.g) / 2;
    mat1.b = (mat1.b + mat2.b) / 2;
    return mat1;
  }

  this.contains = function(obj, array) {

    var ret = false;
    jQuery.each(array, function(key, value) {

    if ((String(key)).localeCompare(obj) == 0)
      ret = true;
    });

    return ret;

  }

  this.keyControls = function(e) {
    e = window.event || e;
    e = e.charCode || e.keyCode;

    //enter key
    if (e == 13 && cur_building) {

      cur_building.material = new THREE.MeshLambertMaterial({
        color : this.colors.included
      });

      for (connected in map.Territories[cur_building.id]) {
        console.log(map.Territories[cur_building.id][connected]);
        objLookup(map.Territories[cur_building.id][connected]).material = new THREE.MeshLambertMaterial({
          color : this.colors.included
        });
      }

      cur_building = null;

      //s key
    } else if (e == 115) {
      var JSONstr = JSON.stringify(jsonobj);
      alert("Exported to Console \n [Ctrl + Shift + I]");
      console.log(JSONstr);
    }
  }
  
  /********************************************************
   * 
   */
  
  // MAP BUILDER LOADER
  
  //var json = '<?php echo $map?>';
// var myObject = JSON.parse(myJSONtext, reviver);
var jsonString = '{ "Cornell": { "Continents": { "EngineeringQuad": [ "duffield_phillips", "rhodes", "upson" ], "ArtsQuad": [ "goldwin", "mcgraw_uris", "taylor" ], "Central": [ "statler", "sage" ] }, "Territories": { "duffield_phillips": [ "upson", "hoy", "taylor" ], "taylor": [ "sage", "mcgraw_uris" ], "hoy": [ "upson" ], "sage": [ "statler", "mcgraw_uris", "duffield_phillips" ] } } }';

var json = eval('(' + jsonString + ')');

// alert("getBuildingList: " + getBuildingList());
// alert("getBuilding: " + getBuilding("sage"));

/**
 * creates a string array of buildings
 */

var terr = json["Cornell"]["Territories"];
var buildingList = new Array(terr.length);
var i = 0;

jQuery.each(terr, function(key, val) {
	buildingList[i++] = key;
});

/**
 * given an object
 * returns string array of connected buildings
 * Precondition: obj must have field called name
 */
function getConnected(obj) {
	var name = obj["name"];
	return json["Cornell"]["Territories"][name];
}

/**
 * returns the object in the scene with str as a name
 * returns undefined if str not in scene
 */
function getBuilding(str) {
	return json["Cornell"]["Territories"][str];
}

loadBoard = function() {
	var loader = new THREE.JSONLoader();
	var material;
	var rhodes, upson, hoy, sage;

	var dir = "../rsc/obj/";
	var unfinished_models = ["ad_white_house", "alumni", "appel", "bailey", "baker_olin", "balch", "barnes", "barton", "bio_tech", "bradfield", "caldwell", "carpenter", "ccc", "ckb", "comstock", "day", "dickson", "donlon", "duffield_phillips", "friedmen", "goldwin", "h_newman", "hollister", "hoy", "hr5", "ives", "jameson", "johnson", "kane", "ktb", "low_rises", "lr_conference", "malott", "mann", "morill", "morris", "mudd_corson", "newman", "observatory", "olive_taiden", "plant_sci", "psb_clarke", "rand", "roberts_kennedy", "rockefeller", "sage_chapel", "schoellkopf", "snee", "statler", "stimson", "teagle", "townhouses", "upson", "van_ren", "warren", "white", "willard_straight"];
	var models = ["sage", "mcgraw_uris", "uris"];

	loader.load(dir + "aaa_ground/ground.js", function(geometry) {

		material = new THREE.MeshLambertMaterial({
			color : 0x005500,
			shading : THREE.SmoothShading,
		});

		// var material = new THREE.MeshFaceMaterial();
		var mesh = new THREE.Mesh(geometry, material);

		mesh.scale.set(scale, scale, scale);
		mesh.position.y = 0;
		try {
			scene.add(mesh);
		} catch(err) {
			alert(e.stack);
		}
	});

	load = function(model) {

		loader.load(dir + model + "/" + model + ".js", function(geometry) {

			geometry.computeMorphNormals();

			material = new THREE.MeshLambertMaterial({
				map : THREE.ImageUtils.loadTexture(dir + model + "/" + model + ".png"),
				color : 0xcc6666,
				shading : THREE.FlatShading
			});

			var mesh = new THREE.Mesh(geometry, material);

			mesh.scale.set(scale, scale, scale);
			mesh.id = model;
			buildings[model] = mesh;
			mesh.position.y = 0;
			mesh.team = 0;
			board.push(mesh);
			scene.add(mesh);

		});
	}
	loadBasic = function(model) {

		loader.load(dir + model + "/" + model + ".js", function(geometry) {

			geometry.computeMorphNormals();

			material = new THREE.MeshLambertMaterial({
				color : 0xcc6666,
				shading : THREE.FlatShading
			});

			var mesh = new THREE.Mesh(geometry, material);
			mesh.connected = json["Cornell"]["Territories"][model];

			mesh.scale.set(scale, scale, scale);
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

			mesh.center = new Array(scale * sumx / counter, scale * sumy / counter, scale * sumz / counter);

			///////////////////////////////////////////
			mesh.id = model;
			buildings[model] = mesh;
			board.push(mesh);
			scene.add(mesh);
		});
	}
	// for(index in buildingList) {
	// var model = buildingList[index];
	// loadBasic(model);
	// }

	for (index in unfinished_models) {
		var model = unfinished_models[index];
		loadBasic(model);
	}

	for (index in models) {
		var model = models[index];
		loadBasic(model);
	}
}


}