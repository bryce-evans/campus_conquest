<?
	include "includes/functions.php";
	
	if (isset($_POST['newgame'])){
		
		$title = clean($_POST['gameTitle']);
		$desc = clean($_POST['gameDesc']);
		
		$uid = $_SESSION['uid'];		
		
		
		$query = "INSERT INTO q_games VALUES(NULL, '$title', '$desc', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);";
		$query .= "INSERT INTO q_users_games VALUES('$uid', 
			(SELECT MAX(game_id) FROM q_games), 
			(SELECT MAX(order) + 1 FROM q_users_games WHERE game_id='
				(SELECT MAX(game_id) FROM q_games)')";
		
		db_multiquery_nr($query);
		header("Location: dashboard.php");
	}
