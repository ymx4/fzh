layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common;

  //监听搜索
  form.on('submit(xy-doctor-search)', function(data){
    var field = data.field;
    
    //执行重载
    table.reload('xy-doctor-manage', {
      // url:'',
      where: field
    });
  });

  table.render({
    elem: '#xy-doctor-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {field: 'username', title: '医生编号'}
      ,{field: 'username', title: '医生姓名'}
      ,{field: 'username', title: '登录名'}
      ,{field: 'username', title: '账号状态'}
      ,{field: 'username', title: '医生角色'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-doctor'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-doctor-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    }
  });

  exports('doctor', {})
});