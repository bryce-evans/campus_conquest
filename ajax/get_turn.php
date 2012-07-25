<?php
	include "../includes/functions.php";
	
	if (isset($_GET['game_id'])){
		$game_id = clean($_GET['game_id']);
		
		$current_turn = db_query_one("SELECT game_turn FROM q_games WHERE game_id='$game_id'");
		$num_players = db_query_one("SELECT COUNT(u_id) AS total FROM q_users_games GROUP BY game_id HAVING game_id='$game_id'");
		
		
		$game_turn = intval($current_turn["game_turn"]);
		$n = intval($num_players['total']);
		$order = $game_turn % $n + 1;
		
		$query = "SELECT u_id FROM q_users_games WHERE game_id='$game_id' AND user_order='$order'";
		
		$next_player = db_query_one($query);
		echo $next_player['u_id'];
	}

?>