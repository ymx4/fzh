layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form;

  //用户管理
  table.render({
    elem: '#xy-resident-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {field: 'id', width: 100, title: '个人编号', sort: true}
      ,{field: 'username', title: '姓名', minWidth: 100}
      ,{field: 'phone', title: '手机'}
      ,{field: 'sex', width: 80, title: '性别'}
      ,{field: 'jointime', title: '加入时间', sort: true}
      ,{title: '操作', width: 150, align:'center', fixed: 'right', toolbar: '#table-resident'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-resident-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    }
  });

  exports('resident', {})
});