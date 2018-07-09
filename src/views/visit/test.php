<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>iconlist</title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <link rel="stylesheet" href="../../layuiadmin/layui/css/layui.css" media="all">
  <link rel="stylesheet" href="../../layuiadmin/style/admin.css" media="all">
  <link rel="stylesheet" href="../../layuiadmin/style/xy.css" media="all">
  <style type="text/css">
  *{
  	font-size:20px;
  }
  </style>
</head>
<body>
<?php
	$a='<i class="layui-icon">&#xe%s;</i>';
	for ($i=1000;$i<3000;$i++) {
		$j = dechex($i);
		echo $j . ' ' . sprintf($a,$j);
		echo ' ';
	}
?>
</body>
</html>