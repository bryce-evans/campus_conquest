<?
	include "../includes/functions.php";
	
	if (isset($_GET['game_id'])){
		$change = $_POST['game_id'];
		$json = json_decode($change, true);
		
		$player = $json['u_id'];
		$from = $json['from'];
		$to = $json['to'];
		$num_troops = $json['num_troops'];
		
		
		
	}
	
?>
