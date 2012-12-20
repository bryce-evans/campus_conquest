<?
	include "includes/functions.php";
	
	if (isset ($_POST['submit'])){
		if (!$_POST["email"] || !$_POST["password"]){
			$title = "Error";
			$content = "You need to provide a username and password! <a href='login.php'>Login</a>";
		} else {

			$email =  clean($_POST['email']);
			$password = clean($_POST['password']);
					
			$query = "
			SELECT *
			FROM q_users
			WHERE u_email = '$email'
			";
			
			$arr = db_query_one($query);

			if (isset($arr['u_pwd']) && hash('sha256', $password) == $arr['u_pwd']){
				$_SESSION['uid'] = $arr['u_id'];
				$_SESSION['email'] = $arr['u_email'];
				$_SESSION['isadmin'] = $arr['u_isadmin'];
				
				$query = "UPDATE users SET u_lastlogin = CURRENT_TIMESTAMP WHERE u_id='".$arr['u_id']."'";
				db_query_nr($query);
				
				header("location:dashboard.php");
			
			} else {
				unset($_SESSION['uid']);
				unset($_SESSION['email']);
				
				$title = "Error";
				$content = "Invalid Username or Password! <a href='login.php'>Login</a>";
			}
		}
	}

	if ($title == "" && $content == ""){
		$title = identity::$site_name." Login";
		$content = '
			<form method="post" action="login.php">
				<table>
					<tr><td>Email</td><td><input type="text" name="email" /></td></tr>
					<tr><td>Password</td><td><input type="password" name="password" /></td></tr>
					<tr><td colspan = "2"><input type="submit" name="submit" value="Login" /></td></tr>
				</table>
			</form>
		';
	}
	
	include "template.php";
?>