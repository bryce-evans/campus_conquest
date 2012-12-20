<?php include "functions.php"
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

		<title>Chat</title>

		<link rel="stylesheet" href="style.css" type="text/css" />

		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
		<script type="text/javascript" src="chat.js"></script>
		<script type="text/javascript" src="chat_updater.js"></script>

	</head>

	<body>

		<div id="page-wrap">

			<p id="name-area"></p>

			<div id="chat-wrap">
				<div id="chat-area"></div>
			</div>

			<form id="send-message-area">
				<textarea id="composer"></textarea>
			</form>

		</div>

	</body>

</html>