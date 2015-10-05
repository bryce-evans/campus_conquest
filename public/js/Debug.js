$(document).ready(function(){
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
});
