TextureSet = function(dir, texture_paths) {
  this.dir = dir || "";
  this.loaded = false; 
  
  this.textures = {};
  this.paths = texture_paths;
 }
TextureSet.prototype = {
  load: function(callback) {
    var tex_loader = new THREE.TextureLoader();
    var keys = Object.keys(this.paths);
    var remaining = keys.length;
    for (var i = 0; i < keys.length; i++) {
      tex_loader.load(this.dir + this.paths[keys[i]], function(tex) {
        this.tex_set.textures[keys[this.i]] = tex;
        remaining--;
        if (remaining === 0) {
          this.tex_set.loaded = true;
          callback(this.tex_set.textures);
        }
      }.bind({tex_set : this, i: i}));
    }
  },
};
