<?php
include "functions.php";
$function = $_POST['function'];

$log = array();
$logs = null;

//2012-07-08 00:00:00
$dateTimeVariable = date("Y-m-d H:i:s");
$currentDate = strtotime($dateTimeVariable);
$futureDate = $currentDate-(60*5);
$dateMinusFive = date("Y-m-d H:i:s", $futureDate);

function populate_logs($logi){
	global $logs;
	$logs[] = "<div style='inline' class='entries' title='" . $logi['time'] . "'>" . $logi['text'] . "</div>";
}

switch($function) {
	
	case('setUser'):
		$_SESSION['name'] = $_POST['name'];
		
		try {
			$user = db_query_one("SELECT * FROM users WHERE name='" . $_SESSION['name'] > "'");
		} catch (Exception $e){
			db_query_nr("INSERT INTO users VALUES(NULL, '".$_SESSION['name']."', '$dateTimeVariable')");
		}
		
		break;
	
	case('update') :
		db_query_nr("UPDATE users SET lastLogin = '$dateTimeVariable' WHERE name = '" . $_SESSION['name'] . "'");
		
		$logs = array();
		$query = "SELECT * FROM entries WHERE time > '$dateMinusFive'";
		db_query($query, "populate_logs");
		
		echo json_encode($logs);
		break;
		
	case('send') :
		$nickname = htmlentities(strip_tags($_POST['nickname']));
		$reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
		$message = htmlentities(strip_tags($_POST['message']));
		if (($message) != "\n") {

			if (preg_match($reg_exUrl, $message, $url)) {
				$message = preg_replace($reg_exUrl, '<a href="' . $url[0] . '" target="_blank">' . $url[0] . '</a>', $message);
			}
			
			//str_replace("\n", " ", $message);
			$txt = "<span class =$nickname>" . $nickname . "</span>" . $message . "\n" ;
			db_query_nr("INSERT INTO entries VALUES(NULL, '$txt', '$dateTimeVariable')");
			db_query_nr("INSERT INTO post VALUES('" . $_SESSION['name'] . "', (SELECT max(id) FROM entries))");
			
		}
		
		break;
}

?>