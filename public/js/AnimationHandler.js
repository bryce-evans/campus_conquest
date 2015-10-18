


AnimationHandler = function() {
  this.animations = [];
};

AnimationHandler.prototype = {
  addAnimation : function (animatable, updateFn) {
    var anim = new Animation(animatable, updateFn);
    this.animations.push(anim);
  },
  updateAll : function() {
    for (var i = 0; i < this.animations.length; i++) {
      var anim = this.animations[i];
      anim.update.bind(anim.animatable)();
    }
  },
};

Animation = function (animatable, update) {
  // an object with a mesh and fields used for updating
  this.animatable = animatable;
  this.update = update;
}
Animation.prototype  = {
}


