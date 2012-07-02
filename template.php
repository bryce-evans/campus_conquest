<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Campus Conquest</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<link rel = "stylesheet" type = "text/css" href = "css/styles.css" />
		<script type="text/javascript" src="js/scripts.js"></script>
	</head>
	<body>
		<div id="container">
			<div id="header">
				<div class='inner'>
					<div id='logo'>
						Campus Conquest
					</div>

					<div id='loginbox'>
						<form method='post' action='login.php'>
							<table>

								<?

								if (!isset($_SESSION['uid'])) {

									$logininfo = array("email", "password");
									$loginbutton = 0;
									foreach ($logininfo as $loginitem) {
										$capped = ucfirst($loginitem);
										echo "<tr>";
										echo "<td>$capped:</td><td><input type='text' name='$loginitem' /></td>";

										if ($loginbutton++ == 0) {
											echo "<td rowspan='2'>";
											echo "<input id='btn_login' class='button' type='submit' name='submit' value='Enter' />";
											echo "</td>";
										}

										echo "</tr>";
									}
									
								} else {
									echo "<div id='uppermenu'><a href='logout.php'>Logout</a></a>";
								}
								
								?>
							</table>
						</form>
					</div>
				</div>
			</div>
			<div id="body">
				<div class='inner'>
					<div id="content">
						<? echo $content
						?>
					</div>

				</div>
			</div>
			<div id="footer">
				<div class='inner'>
					Copyright &copy; 2012 Campus Conquest
				</div>
			</div>
		</div>
	</body>
</html>