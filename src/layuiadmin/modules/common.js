layui.define(['layer', 'admin', 'view', 'table', 'form'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

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

  admin.events.xycid = function(elemid){
    var index = layer.open({
      type: 1,
      content: '<div id="xycid"></div>',
      title: ''
    });
    layer.full(index);
    view('xycid').render('common/icd').done(function(){
      table.render({
        elem: '#xy-icd-table'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [[
          {type: 'numbers', title: '序号'}
          ,{field: 'username', minWidth:100, title: '疾病名称'}
          ,{title: '操作', width: 150, align:'center', fixed: 'right', toolbar: '#table-icd-ope'}
        ]]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
      table.on('tool(xy-icd-table)', function(obj){
        if(obj.event === 'sel'){
          $('#' + elemid.attr('data-id')).val(obj.data.username);
          layer.close(layer.index);
        }
      });
      
      //监听搜索
      form.on('submit(xy-icd-search)', function(data){
        var field = data.field;
        
        //执行重载
        table.reload('xy-icd-table', {
          where: field
        });
      });
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