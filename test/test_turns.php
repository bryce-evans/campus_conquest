<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Campus Conquest</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
		
		<script type="text/javascript">
			
			$(document).ready(function(){
				$("#next_turn").click(function(){
					var game_id = getUrlVars()["game_id"];
					var turn = $.ajax({"url" : "/ajax/next_turn.php?game_id=" + game_id, async : false}).responseText;
					$("#turn").html("Turn #" + turn);
					return false;
				});
			});
			
			// Read a page's GET URL variables and return them as an associative array.
			function getUrlVars()
			{
			    var vars = [], hash;
			    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			    for(var i = 0; i < hashes.length; i++)
			    {
			        hash = hashes[i].split('=');
			        vars.push(hash[0]);
			        vars[hash[0]] = hash[1];
			    }
			    return vars;
			}
			
			setInterval(updateState, 1000);
			
			function updateState(){
				var game_id = getUrlVars()["game_id"];
				var turn = $.ajax({"url" : "/ajax/get_turn.php?game_id=" + game_id, async : false}).responseText;
				$("#turn").html("Turn #" + turn);
			}
			
		</script>
		
	</head>
	<body>
			
	<h1 id="turn">Loading ... </h1>
	<input type="submit" id="next_turn" value="Next Turn" />

	</body>
</html>