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
        normalScale: new THREE.Vector2(0.6,0.6),
      });
      this.mesh = THREE.Mesh(geometry, material);
      callback(this.mesh);
    }.bind(this));
  },
};
