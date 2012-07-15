<?php
	include "../includes/functions.php";
	
	if (isset($_GET['game_id'])){
		$game_id = clean($_GET['game_id']);
		
		$res = db_query_one("SELECT game_turn FROM q_games WHERE game_id='$game_id'");
		$game_turn = $res["game_turn"];
		
		echo $game_turn;
	}
?>