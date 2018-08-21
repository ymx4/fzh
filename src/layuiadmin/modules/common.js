layui.define(['layer', 'admin', 'view', 'table', 'form', 'tree'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form;

  var user = {};

  if (location.href.indexOf('login') == -1) {
    var sess = layui.sessionData(layui.setter.tableName);
    if (!sess.user) {
      location.href = layui.setter.baseUrl + '/passport/login.html';
    } else {
      user = sess.user;
    }
  }

  var constant = {
    DEFAULT_PAGE_SIZE: 10,
  }

	var apierror = function(data, type){
		// console.log(data);
    if (type == 'show') {
      layer.msg(data.message);
    }
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

  admin.events.closeself = function(){
    parent.layui.admin.closeThisTabs();
  }

  admin.events.xyicd = function(elemid){
    var icdindex = layer.open({
      type: 1,
      content: '<div id="xyicd"></div>',
      title: 'ICD查询'
    });
    layer.full(icdindex);
    view('xyicd').render('common/icd').done(function(){
      setTimeout(function(){
        table.render({
          elem: '#xy-icd-table'
          ,url: layui.setter.api.SearchICD
          ,limit: constant.DEFAULT_PAGE_SIZE
          ,method: 'post'
          ,contentType: 'application/json'
          ,where: {
            ICD_KEYWORD: '',
          }
          ,request: {
            pageName: 'PAGE_NO'
            ,limitName: 'PAGE_SIZE'
          }
          ,response: {
            statusName: 'status'
            ,statusCode: 1
            ,countName: 'message'
          }
          ,cols: [[
            {type: 'numbers', title: '序号'}
            ,{field: 'DISEASE_NAME', title: '疾病名称'}
            ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-icd-ope'}
          ]]
          ,page: {layout:['prev', 'page', 'next', 'count']}
          ,text: '对不起，加载出现异常！'
        });
      },100);

      table.on('tool(xy-icd-table)', function(obj){
        if(obj.event === 'sel'){
          $('#' + elemid.attr('data-id')).val(obj.data.ID);
          $('#' + elemid.attr('data-name')).val(obj.data.DISEASE_NAME);
          $('#' + elemid.attr('data-name')).attr('title', obj.data.DISEASE_NAME);
          layer.close(icdindex);
        }
      });
      
      //监听搜索
      form.on('submit(xy-icd-search)', function(data){
        //执行重载
        table.reload('xy-icd-table', {
          page: {
            curr: 1
          }
          ,where: {
            ICD_KEYWORD: data.field.icdq
          }
        });
      });
    });
  };

  admin.events.xyins = function(elemid){
    var insindex = layer.open({
      type: 1,
      content: '<div id="xyins"></div>',
      title: '机构选择'
    });
    layer.full(insindex);
    view('xyins').render('common/ins').done(function(){
      setTimeout(function(){
        layui.tree({
          elem: '#xy-inslist'
          ,nodes: [{
            id: 1
            ,name: '父节点1'
            ,children: [{
              id: 11
              ,name: '子节点11'
            },{
              id: 12
              ,name: '子节点12'
            }]
          },{
            id: 2
            ,name: '父节点2（可以点左侧箭头，也可以双击标题）'
            ,children: [{
              id: 21
              ,name: '子节点21'
              ,children: [{
                id: 211
                ,name: '子节点211'
              }]
            }]
          }]
          ,click: function(node){
            console.log(this)
          }
        });
        $("#xyins").on("mousedown", ".layui-tree a cite",function(){ 
          $(".layui-tree a cite").removeClass('layui-bg-green');
          $(this).addClass('layui-bg-green');
        });
      },100);
    });
  };

  // var getParams = function () {
  //    var url = location.search;
  //    var theRequest = new Object();
  //    if (url.indexOf("?") != -1) {
  //       var str = url.substr(1);
  //       strs = str.split("&");
  //       for(var i = 0; i < strs.length; i ++) {
  //          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
  //       }
  //    }
  //    return theRequest;
  // }

	exports('common', {
    user: user,
    apierror: apierror,
    modal: modal,
    base: '/views/',
    constant: constant,
    // getParams: getParams,
	});
});