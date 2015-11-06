/**
 * Notifier
 * Shows notifications on the screen
 */

Notifier = function() {
  this.container = $('#notifier');
  this.display_time = 3000;
  this.fade_time = 2000;
}

Notifier.prototype = {
  note : function(text) {
    var note = $("<div>").addClass("note");
    note.text(text);
    this.container.append(note);

    window.setTimeout(function() {
      note.fadeOut(this.fade_time);      
      window.setTimeout(function(){
        note.remove();
      }.bind(this), this.display_time + this.fade_time);
    }.bind(this), this.display_time);
  },
  fadeInOut : function(primary, secondary) {
    primary = primary || "";
    secondary = secondary || "";
    $('#fade-in-out-window').show();
    $('#fade-in-out-window .primary').text(primary);
    $('#fade-in-out-window .secondary').text(secondary);
    window.setTimeout(function() {
      $('#fade-in-out-window').hide();
    }, 2000);
  },
}
