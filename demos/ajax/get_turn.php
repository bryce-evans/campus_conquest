<?php
	include "../includes/functions.php";
	
	if (isset($_GET['game_id'])){
		$game_id = clean($_GET['game_id']);
		
		$next_player = db_query_one("
			SELECT u_id
			FROM q_users_games
			WHERE game_id='$game_id' AND user_order = (
				SELECT MOD(turn, num) + 1
				FROM (
					SELECT 
						(SELECT game_turn AS turn FROM q_games WHERE game_id='$game_id') as turn, 
						(SELECT COUNT(u_id) AS num FROM q_users_games GROUP BY game_id HAVING game_id='$game_id') as num
				) as temp
			)
		");
		
		echo $next_player['u_id'];
	}

?>