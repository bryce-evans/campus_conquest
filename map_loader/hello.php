<?php
	echo "<h1>hello world</h1>"; 
	
	function wrap_in_h1_tags($str){
		return "<h1>".$str."</h1>";
	}
	
	$variable = "this is a string";
	$variable2 = 1;
	
	//concats
	echo wrap_in_h1_tags($variable . $variable2);
	
	//loops - php i snot type sensitive
	for ($i = 0; $i< 10; $i++){
		echo wrap_in_h1_tags($i);
	}
	
	//indexed arrays (normal like java)
	$ar_index = array(
		"qiming",
		"is",
		"a",
		"cool guy"
	);
	
	foreach ($ar_index as $element_in_the_array){
		echo wrap_in_h1_tags($element_in_the_array);
	}
	
	//php associative arrays ("like hashmap");
	$ar_assoc = array(
		"Home" => "index.php",
		"login" => "login.php",
		"about" => "about.php"
	);
	
	foreach ($ar_assoc as $key => $value){
		echo wrap_in_h1_tags("key: " . $key . " | value: " . $value);	
	}
	
	//connect to your database
	$host = "localhost";
	$user = "root";
	$password = "root";
	$db = "test_db_bryce";
	$mysqli = new mysqli($host, $user, $password, $db);
	
	$query = "SELECT * FROM friends";
	
	//result = 2D array
	$result = $mysqli->query($query);
	
	//fetches each row at a time as associtive array
	while ($individual_row = $result -> fetch_assoc()){
		echo wrap_in_h1_tags("Friend: " . $individual_row['name'] . " and their email: " . $individual_row['email']);
	}
	
	//this is important dont forget
	$mysqli->close();
?>