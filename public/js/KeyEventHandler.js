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
    A: 97,
    B: 98,
    C: 99,
    D: 100,
    E: 101,
    F: 102,
    G: 103,
    H: 104,
    I: 105,
    J: 106,
    K: 107,
    L: 108,
    M: 109,
    N: 110,
    O: 111,
    P: 112,
    Q: 113,
    R: 114,
    S: 115,
    T: 116,
    U: 117,
    V: 118,
    W: 119,
    X: 120,
    Y: 121,
    Z: 121,
    CAP_A: 65,
    CAP_B: 66,
    CAP_C: 67,
    CAP_D: 68,
    CAP_E: 69,
    CAP_F: 70,
    CAP_G: 71,
    CAP_H: 72,
    CAP_I: 73,
    CAP_J: 74,
    CAP_K: 75,
    CAP_L: 76,
    CAP_M: 77,
    CAP_N: 78,
    CAP_O: 79,
    CAP_P: 80,
    CAP_Q: 81,
    CAP_R: 82,
    CAP_S: 83,
    CAP_T: 84,
    CAP_U: 85,
    CAP_V: 86,
    CAP_W: 87,
    CAP_X: 88,
    CAP_Y: 89,
    CAP_Z: 90,
  };

  this.events = {};
  this.ctrlEvents = {};
}

KeyEventHandler.prototype = {
  init: function() {
    $(window).keypress(function(e) {
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
