OverrideController = function() {	
} 
OverrideController.prototype = {
  addListeners : function () {
    world.state_handler.socket.on(CONSTANTS.IO.OVERRIDE, function(data){
      world.notifier.note("!Override Detected. Refreshing...");
    });
    $(".debug .server-sync").click(function(){
      world.state_handler.syncToServer();
    });
    $(".debug .force-piece-state").click(function(){
      $('.force-piece-state-menu').show();
    });
    $('.force-piece-state-menu').click(function(){
      var piece = $('.force-piece-state-menu .pieces').val();
      var team = $('.force-piece-state-menu .teams').val();
      var units = $('.force-piece-state-menu .units').val();
      $.ajax({
        type: "POST",
        url: CONSTANTS.URL.MASTER_CONTROLLER,
        data: {
          game_id : world.id,
          command: "set-piece-state",
          key: "todo - implement",
          data: {piece: piece, team: team, units: units},
        },
      }).done(function(response){
        console.log(response);      
      });
    });
    $(".debug .force-reset").click(function(){
      console.log("resetting turn");
      $.ajax({
        type: "POST",
        url : CONSTANTS.URL.MASTER_CONTROLLER,
        data : {
          game_id : world.id,
          command : "reset-turn",
          key : "todo - implement security",
        },
        dataType : "json",
      }).done(function(response){
          console.log(response);
      });
    });
    $(".debug .force-next").click(function(){
      console.log("ending turn");
      $.ajax({
        type: "POST",
        url : CONSTANTS.URL.MASTER_CONTROLLER,
        data : {
          game_id : world.id,
          command : "next-turn",
          key : "todo - implement security",
        },
        dataType : "json",
        }).done(function(response){
          console.log(response);
        });
    });
    $(".debug .toggle-edges").click(function(){
      world.map.toggleEdges();
    });
  }
}

