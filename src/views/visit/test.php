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
	// $a='<i class="layui-icon">&#xe%s;</i>';
	// for ($i=1000;$i<3000;$i++) {
	// 	$j = dechex($i);
	// 	echo $j . ' ' . sprintf($a,$j);
	// 	echo ' ';
	// }
?>
          <ul class="layui-nav xy-dropdown" lay-filter="">
            <li class="layui-nav-item">
              <a href="javascript:;">解决方案</a>
              <dl class="layui-nav-child">
                <dd><a href="">移动模块</a></dd>
                <dd><a href="">后台模版</a></dd>
                <dd><a href="">电商平台</a></dd>
              </dl>
            </li>
          </ul>
        <table id="xy-resident-manage" lay-filter="xy-resident-manage"></table>
        <script type="text/html" id="table-resident">
          <div class="layui-dropdown">
            <button type="button" class="layui-btn layui-btn-xs" data-toggle="dropdown">操作 <span class="layui-icon" style="font-size: 14px"></span></button>
            <ul class="layui-dropdown-menu">
              <li><a href="#" onclick="alert(2)">功能</a></li>
              <li><a href="#">另一个功能</a></li>
              <li><a href="#">其他</a></li>
              <li class="divider"></li><!--分割线-->
              <li><a href="#">分离的链接</a></li>
            </ul>
          </div>
          <a class="layui-btn layui-btn-normal layui-btn-xs" lay-href="resident/detail.html" lay-text="查看-{{d.username}}">查看</a>
          <a class="layui-btn layui-btn-normal layui-btn-xs" lay-href="resident/edit.html" lay-text="编辑-{{d.username}}">编辑</a>
          <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">删除</a>
        </script>
<script src="../../layuiadmin/layui/layui.js"></script>  
<script>
//注意：导航 依赖 element 模块，否则无法进行功能性操作
  layui.config({
    base: '../../layuiadmin/' //静态资源所在路径
    ,version: true
    ,debug: true
  }).extend({
    index: 'lib/index' //主入口模块
  }).use(['index', 'resident', 'dropdown'], function(){
  // var element = layui.element;
  
  //…
});
</script>
</body>
</html>