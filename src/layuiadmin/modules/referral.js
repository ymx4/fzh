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
  form.on('submit(xy-referral-search)', function(data){
    var field = data.field;
    
    //执行重载
    table.reload('xy-referral-manage', {
      // url:'',
      where: field
    });
  });

  common.tRender({
    elem: '#xy-referral-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,where: {test: test}
    ,cols: [[
      {field: 'username', title: '会诊编号'}
      ,{field: 'username', title: '转诊日期'}
      ,{field: 'username', title: '姓名'}
      ,{field: 'username', title: '转诊单位'}
      ,{field: 'username', title: '状态'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-referral'}
    ]]
  });

  exports('referral', {})
});