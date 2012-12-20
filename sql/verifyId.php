<?php

if (!function_exists('json_encode')) {
    function json_encode($data) {
        switch ($type = gettype($data)) {
            case 'NULL':
                return 'null';
            case 'boolean':
                return ($data ? 'true' : 'false');
            case 'integer':
            case 'double':
            case 'float':
                return $data;
            case 'string':
                return '"' . addslashes($data) . '"';
            case 'object':
                $data = get_object_vars($data);
            case 'array':
                $output_index_count = 0;
                $output_indexed = array();
                $output_associative = array();
                foreach ($data as $key => $value) {
                    $output_indexed[] = json_encode($value);
                    $output_associative[] = json_encode($key) . ':' . json_encode($value);
                    if ($output_index_count !== NULL && $output_index_count++ !== $key) {
                        $output_index_count = NULL;
                    }
                }
                if ($output_index_count !== NULL) {
                    return '[' . implode(',', $output_indexed) . ']';
                } else {
                    return '{' . implode(',', $output_associative) . '}';
                }
            default:
                return ''; // Not supported
        }
    }
}

//Easy parse for ldap data -- return blank value if ldap entry doesn't exist (odd errors on CU server)
function getData($elm){
global $attrs;
	if(isset($attrs[$elm])){
		return $attrs[$elm][0];
	}else{
		return "";
	}
}

$file = file("out.txt");
foreach ($file as $netid){
	//Connect to CU LDAP Server
	$ds=ldap_connect("directory.cornell.edu");
	
	//Setup search filter -- see http://us2.php.net/ldap for more info
	$filter = "uid=$netid";
	
	if ($ds) { 
        $r=ldap_bind($ds); 
        $sr=ldap_search($ds,"ou=People,o=Cornell University,c=US",$filter);
        $info = ldap_get_entries($ds, $sr);
        $entry = ldap_first_entry($ds, $sr);
		if(!$entry){
			$return_array = array();
			$return_array["error"] = "Bad Net ID";
		}else{
	        if ($attrs = ldap_get_attributes($ds, $entry)) {
				
				//Could just return the following.  However, CU ldap data is a little messy, so we'll clean it up a bit
				//echo '{"ldap":'.$json->encode($attrs).'}';
				
				//Set up array
				$return_array = array(
					"netid" => $netid,
					"fullname" => getData("displayName"),
					"nickname" => getData("edupersonnickname"),
					"school" => getData("cornelledutype"),
					"type" => getData("edupersonprimaryaffiliation"),
					"url" => getData("labeledUri"),
					"localaddress" => getData("cornelledulocaladdress"),
					"campusaddress" => getData("cornelleducampusaddress"),
					"campusphone" => getData("cornelleducampusphone"),
					"cellphone" => getData("mobile"),
					"localphone" => getData("cornelledulocalphone")
					);

					
			}else{
				$return_array = array();
				$return_array["error"] = "Information suppressed.";
			}
		}
	}else{
		$return_array = array();
		$return_array["error"] = "Could not connect to directory server.";
	}

	echo json_encode($return_array) . "<br /><br />";
}

?>