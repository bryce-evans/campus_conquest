var is_my_turn = false;

setInterval(function(){
	
	var game_id = $.ajax({ url : "ajax/get_gameid.php", async : false}).responseText.trim();
	var u_id = $.ajax({ url : "ajax/get_id.php", async : false}).responseText.trim();
	var turn_id = $.ajax({ url : "ajax/get_turn.php?game_id=" + game_id, async : false}).responseText.trim();
	
	if (u_id == turn_id){
		is_my_turn = true;
	} else {
		is_my_turn = false;
	}
	
}, 1000);