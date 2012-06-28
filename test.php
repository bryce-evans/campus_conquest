<!-- <!DOCTYPE html>
<html>
<head>

<script type="text/javascript">
function loadXMLDoc(counter)
{
var xmlhttp;

if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }
xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
    document.getElementById("myDiv").innerHTML= counter;
counter=counter + 1;
    }
  }

}
</script>

<script text/javascript>
function print(str){
console.log(str);
}
</script>

</head>
<body>


<div id="myDiv"><h2>Let AJAX change this text</h2></div>

<?php 

$counter = 0;

//<form> <input type="button" onclick="loadXMLDoc($counter)"/>test</form> 

$counter++;

 ?>

</body>
</html> -->