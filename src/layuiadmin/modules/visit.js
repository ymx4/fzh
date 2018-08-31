layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common;

  var test = 1;
  var router = layui.router();
  if (router.search.t == 1) {
    test = 1;
  } else if (router.search.t == 2) {
    test = 2;
  } else {
    test = 3;
  }

  //监听搜索
  form.on('submit(xy-visit-search)', function(data){
    var field = data.field;
    
    //执行重载
    common.xyReload('xy-visit-manage', {
      // url:'',
      where: field
    });
  });

  common.xyRender({
    elem: '#xy-visit-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,where: {test: test}
    ,cols: [[
      {field: 'username', title: '就诊编号'}
      ,{field: 'username', title: '就诊时间'}
      ,{field: 'username', title: '患者姓名'}
      ,{field: 'username', title: '就诊医生'}
      ,{field: 'username', title: '状态'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-visit'}
    ]]
  });

  exports('visit', {})
});