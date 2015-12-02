/**
 *  used for loading models with many textures
 *  takes a path to a json object, a texture set,
 *  loads them all and calls callback(mesh)
 */
Model = function(obj, textures, callback) {
  this.obj_path = obj;
  this.textures = textures;
};

Model.prototype = {
 load: function(callback) {
   var obj_loader = new THREE.JSONLoader();
    
    obj_loader.load(obj, function(geometry) {
      this.loaded = true;
      var material = new THREE.MeshPhongMaterial( {
        color : 0xdddddd,
        specular: 0x222222,
        shininess: 20,
        map: this.textures.dif,
        normalMap: this.textures.nrm,
        normalScale: new THREE.Vector2(0.6,0.6);
      });
      this.mesh = THREE.Mesh(geometry, material);
      callback(this.mesh);
    }.bind(this));
  },
};

TextureSet = function(dir, textures) {
  this.dir = dir || "";
  this.loaded = false; 
  
  this.textures = {};
  this.paths = {};
  this.paths.dif = dir + textures.dif;
  this.paths.nrm = dir + textures.nrm;
 }
TextureSet.prototype = {
  load: function(callback) {
    var tex_loader = new THREE.TextureLoader();
    var paths = Object.keys(this.paths);
    var remaining = paths.length;
    for (var i = 0; i < paths.length; i++) {
      tex_loader.load(paths[i], function(tex) {
        this.textures[texs[i]] = tex;
        remaining--;
        if (remaining === 0) {
          this.loaded = true;
          callback(this.textures);
        }
      }.bind(this));
    }
  },
};
