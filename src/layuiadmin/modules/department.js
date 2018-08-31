layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common;

  //监听搜索
  form.on('submit(xy-department-search)', function(data){
    var field = data.field;
    
    //执行重载
    common.xyReload('xy-department-manage', {
      // url:'',
      where: field
    });
  });

  common.xyRender({
    elem: '#xy-department-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {field: 'username', title: '科室名称'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-department'}
    ]]
  });
  
  //监听工具条
  table.on('tool(xy-department-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    }
  });

  exports('department', {})
});