SoundHandler = function() {
  this.muted = true;
  this.sounds = {};
  this.addAll();
}
SoundHandler.prototype = {
  addAll : function() {
    const dir = "/rsc/sounds/";
    var files = ["whoosh-in-out", "defeat-chimes", "reinforcements-brassy", "attack"];
    for (var i = 0; i < files.length; i++) {
      var domEl = document.createElement('audio');
      domEl.setAttribute('src', dir + files[i] + '.mp3');
      this.sounds[files[i]] = domEl;
      $.get();
    }
  },
  mute : function() {
    this.muted = true;
  },
  unmute : function() {
    this.muted = false;
  },
  play : function(file) {
    if (this.muted) {
      return;
    }
    this.sounds[file].play();
  }
}
