layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,router = layui.router();

  var init = {
    edit: function() {
      if (router.search.id) {
        common.req({
          url: layui.setter.api.GetEquipmentInfo
          ,data: {
            EQUIPMENT_NO: router.search.EQUIPMENT_NO
          }
          ,success: $.proxy(function(data){
            form.val('xy-equipment-form', data.data);
            common.req({
              url: layui.setter.api.GetEquipmentType
              ,data: {}
              ,success: $.proxy(function(data){
                if (data.data.length > 0) {
                  var html = '<option value="">请选择</option>';
                  for (i = 0; i < data.data.length; i++) {
                    html += '<option value="' + data.data[i].CONFIG_ID + '">' + data.data[i].CONFIG_VALUE + '</option>';
                  }
                  $(this).html(html);
                }
                form.render('select');
              }, this)
            });
          }, this)
        });
      }
    }
  }

  form.on('submit(xy-equipment-submit)', function(data){
    common.req({
      url: layui.setter.api.ModifyEquipment
      ,formerror: true
      ,data: data.field
      ,success: function(data){
        
      }
    });
    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });

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
    elem: '#xy-equipment-data'
    ,url: layui.setter.api.GetEquipmentData
    ,where: {
      "EQUIPMENT_NO": router.search.EQUIPMENT_NO
      ,USED: 2
    }
    ,cols: [[
      {field: 'EQUIPMENT_NO', title: '设备编号'}
      ,{field: 'EQUIPMENT_TYPE_NAME', title: '设备类型'}
      ,{field: 'UNIT_NAME', title: '所属机构'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-equipment'}
    ]]
  });

  common.tRender({
    elem: '#xy-equipment-manage'
    ,url: layui.setter.api.GetEquipmentList
    ,where: {
      "UNIT_ID": common.user.UNIT_ID
    }
    ,cols: [[
      {field: 'EQUIPMENT_NO', title: '设备编号'}
      ,{field: 'EQUIPMENT_TYPE_NAME', title: '设备类型'}
      ,{field: 'UNIT_NAME', title: '所属机构'}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-equipment'}
    ]]
  });
  
  //监听工具条
  table.on('tool(xy-equipment-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        common.req({
          url: layui.setter.api.DeleteEquipment
          ,data: {EQUIPMENT_NO: obj.data.EQUIPMENT_NO}
          ,success: function(data){
            obj.del();
            layer.close(index);
          }
        });
      });
    }
  });

  exports('equipment', {init: init})
});