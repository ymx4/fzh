layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common;

  var test = 1;
  var params = common.getParams();
  if (params.t == 1) {
    test = 1;
  } else if (params.t == 2) {
    test = 2;
  } else {
    test = 3;
  }

  //监听搜索
  form.on('submit(xy-visit-search)', function(data){
    var field = data.field;
    
    //执行重载
    table.reload('xy-visit-manage', {
      // url:'',
      where: field
    });
  });

  table.render({
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
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  exports('visit', {})
});