<?
	include "includes/functions.php";
	
	function process_states($state){
		return $state;
	}
	
	echo json_encode(db_query_into_array("SELECT * from q_states", "process_states"));
	
	
?>
