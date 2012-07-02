<?
	session_start();
	unset ($_SESSION['uid']);
	unset ($_SESSION['email']);
	unset ($_SESSION['isadmin']);
	session_destroy();
	header("location:index.php");
?>