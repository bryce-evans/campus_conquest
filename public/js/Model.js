/**
 *  used for loading models with many textures
 *  takes a path to a json object, a texture set,
 *  loads them all and calls callback(mesh)
 */
Model = function(obj, tex_set, callback) {
  var tex_loader = new THREE.TextureLoader();
  var obj_loader = new THREE.JSONLoader();
  
  var texs = Object.keys(tex_set);
  var remaining = texs.length;
  for (var i = 0; i < texs.length; i++) {
    tex_loader.load(tex_set[texs[i]], function(tex) {
      this[texs[i]] = tex;
      remaining--;
      if (remaining === 0) {
        obj_loader.load(obj, function(geometry) {
          this.loaded = true;
          var material = new THREE.MeshPhongMaterial( {
            color : 0xdddddd,
            specular: 0x222222,
            shininess: 20,
            map: this.dif,
            normalMap: this.nrm,
            normalScale: new THREE.Vector2(0.6,0.6);
          });
          this.mesh = THREE.Mesh(geometry, material);
          callback(this.mesh);
        }.bind(this));
      }
    }.bind(this));
  }
};

Model.prototype = {
};

TextureSet = function(textures, dir) {
  
  var dir = dir || "";

  this.dif = dir + textures.dif;
  this.nrm = dir + textures.nrm;
}
