SoundHandler = function() {
  this.sounds = {};
  this.addAll();
}
SoundHandler.prototype = {
  addAll : function() {
    var defeat = document.createElement('audio');
    defeat.setAttribute('src', '/rsc/sounds/defeat.mp3');
    this.sounds.defeat = defeat;
    $.get();
  },
  playDefeat : function() {
    this.sounds.defeat.play();
  }
}
