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
				<script>
					var cur_angle = -Math.PI / 2;
					total_troops = 100;
					var canvas = document.getElementById('turn_wheel');
					var context = canvas.getContext('2d');
					var x = canvas.width / 2;
					var y = canvas.height / 2;
					var radius = 60;

					draw_arc = function(color, troops) {
						var startAngle = cur_angle;
						var endAngle = startAngle - (troops/total_troops)* 2 * Math.PI;
						cur_angle = endAngle;
						
						var counterClockwise = true;

						context.beginPath();
						context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
						context.lineWidth = 25;

						// line color
						context.strokeStyle = color;
						context.stroke();
					}
					
					draw_arc("00cc00",20);
					draw_arc("#ff0000",40);
					
				</script>
				
				<div style="float:right; position:absolute; right: 30px; bottom: 30px;]">
					Options
					<br>
					<a href="#">Next Turn</a>
				</div>

			</div>

			<script src="../js/TerritoryGrab.js"></script>
			<script src="../js/TerritoryGrabTextOverlay.js"></script>
			<script src="../map_loader/Loader.js"></script>
			<script type="text/javascript" src="../js/Pick.js"></script>
			<script src="../js/controls.js"></script>

		</body>

	</html>

