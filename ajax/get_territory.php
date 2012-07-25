<?
	include "../includes/functions.php";
	
	if (isset($_POST['json'])){
		
		$json = $_POST['json'];
		
		$u_id = $json["u_id"];
		$t_id = $json["t_id"];
		$num_troops = $json["num_troops"];
		$game_id = $json["game_id"];
		
		$res = db_query_one("SELECT game_turn FROM q_games WHERE game_id='$game_id'");
		$game_turn = intval($res["game_turn"]) + 1;
		
		$query = "INSERT INTO q_states VALUES (NULL, '$t_id', '$u_id', '$num_troops', '$game_id');";
		$query .= "UPDATE q_games SET game_turn = '$game_turn' WHERE game_id='$game_id';";
		
		db_multiquery_nr($query);
	}
