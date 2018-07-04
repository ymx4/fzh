layui.define(['layer', 'admin'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin;

	var error = function(data){
		console.log(data);
	};

  var modal = function(url, title) {
    var index = layer.open({
      type: 2,
      content: url,
      maxmin: true,
      title: title
    });
    layer.full(index);
    return index;
  }

  admin.events.closelayer = function(){
    console.log(123);
    parent.$(".layui-layer-close").click();
  };

	exports('common', {
    api: {
      GetAreaList: 'http://holtest.fres.cn/PublicMethods/AreaCode/GetAreaList.ashx',
      error: error
    },
    modal: modal,
    base: '/views/',
	});
});