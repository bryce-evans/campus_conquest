<? 
	include "includes/functions.php";
	
	$uid = $_SESSION['uid'];
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
	
	/* Creates My Games */
	$content .= title("My Games");
	$query = "
		SELECT *
		FROM q_users_games NATURAL JOIN q_games
		WHERE u_id = '$uid'";
		
	$content .= content(table_with_header(db_query($query, "process_all_games"), $fields, 1));
	
	/* Creates Games that are Available (but not mine) */
	$content .= title("Other Games");
	$query = "
		SELECT *
		FROM q_games
		WHERE game_id NOT IN (
			SELECT game_id
			FROM q_users_games NATURAL JOIN q_games
			WHERE u_id ='$uid'
		)";
		
	$content .= content(table_with_header(db_query($query, "process_all_games"), $fields, 1));
	
	
	/* Adds the Game */
	$content .= title("Create Game");
	$content .= content("
	<form method='post' action='create.php'>
		<table class='table_form'>
			<tr><td>Title</td><td><input type='text' name='gameTitle' /></td></tr>
			<tr><td>Description</td><td><textarea name='gameDesc' cols='70' rows='3'></textarea></td></tr>
			<tr><td colspan='2'><input type='submit' name='newgame' value='New Game' /></td></tr>
		</table>
	</form>");
	
	include "template.php";
?>
