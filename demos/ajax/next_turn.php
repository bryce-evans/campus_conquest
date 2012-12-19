<?php
	include "../includes/functions.php";
	
	if (isset($_GET['game_id'])){
		$game_id = clean($_GET['game_id']);
		
		$res = db_query_one("SELECT game_turn FROM q_games WHERE game_id='$game_id'");
		$game_turn = $res["game_turn"];

		$u_id = $_SESSION['uid'];
		$query = "SELECT user_turn 
			FROM q_users_games NATURAL JOIN q_games NATURAL JOIN q_users WHERE u_id='$u_id'";
		$res = db_query_one($query);
		$my_turn = $res['user_turn'];
		
		if ($my_turn != $game_turn){
			db_query_nr("UPDATE q_users_games SET user_turn = '$game_turn' WHERE u_id='$u_id'");
			$res = db_query_one("SELECT MIN(user_turn) AS min FROM q_users_games WHERE game_id='$game_id'");
			if ($res['min'] == $game_turn){
				$game_turn++;
				db_query_nr("UPDATE q_games SET game_turn = '$game_turn' WHERE game_id='$game_id'");
			}
		}
		
		echo $game_turn;
	}
?>