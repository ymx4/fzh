layui.define(['table', 'form', 'common', 'laydate', 'laytpl'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,laydate = layui.laydate
  ,laytpl = layui.laytpl
  ,router = layui.router();

  var init = {
    list: function() {
      form.val('xy-doctor-search-form', {UNIT_ID: common.user.UNIT_ID, UNIT_NAME: common.user.UNIT_NAME});
      common.xyRender({
        elem: '#xy-doctor-manage'
        ,url: layui.setter.api.GetUserList
        ,where: {
          "KEY_WORD" : "",
          "UNIT_ID": common.user.UNIT_ID,
          "ALL_UNIT": 0,
          "GROUP_ID": 0,
          "FAMILY_DOCTOR": 0,
          "SPECIALIST": 0
        }
        ,cols: [[
          {field: 'REAL_NAME', title: '医生姓名'}
          ,{field: 'USER_NAME', title: '登录名'}
          ,{field: 'USER_STATUS', title: '账号状态'}
          ,{field: 'ROLE', title: '医生角色',templet: function(d){
            var r = '';
            if (d.FAMILY_DOCTOR == 1) {
              r += ' 家庭医生';
            }
            if (d.SPECIALIST == 1) {
              r += ' 专科医生';
            }
            return $.trim(r);
          }}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-doctor'}
        ]]
      });

      //监听搜索
      form.on('submit(xy-doctor-search)', function(data){
        var field = data.field;
        delete field.UNIT_NAME;
        if (data.field.GROUP_ID == '') {
          field.GROUP_ID = 0;
        }
        field.ALL_UNIT = field.ALL_UNIT || 0;
        field.SPECIALIST = field.SPECIALIST || 0;
        field.FAMILY_DOCTOR = field.FAMILY_DOCTOR || 0;
        //执行重载
        common.xyReload('xy-doctor-manage', {
          where: field
        });
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
    }
    ,edit: function() {
      if (router.search.id) {
        laytpl(doctorPwd.innerHTML).render({edit:1}, function(html){
          $('#doctor-pwd-container').html(html);
        });
        common.req({
          url: layui.setter.api.GetUserInfo
          ,data: {
            ID: router.search.id
          }
          ,success: $.proxy(function(data){
            form.val('xy-doctor-form', data.data);
            laydate.render({
              elem: '#BIRTHDAY'
              ,format: layui.setter.dateFormat.day
              ,value: data.data.BIRTHDAY ? data.data.BIRTHDAY.substring(0, 10) : ''
            });
            $('select[name="SEX"]').attr('data-val', data.data.SEX);
            $('select[name="STATUS"]').attr('data-val', data.data.STATUS);
            $('select[name="GROUP_ID"]').attr('data-val', data.data.GROUP_ID);
            common.initConfig();
          }, this)
        });
      } else {
        laytpl(doctorPwd.innerHTML).render({edit:0}, function(html){
          $('#doctor-pwd-container').html(html);
        });
        laydate.render({
          elem: '#BIRTHDAY'
          ,format: layui.setter.dateFormat.day
        });
        common.initConfig();
      }
    }
  }

  form.on('submit(xy-doctor-submit)', function(data){
    data.field.SPECIALIST = data.field.SPECIALIST || 0;
    data.field.FAMILY_DOCTOR = data.field.FAMILY_DOCTOR || 0;

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

  exports('doctor', {init: init})
});