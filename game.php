<?php
include "includes/functions.php";

if (isset($_GET['game_id'])){
	$_SESSION['game_id'] = clean($_GET['game_id']);
}

$game_id = $_SESSION['game_id'];
$u_id = $_SESSION['uid'];

$_max = db_query_one("SELECT MAX(user_order) + 1 as turn FROM q_users_games
	WHERE game_id = '$game_id'");
	
$max = $_max['turn'];
$query = "INSERT INTO q_users_games VALUES('$u_id', '$game_id', '$max')";
db_query_nr($query);

$content .= '
<div id="info">
	Territory Grab-
	<span>&copy; 2012 Campus Conquest</span>
</div>

<canvas id="canvas2D" width="1920" height="1080"></canvas>
<canvas id="canvas3D" ></canvas>

<script src="js/lib/Three.js"></script>
<script src="js/lib/Detector.js"></script>
<script src="js/lib/Stats.js"></script>
<script type="text/javascript" src="js/Turn.js"></script>
<script src="map_loader/Loader.js"></script>
<script src="js/TerritoryGrabTextOverlay.js"></script>
<script src="js/TerritoryGrab.js"></script>
<script type="text/javascript" src="js/Pick.js"></script>
<script src="js/state.js"></script>
';

include "template.php";

?>

