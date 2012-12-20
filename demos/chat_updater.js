var name;

<? if (isset($_SESSION['name'])) {

echo "name = \"" . $_SESSION['name'] . "\";";

} else { ?>

var name = prompt("Username:", "Guest");

if (!name || name === ' ') {
	name = "Guest";
}

name = name.replace(/(<([^>]+)>)/ig, "");

<? } ?>

$.ajax({
	type : "POST",
	url : "process.php",
	data : {
		'function' : 'setUser',
		'name' : name,
	},
	dataType : "json",
	success : function(data) {
		return;
	}
});

$("#name-area").html("[ <span>" + name + "</span>]");

var chat = new Chat();
$(function() {
	//chat.getState();

	// watch textarea for key presses
	$("#composer").keydown(function(event) {

		var key = event.which;

	});

	// watch textarea for release of key press
	$('#composer').keyup(function(e) {

		if (e.keyCode == 13) {

			var text = $(this).val();

			if (e.shiftKey) {
				event.preventDefault();
			} else {

				// send
				chat.send(text, name);
				$(this).val("");
			}
		}
	});

});
