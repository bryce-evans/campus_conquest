


AnimationHandler = function() {
  this.animations = [];
};

AnimationHandler.prototype = {
  addAnimation : function (animatable) {
    var anim = new Animation(animatable);
    this.animations.push(anim);
  },
  updateAll : function() {
    for (var i = 0; i < this.animations.length; i++) {
      var anim = this.animations[i];
      var is_done =  anim.update.bind(anim.animatable)();
      if (is_done) {
        this.animations.splice(i, 1);
      }
    }
  },
};

Animation = function (animatable) {
  // an object with a mesh and fields used for updating
  this.animatable = animatable;
  this.update = animatable.update;
}
Animation.prototype  = {
}


