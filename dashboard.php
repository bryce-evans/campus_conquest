<? 
	include "includes/functions.php";
	
	$fields = array(
		"Title" => "game_title",
		"Description" => "game_desc"
	);
	
	function process_all_games($a){
		global $fields;
		
		$c = "";
		foreach ($fields as $filename => $fieldDBName){
			$c .= td($a[$fieldDBName]);
		}
		
		$c .= td("<a href='game.php?game_id=" . $a['game_id'] . "'>Join</a>");
		
		return tr($c);
	}
	
	$content .= title("Available Games");
	
	$query = "
		SELECT q_states.game_id as game_id, game_title, game_desc, game_created, game_start
		FROM ((q_states JOIN q_games ON q_states.game_id = q_games.game_id)
			JOIN q_users ON q_states.u_id = q_users.u_id)
		GROUP BY q_states.game_id";
	$content .= table_with_header(db_query($query, "process_all_games"), $fields, 1);
	
	
	
	include "template.php";
?>
