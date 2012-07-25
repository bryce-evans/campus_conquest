<?php
include "includes/functions.php";

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
<script src="js/TerritoryGrab.js"></script>
<script src="js/overlayText.js"></script>
<script src="map_loader/Loader.js"></script>
<script type="text/javascript" src="js/Pick.js"></script>';

include "template.php";

?>

