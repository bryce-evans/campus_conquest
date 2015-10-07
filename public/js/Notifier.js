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
  }
}
