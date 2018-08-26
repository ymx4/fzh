layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common;

  //监听搜索
  form.on('submit(xy-equipment-search)', function(data){
    var field = data.field;
    
    //执行重载
    table.reload('xy-equipment-manage', {
      // url:'',
      where: field
    });
  });

  common.tRender({
    elem: '#xy-equipment-manage'
    ,url: layui.setter.api.GetEquipmentList
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,method: 'post'
    ,contentType: 'application/json'
    ,where: {
      "UNIT_ID": common.user.UNIT_ID
    }
    ,request: {
      pageName: 'PAGE_NUMBER'
      ,limitName: 'PAGE_SIZE'
    }
    ,response: {
      statusName: 'status'
      ,statusCode: 1
      ,countName: 'message'
    }
    ,cols: [[
      {field: 'EQUIPMENT_NO', title: '设备编号'}
      ,{field: 'EQUIPMENT_TYPE_NAME', title: '设备类型'}
      ,{field: 'UNIT_NAME', title: '所属机构'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-equipment'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-equipment-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    }
  });

  exports('equipment', {})
});