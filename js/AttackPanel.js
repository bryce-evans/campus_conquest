/*
 * Creates a new attack command panel
 *
 * cur_force: current force of attacking territory
 * full_force: maximum force of the attacking territory
 * reinforce: additional forces coming from other territories
 * enemy: forces present in the attacked enemy territory
 *
 */

attackPanel = function(start, end) {
	//(cur_force, full_force, reinforce, enemy) {

	const origin = start;
	const destination = end;
	const arrow = getArr(start.id, end.id);

	const titleYou = start.id;
	const titleThem = end.id;
	const reinforce = 0;

	var max_force = start.troops - 1 + reinforce;
	var cur_force = max_force;
	var reinforcements = reinforce;
	var enemy_force = end.troops;

	var multiplier = 1;
	var max = Math.max(max_force, enemy_force);

	if (max > 200) {
		multiplier *= 200 / max;
	}

	var WIDTH = $("#canvas").width();
	var HEIGHT = $("#canvas").height();

	var c;
	var mousedown = false;
	var mousex = 0;
	var mousey = 0;

	var rect;
	var rect2;

	const min_force = 0;
	const rectWidth = 60;
	const rectSpace = 4 * rectWidth;

	const startPt = [100, 300];

	function init() {
		c = $('#popup')[0].getContext("2d");

		rect = new scalableRect(cur_force);
		rect.draw();

		return setInterval(draw, 10);
	}

	function onKeyUp(e) {

		if (e.keyCode == 38)
			rect.scale(1);
		else if (e.keyCode == 40)
			rect.scale(-1);
	}

	function onMouseDown(e) {
		mousedown = true;
	}

	function onMouseUp(e) {
		mousedown = false;
	}

	function onMouseMove(e) {

		var delY = mousey - e.offsetY;

		if (mousedown) {

			rect.scale(delY);

		}

		mousex = e.offsetX;
		mousey = e.offsetY;
	}

	function scalableRect(force) {
		var f = force;
		var h = force;

		this.draw = function() {

			//reinforcements
			c.fillStyle = "#4a4";
			c.fillRect(startPt[0], startPt[1], rectWidth, -reinforcements * multiplier);

			//main rect
			c.fillStyle = "#" + zeroPad(colors[origin.team].toString(16));

			c.fillRect(startPt[0], startPt[1] - reinforcements, rectWidth, -(h * multiplier));

			//border
			c.strokeStyle = "#888";
			c.strokeRect(startPt[0], startPt[1], rectWidth, -(max_force * multiplier));

		}

		this.scale = function(del) {
			var newh = h + del;
			//h = newh;

			if (newh < (max_force) && newh > (min_force)) {
				h = newh;
				cur_force = h;
				origin.troops = max_force - cur_force;

				arrow.strength = cur_force;
				arrow.mesh.scale.z = .03 * cur_force * scale + .5;

			}
		}

		this.geth = function() {
			return h;
		}

		this.getHeight = function() {
			return h;
		}
	}

	// Draw Function
	function draw() {

		clear();

		//Titles
		c.font = "26px Times New Roman";
		c.fillStyle = "#ff8800";
		c.textAlign = 'center';

		c.fillText(titleYou, startPt[0] + rectWidth / 2, 80);
		c.fillText(titleThem, startPt[0] + rectWidth / 2 + rectSpace, 80);

		//purple rect
		c.fillStyle = "#" + zeroPad(colors[destination.team].toString(16));
		c.fillRect(startPt[0] + rectSpace, startPt[1], rectWidth, -enemy_force * multiplier);

		c.strokeStyle = "#888";
		c.strokeRect(startPt[0] + rectSpace, startPt[1], rectWidth, -enemy_force * multiplier);

		//fill line
		c.strokeStyle = "#ff0000";
		c.beginPath();
		c.moveTo(startPt[0], startPt[1] - enemy_force * multiplier);
		c.lineTo(startPt[0] + rectWidth, startPt[1] - enemy_force * multiplier);
		c.lineWidth = 1;
		c.stroke();

		//orange deficit warning
		c.fillStyle = "#331100";
		c.fillRect(startPt[0], startPt[1], rectWidth, -enemy_force * multiplier);

		rect.draw();

		//your force
		c.font = "14px helvetica";
		c.fillStyle = "#0088ff";
		c.textAlign = 'center';
		c.fillText(rect.geth() + reinforcements, startPt[0] + rectWidth / 2, startPt[1] + 20);

		//enemy force
		c.font = "14px helvetica";
		c.fillStyle = "#0088ff";
		c.textAlign = 'center';
		c.fillText(enemy_force, startPt[0] + rectSpace + rectWidth / 2, 320);

	}

	function clear() {

		//var headerHeight = $("#popup").css('height');

		// Store the current transformation matrix
		c.save();

		// Use the identity matrix while clearing the canvas
		c.setTransform(1, 0, 0, 1, 0, 0);
		c.clearRect(0, 0, 500, 500);

		// Restore the transform
		c.restore();

		//c.clearRect(0, 0, WIDTH + 300, HEIGHT + 300);
	}

	function getCurrentForce() {
		return rect.geth();
	}

	// Use JQuery to wait for document load
	$(document).ready(function() {
		init();

	});

	$(document).keyup(onKeyUp);
	$(document).mousedown(onMouseDown);
	$(document).mouseup(onMouseUp);
	$(document).mousemove(onMouseMove);

}
function zeroPad(num) {
	var zero = 6 - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}
