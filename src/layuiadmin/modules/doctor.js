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
        laydate.render({
          elem: '#BIRTHDAY'
          ,value: '2018-08-18'
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
      url: layui.setter.api.GetLoginUser
      ,formerror: true
      ,data: data.field
      ,success: function(data){
        
      }
    });
    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });

  //监听搜索
  form.on('submit(xy-doctor-search)', function(data){
    var field = data.field;
    
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