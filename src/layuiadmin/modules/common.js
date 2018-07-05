layui.define(['layer', 'admin', 'view'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin
  ,view = layui.view;

  var api = {
    GetAreaList: 'http://holtest.fres.cn/PublicMethods/AreaCode/GetAreaList.ashx',
    SearchICD: 'http://holtest.fres.cn/PublicMethods/ICD10/SearchICD.ashx',
  };

  var constant = {
    PAGE_SIZE: 10,
  }

	var apierror = function(data){
		console.log(data);
	};

  var modal = function(options) {
    options = $.extend({
      type: 2
    }, options);
    var index = layer.open({
      type: options.type,
      content: options.content,
      title: options.title
    });
    layer.full(index);
    return index;
  }

  admin.events.closelayer = function(){
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
  };

  admin.events.xycid = function(data){
    var index = layer.open({
      type: 1,
      content: '<div id="xycid"></div>',
      title: ''
    });
    layer.full(index);
    view('xycid').render('common/icd').done(function(){
    }); 
    // $.ajax({
    //   url: api.SearchICD
    //   ,type: 'post'
    //   ,data: JSON.stringify({
    //     ICD_KEYWORD: query,
    //     PAGE_NO: page,
    //     PAGE_SIZE: constant.PAGE_SIZE,
    //   })
    //   ,dataType: 'json'
    //   ,success: function(data){console.log(data);
    //     if (data.status == 1) {
    //       if (data.data != null && data.data.length > 0) {
            
    //       }
    //     } else {
    //       apierror(data);
    //     }
    //   }
    // });
  };

	exports('common', {
    api: api,
    apierror: apierror,
    modal: modal,
    base: '/views/',
	});
});