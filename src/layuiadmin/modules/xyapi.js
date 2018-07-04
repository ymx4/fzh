layui.define(function(exports){
	var error = function(data){
		console.log(data);
	}
	exports('xyapi', {
		GetAreaList: 'http://holtest.fres.cn/PublicMethods/AreaCode/GetAreaList.ashx',
		error: error
	})
});