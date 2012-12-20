<?php
	include "identity.php";
	
	// session management
	if (session_id() == "") session_start();
	
	// set this or it complains
	date_default_timezone_set('America/New_York');
	
	// sanitize user input
	function clean($txt){
		return htmlspecialchars($txt, ENT_QUOTES, 'UTF-8');
	}
	
	function title($text){
		return "<div class='title'>".$text."</div>";
	}
	
	function table($t){
		return "<table class='main_table'>".$t."</table>";
	}
	
	/**
	 * Database Functions. Call sequence:
	 * 
	 * function process_stuff($a){
	 * 		...
	 * }
	 * 
	 * db_connect();
	 * db_execute($query, "process_stuff");
	 * db_close();
	 * 
	 */
	
	$mysqli = null;
	$title = "";
	$content = "";
	
	/** Generates valid MySQL object */
    function db_connect(){
    	global $mysqli;
		
		// close previous session, if it exists
		$mysqli = new mysqli(identity::$host, identity::$username, identity::$password, identity::$db);
    }
    
	/** Queries the db with $query. Process each result with processing_function */
    function db_query($query, $processing_function){
    	global $mysqli;
    	db_connect();
		
		$c = "";
    	$r = $mysqli->query($query);
    	while ($a = $r->fetch_assoc()){
    		$c .= call_user_func($processing_function, $a);
    	}
    	
		db_close();
		
    	return $c;
    }
	
	function db_query_nr($query){
		global $mysqli;
		
		db_connect();
		$mysqli->query($query);
		db_close();
	}
	
	/** Executes query, returns the first record as associative array */
	function db_query_one($query){
		global $mysqli;
		
		db_connect();
		$r = $mysqli->query($query);
		$result = $r->fetch_assoc();
		db_close();
		
		return $result;
	}
    
	/** Closes the DB conenction */
    function db_close(){
    	global $mysqli;
		
		$mysqli->close();	
    }
    
	/** Returns mysqli object */
    function db_mysqli(){
    	global $mysqli;
    	return $mysqli;
    }
	
	

?>