<?
	include "../includes/functions.php";
	
	function process_states($state){
		return $state;
	}
	
	if (isset($_GET['game_id'])){
		$game_id = clean($_GET['game_id']);
		echo json_encode(db_query_into_array("SELECT * from q_states WHERE game_id='$game_id'", "process_states"));
	}
	
?>
