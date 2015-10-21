KeyEventHandler = function() {
  
  this.keys = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16, 
    CTRL: 17,
    ALT: 18,
    CAPS_LOCK: 20,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    INSERT: 45,
    DELETE: 46,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
  };

  this.events = {};
  this.ctrlEvents = {};
}

KeyEventHandler.prototype = {
  init: function() {
    $(window).onKeyPress(function(e) {
      e.preventDefault();
      var key = e.keyCode;
      if (!e.ctrlKey) {
        if (key in this.events) {
          this.events[key]();
        }
      } else {
        if (key in this.ctrlEvents) {
          this.ctrlEvents[key]();
        }
      }
    }.bind(this));
  },
  setKeyListener: function(keycode, fn) {
    this.events[keycode] = fn;
  },
  setKeyCtrlListener: function(keycode, fn) {
    this.ctrlEvents[keycode] = fn;
  },
  unsetKeyListener: function(keycode) {
    delete this.events[keycode];
  },
  unsetKeyCtrlListener: function(keycode) {
    delete this.ctrlEvents[keycode];
  },
}
