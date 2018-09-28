layui.define(['table', 'form', 'common', 'laytpl'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,laytpl = layui.laytpl
  ,router = layui.router();

  var init = {
    list: function() {
      common.xyRender({
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
          layer.confirm('确定要注销吗', function(index){
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
    }
    ,data: function() {
      common.xyRender({
        elem: '#xy-equipment-data'
        ,url: layui.setter.api.GetEquipmentData
        ,where: {
          "EQUIPMENT_NO": router.search.EQUIPMENT_NO
          ,USED: 2
        }
        ,cols: [[
          {field: 'RECEIVE_TIME', title: '接收时间'}
          ,{field: 'CHINESE_NAME', title: '项目名称'}
          ,{field: 'RECEIVE_DATA', title: '接收数据'}
          ,{field: 'UNIT_NAME', title: '单位'}
          ,{field: 'ABNORMAL', title: '异常'}
          ,{field: 'STANDARD_RANGE', title: '参考范围',templet: function(d){
            if (d.STANDARD_MAX_VALUE) {
              return d.STANDARD_MIX_VALUE + ' - ' + d.STANDARD_MAX_VALUE;
            } else {
              return d.STANDARD_MIX_VALUE;
            }
          }}
        ]]
        ,done: function(){
          common.rowspan('RECEIVE_TIME', 1);
        }
      });
    }
    ,edit: function() {
      if (router.search.EQUIPMENT_NO) {
        common.req({
          url: layui.setter.api.GetEquipmentInfo
          ,data: {
            EQUIPMENT_NO: router.search.EQUIPMENT_NO
          }
          ,success: $.proxy(function(equipmentData){
            form.val('xy-equipment-form', equipmentData.data);
            equipmentData.data.edit = 1;
            laytpl(equipmentEditTpl.innerHTML).render(equipmentData.data, function(html){
              $('#equipmentId').after(html);
            });
            // common.req({
            //   url: layui.setter.api.GetEquipmentType
            //   ,data: {}
            //   ,success: $.proxy(function(data){
            //     if (data.data.length > 0) {
            //       var html = '<option value="">请选择</option>';
            //       for (i = 0; i < data.data.length; i++) {
            //         var selected = '';
            //         if (equipmentData.data.EQUIPMENT_TYPE_ID == data.data[i].ID) {
            //           selected = ' selected';
            //         }
            //         html += '<option value="' + data.data[i].ID + '"' + selected + '>' + data.data[i].EQUIPMENT_TYPE_NAME + '</option>';
            //       }
            //       $('#EQUIPMENT_TYPE_ID').html(html);
            //     }
            //     form.render('select');
            //   }, this)
            // });
          }, this)
        });
      } else {
        laytpl(equipmentEditTpl.innerHTML).render({edit:0}, function(html){
          $('#equipmentId').after(html);
        });
        common.req({
          url: layui.setter.api.GetEquipmentType
          ,data: {}
          ,success: $.proxy(function(data){
            if (data.data.length > 0) {
              var html = '<option value="">请选择</option>';
              for (i = 0; i < data.data.length; i++) {
                html += '<option value="' + data.data[i].ID + '">' + data.data[i].EQUIPMENT_TYPE_NAME + '</option>';
              }
              $('#EQUIPMENT_TYPE_ID').html(html);
            }
            form.render('select');
          }, this)
        });
      }
    }
  }

  form.on('submit(xy-equipment-submit)', function(data){
    delete data.field.UNIT_NAME;
    if (data.field.ID == 0) {
      common.req({
        url: layui.setter.api.RegisterEquipment
        ,formerror: true
        ,data: data.field
        ,success: function(data){
          layer.msg('操作成功', function() {
            common.saveSuccess('equipment/list.html');
          });
        }
      });
    } else {
      common.req({
        url: layui.setter.api.ModifyEquipment
        ,formerror: true
        ,data: data.field
        ,success: function(data){
          layer.msg('操作成功', function() {
            common.saveSuccess('equipment/list.html');
          });
        }
      });
    }
    return false;
  });

  //监听搜索
  form.on('submit(xy-equipment-search)', function(data){
    var field = data.field;
    
    //执行重载
    common.xyReload('xy-equipment-manage', {
      // url:'',
      where: field
    });
  });

  exports('equipment', {init: init})
});