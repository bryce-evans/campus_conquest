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
	
	function content($text){
		return "<div class='content'>" . $text . "</div>";
	}
	
	/**
	 * Wrapper for TABLE
	 */
	function table($t){
		return "<table class='table'>".$t."</table>";
	}
	
	/**
	 * Given table content $t and header(header name in plain text => header name in DB)
	 * returns table with appropriate headers and table cells
	 */
	function table_with_header($t, $header, $empty = 0){
		$c = "";
		foreach($header as $headerName => $headerDBName){
			$c .= td($headerName);
		}
		
		while ($empty > 0){
			$c .= td("");
			$empty--;
		}
		
		$headers = tr($c);
		return table($headers . $t);
	}
	
	/**
	 * Wrapper for TR
	 */
	function tr($t){
		return "<tr>".$t."</tr>";
	}
	
	/**
	 * Wrapper for TD
	 */
	function td($t){
		return "<td>".$t."</td>";
	}
	
	function blog_form(){
		return '<form class="formee" method="post" action="new.php?blog">
			<fieldset>
				<div class="grid-12-12">
	                <label>Title <em class="formee-req">*</em></label>
	               <input type="text" name="title" />
		        </div>
		        <div class="grid-12-12">
		        	<label>Entry <em class="formee-req">*</em></label>
		        	<textarea id="blog_entry" name="entry" rows="" cols="" ></textarea>
		        </div>
		        
				<div class="grid-12-12">
					<input class="right" type="submit" name="blog" title="Save" value="Save" />
				</div>
			
			</fieldset>
		</form>';
	}
	
	function photo_form(){
		return '<form class="formee" method="post" action="new.php" enctype="multipart/form-data">
			<fieldset>
				
				<div class="grid-12-12">
	                <label>File</label>
	               	<input name="image" size="50" type="file" /> 
		        </div>

				<div class="grid-12-12">
	                <label>Caption</label>
	               <input type="text" name="title" />
		        </div>

		        <input type="hidden" name="photo" value="photo" />
				
				<div class="grid-12-12">
					<input class="right" type="submit" name="upload" value="Upload" />
				</div>
			
			</fieldset>
		</form>';
	}
	
	function about_us_form(){
		return '<form class="formee" method="post" action="edit.php?about">
			<fieldset>
				<div class="grid-12-12">
		        	<label>Content <em class="formee-req">*</em></label>
		        	<textarea id="about_us" name="about_us" rows="" cols="" ></textarea>
		        </div>
		        
				<div class="grid-12-12">
					<input class="right" type="submit" title="Update" value="Update" />
				</div>
			</fieldset>
		</form>';
	}

	##########################################################################################################
	# IMAGE FUNCTIONS																						 #
	# You do not need to alter these functions																 #
	##########################################################################################################
	function resizeImage($image,$width,$height,$scale) {
		list($imagewidth, $imageheight, $imageType) = getimagesize($image);
		$imageType = image_type_to_mime_type($imageType);
		$newImageWidth = ceil($width * $scale);
		$newImageHeight = ceil($height * $scale);
		$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
		switch($imageType) {
			case "image/gif":
				$source=imagecreatefromgif($image); 
				break;
		    case "image/pjpeg":
			case "image/jpeg":
			case "image/jpg":
				$source=imagecreatefromjpeg($image); 
				break;
		    case "image/png":
			case "image/x-png":
				$source=imagecreatefrompng($image); 
				break;
	  	}
		imagecopyresampled($newImage,$source,0,0,0,0,$newImageWidth,$newImageHeight,$width,$height);
		
		switch($imageType) {
			case "image/gif":
		  		imagegif($newImage,$image); 
				break;
	      	case "image/pjpeg":
			case "image/jpeg":
			case "image/jpg":
		  		imagejpeg($newImage,$image,90); 
				break;
			case "image/png":
			case "image/x-png":
				imagepng($newImage,$image);  
				break;
	    }
		
		chmod($image, 0777);
		return $image;
	}
	//You do not need to alter these functions
	function resizeThumbnailImage($thumb_image_name, $image, $width, $height, $start_width, $start_height, $scale){
		list($imagewidth, $imageheight, $imageType) = getimagesize($image);
		$imageType = image_type_to_mime_type($imageType);
		
		$newImageWidth = ceil($width * $scale);
		$newImageHeight = ceil($height * $scale);
		$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
		switch($imageType) {
			case "image/gif":
				$source=imagecreatefromgif($image); 
				break;
		    case "image/pjpeg":
			case "image/jpeg":
			case "image/jpg":
				$source=imagecreatefromjpeg($image); 
				break;
		    case "image/png":
			case "image/x-png":
				$source=imagecreatefrompng($image); 
				break;
	  	}
		imagecopyresampled($newImage,$source,0,0,$start_width,$start_height,$newImageWidth,$newImageHeight,$width,$height);
		switch($imageType) {
			case "image/gif":
		  		imagegif($newImage,$thumb_image_name); 
				break;
	      	case "image/pjpeg":
			case "image/jpeg":
			case "image/jpg":
		  		imagejpeg($newImage,$thumb_image_name,90); 
				break;
			case "image/png":
			case "image/x-png":
				imagepng($newImage,$thumb_image_name);  
				break;
	    }
		chmod($thumb_image_name, 0777);
		return $thumb_image_name;
	}
	//You do not need to alter these functions
	function getHeight($image) {
		$size = getimagesize($image);
		$height = $size[1];
		return $height;
	}
	//You do not need to alter these functions
	function getWidth($image) {
		$size = getimagesize($image);
		$width = $size[0];
		return $width;
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
	
	function db_query_into_array($query, $processing_function){
		global $mysqli;
    	db_connect();
		
		$c = "";
    	$r = $mysqli->query($query);
		
		$arr = Array();
		
    	while ($a = $r->fetch_assoc()){
    		$arr[] = call_user_func($processing_function, $a);
    	}
    	
		db_close();
		
    	return $arr;
	}
	
	function db_query_nr($query){
		global $mysqli;
		
		db_connect();
		$mysqli->query($query);
		db_close();
	}
	
	function db_multiquery_nr($query){
		global $mysqli;
		
		db_connect();
		$mysqli->multi_query($query);
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