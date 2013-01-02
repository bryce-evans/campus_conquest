<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

	<html lang="en">

		<head>

			<title>Territory Grab | Campus Conquest</title>

			<meta charset="utf-8">

			<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
			<LINK REL=StyleSheet HREF="../css/gamelayout.css" TYPE="text/css">

			<script type="text/javascript" src="../js/lib/jQuery.js"></script>
			<script src="../js/lib/Three.js"></script>
			<script src="../js/lib/Detector.js"></script>
			<script src="../js/lib/Stats.js"></script>

			<script src="../js/TeamData.js"></script>

		</head>

		<body>
			<div id="info">
				Territory Grab-
				<span>&copy; 2012 Campus Conquest</span>
			</div>

			<div id = "container">
				<canvas id="canvas2D"></canvas>
				<canvas id="canvas3D" ></canvas>
			</div>
			<div id = "controls">
				Controls Area

				<canvas id="turn_wheel" width="150" height="150"></canvas>
				<script "src=../js/Controls.js"></script>

				<div style="float:right; position:absolute; right: 30px; bottom: 30px;]">
					Options
					<br>
					<a href="#">Next Turn</a>
				</div>

			</div>

			<script src="../js/TerritoryGrab.js"></script>
			<script src="../js/TextOverlay.js"></script>
			<script src="../map_loader/Loader.js"></script>
			<script src="../js/Pick.js"></script>
			<script src="../js/controls.js"></script>

		</body>

	</html>

