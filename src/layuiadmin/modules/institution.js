layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,router = layui.router();

  var init = {
    edit: function() {
      common.req({
        url: layui.setter.api.GetHospitalUnit
        ,data: {
          HOSPITAL_ID: router.search.id
          ,GET_TYPE: 0
        }
        ,success: $.proxy(function(data){
          form.val('xy-institution-form', data.data);
          common.initConfig();
          common.initArea('#ins_area_code');
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

  form.on('submit(xy-institution-submit)', function(data){
    common.req({
      url: layui.setter.api.ModificationHospitalUnit
      ,formerror: true
      ,data: data.field
      ,success: function(data){
        
      }
    });
    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });

  //机构管理
  common.tRender({
    elem: '#xy-institution-manage'
    ,url: layui.setter.api.GetHospitalUnit
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,method: 'post'
    ,contentType: 'application/json'
    ,where: {
      "HOSPITAL_ID": common.user.UNIT_ID,
      "GET_TYPE": 1
    }
    ,request: {
      pageName: 'PAGE_NO'
      ,limitName: 'PAGE_SIZE'
    }
    ,response: {
      statusName: 'status'
      ,statusCode: 1
      ,countName: 'message'
    }
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'UNIT_NAME', title: '单位名称',templet: function(d){
        var indent = 10;
        var n = d.LEVEL_NUMBER;
        return '<span style="margin-left:' + (indent * n) + 'px;">' + d.UNIT_NAME + '</span>';
      }}
      ,{field: 'aa', title: '所属区域'}
      ,{field: 'UNIT_TYPE_NAME', title: '单位类型'}
      ,{field: 'UNIT_LEVEL_NAME', title: '单位级别'}
      ,{field: 'UNIT_STATUS_NAME', title: '单位状态'}
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
        common.req({
          url: layui.setter.api.DeleteHospitalUnit
          ,data: {HOSPITAL_ID: obj.data.ID}
          ,success: function(data){
            obj.del();
            layer.close(index);
          }
        });
      });
    }
  });

  exports('institution', {init: init})
});