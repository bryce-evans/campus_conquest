<?
	include "../includes/functions.php";
	
	if (isset($_SESSION['game_id'])){
		echo $_SESSION['game_id'];
	} else {
		echo -1;
	}
	
?>	