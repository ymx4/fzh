<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <link rel="stylesheet" href="../../layuiadmin/layui/css/layui.css" media="all">
  <link rel="stylesheet" href="../../layuiadmin/style/admin.css" media="all">
  <link rel="stylesheet" href="../../layuiadmin/style/xy.css" media="all">
</head>
<body>

<?php
$source = isset($_POST['ss']) ? $_POST['ss'] : '';
$dest = preg_replace(
  '/(<input type="text".*?>)|(<input type="checkbox".*?>)|(<input type="radio".*?>)/',
  '<div class="layui-form-mid layui-word-aux">{{d.username}}</div>',
  $source
);
?>

  <div class="layui-fluid">
    <form class="layui-form" method="post">
      <textarea name="ss" class="layui-textarea"><?php echo htmlspecialchars($dest);?></textarea>
      <input type="submit" value="convert">
      <textarea name="dd" class="layui-textarea"><?php echo htmlspecialchars($dest);?></textarea>
    </form>
  </div>
</body>
</html>

