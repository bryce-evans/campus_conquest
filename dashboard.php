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
		
		return tr($c);
	}
	
	$content .= title("Available Games");
	
	$query = "SELECT * FROM q_games NATURAL JOIN q_users NATURAL JOIN q_games_users_states;";
	$content .= table_with_header(db_query($query, "process_all_games"), $fields);
	
	include "template.php";

?>
