layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common;

  form.on('submit(xy-institution-submit)', function(data){
    console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
    console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
    console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });

  //机构管理
  table.render({
    elem: '#xy-institution-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', title: '单位名称'}
      ,{field: 'username', title: '所属区域'}
      ,{field: 'username', title: '单位类型'}
      ,{field: 'username', title: '单位级别'}
      ,{field: 'username', title: '单位状态'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-institution'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-institution-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    }
  });

  exports('institution', {})
});