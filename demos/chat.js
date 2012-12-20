var instance = false;
var state;
var mes;
var file;

function Chat() {
	this.update = updateChat;
	this.send = sendChat;
	this.getState = getStateOfChat;
}

setInterval(updateChat, 1000);

//gets the state of the chat
function getStateOfChat() {
	if(!instance) {
		instance = true;
		$.ajax({
			type : "POST",
			url : "process.php",
			data : {
				'function' : 'update',
				'file' : file
			},
			dataType : "json",

			success : function(data) {
				state = data.state;
				instance = false;
			},
		});
	}
}

//Updates the chat
function updateChat() {
	$.ajax({
		type : "POST",
		url : "process.php",
		data : {
			'function' : 'update',
			'state' : state,
			'file' : file
		},
		dataType : "json",
		success : function(data) {
			$('#chat-area').html("");
			for(var i = 0; i < data.length; i++) {
				$('#chat-area').append($("<p>" + data[i] + "</p>"));
			}
			document.getElementById('chat-area').scrollTop = document.getElementById('chat-area').scrollHeight;
			state = data.state;
		}
	});

}

//send the message
function sendChat(message, nickname) {
	updateChat();
	$.ajax({
		type : "POST",
		url : "process.php",
		data : {
			'function' : 'send',
			'message' : message,
			'nickname' : nickname,
			'file' : file
		},
		dataType : "json",
		success : function(data) {
			updateChat();
		},
	});
}
