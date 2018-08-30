layui.define(['table', 'form', 'common', 'laydate'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,laydate = layui.laydate
  ,router = layui.router();

  var init = {
    edit: function() {
      if (router.search.id) {
        common.req({
          url: layui.setter.api.GetUserInfo
          ,data: {
            ID: router.search.id
          }
          ,success: $.proxy(function(data){
            form.val('xy-institution-form', data.data);
        laydate.render({
          elem: '#BIRTHDAY'
          ,value: '2018-08-18'
        });
            $('select[name="UNIT_LEVEL"]').attr('data-val', data.data.UNIT_LEVEL);
            $('select[name="UNIT_TYPE"]').attr('data-val', data.data.UNIT_TYPE);
            $('select[name="UNIT_STATUS"]').attr('data-val', data.data.UNIT_STATUS);
            common.initConfig();
            common.initArea('#ins_area_id');
          }, this)
        });
      } else {
        laydate.render({
          elem: '#BIRTHDAY'
        });
        common.initConfig();
      }
    }
  }

  form.on('submit(xy-doctor-submit)', function(data){
    common.req({
      url: layui.setter.api.ModifyUserInfo
      ,formerror: true
      ,data: data.field
      ,success: function(data){
        layer.msg('操作成功', function() {
          common.saveSuccess('doctor/list.html', '医生管理');
        });
      }
    });
    return false;
  });

  //监听搜索
  form.on('submit(xy-doctor-search)', function(data){
    var field = data.field;
    if (data.field.GROUP_ID == '') {
      data.field.GROUP_ID = 0;
    }
    
    //执行重载
    table.reload('xy-doctor-manage', {
      // url:'',
      where: field
    });
  });

  common.tRender({
    elem: '#xy-doctor-manage'
    ,url: layui.setter.api.GetUserList
    ,where: {
      "KEY_WORD" : "",
      "UNIT_ID": common.user.UNIT_ID,
      "GROUP_ID": 0,
      "FAMILY_DOCTOR": 0,
      "SPECIALIST": 0
    }
    ,cols: [[
      {field: 'ID', title: '医生编号'}
      ,{field: 'REAL_NAME', title: '医生姓名'}
      ,{field: 'USER_NAME', title: '登录名'}
      ,{field: 'USER_STATUS', title: '账号状态'}
      ,{field: 'ROLE', title: '医生角色',templet: function(d){
        var r = '';
        if (d.FAMILY_DOCTOR == 1) {
          r += ' 家庭医生';
        }
        if (d.FAMILY_DOCTOR == 1) {
          r += ' 专科医生';
        }
        return $.trim(r);
      }}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-doctor'}
    ]]
  });
  
  //监听工具条
  table.on('tool(xy-doctor-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        common.req({
          url: layui.setter.api.DeleteUser
          ,data: {ID: obj.data.ID}
          ,success: function(data){
            obj.del();
            layer.close(index);
          }
        });
      });
    }
  });

  exports('doctor', {init: init})
});