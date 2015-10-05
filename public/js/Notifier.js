/**
 * Notifier
 * Shows notifications on the screen
 */

Notifier = function() {
  this.container = $('#notifier');
}

Notifier.prototype = {
  newNote : function(text) {
    var note = $("<div>").addClass("note");
    note.text(text);
    this.container.append(note);

    var display_time = 3000;
    var fade_time = 2000;
    window.setTimeout(function() {
      note.fadeOut(fade_time);      
      window.setTimeout(function(){
        note.remove();
      }, display_time + fade_time);
    }, display_time);
  }
}
