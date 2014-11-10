WindowHandler = function(world) {
  this.world = world;
  this.setDimensions();
}

WindowHandler.prototype.setDimensions = function() {
  this.dimensions = {
    height : window.innerHeight,
    width : window.innerWidth
  };
  this.aspect_ratio = this.dimensions.width / this.dimensions.height;
}

WindowHandler.prototype.addWindowResizeListener = function() {
  window.addEventListener('resize', this.onWindowResize, false);
}

WindowHandler.prototype.onWindowResize = function(event) {
  this.setDimensions();
  this.world.graphics.renderer.setSize(this.dimensions.width, this.dimensions.height / this.aspect_ratio);
  this.world.graphics.camera.updateProjectionMatrix();
}

WindowHandler.prototype.maxWindow = function() {
  window.moveTo(0, 0);

  if (document.all) {
    top.window.resizeTo(screen.availWidth, screen.availHeight);
  } else if (document.layers || document.getElementById) {
    if (top.window.outerHeight < screen.availHeight || top.window.outerWidth < screen.availWidth) {
      top.window.outerHeight = screen.availHeight;
      top.window.outerWidth = screen.availWidth;
    }
  }
}

