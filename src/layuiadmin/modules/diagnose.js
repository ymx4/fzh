layui.define(['table', 'form', 'common', 'laydate', 'laytpl'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,laydate = layui.laydate
  ,laytpl = layui.laytpl
  ,router = layui.router();
  
  $('.xy-date').each(function(){
    laydate.render({
      elem: this
      ,trigger: 'click'
    });
  });

  var init = {
    list: function() {
      var where = {
        // CLIENT_ID: 0,
        // UNIT_ID: 0,
        // CHILDREN_UNIT: 1,
        // USER_ID: 0,
        // START_TIME: '',
        // END_TIME: '',
        // START_REVIEW_DATE: '',
        // END_REVIEW_DATE: '',
      };
      if (router.search.t == 'completed') {
      } else if (router.search.t == 'revisit') {

      } else {
        //未完成
      }
      // form.val('xy-diagnose-search-form', {UNIT_ID: common.user.UNIT_ID, UNIT_NAME: common.user.UNIT_NAME});
      common.xyRender({
        elem: '#xy-diagnose-manage'
        ,url: layui.setter.api.SearchDiagnose
        ,where: where
        ,cols: [[
          {field: 'username', title: '就诊编号'}
          ,{field: 'username', title: '就诊时间'}
          ,{field: 'username', title: '患者姓名'}
          ,{field: 'username', title: '就诊医生'}
          ,{field: 'username', title: '状态'}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-diagnose'}
        ]]
      });

      //监听搜索
      form.on('submit(xy-diagnose-search)', function(data){
        var field = data.field;
        // delete field.UNIT_NAME;
        // if (data.field.GROUP_ID == '') {
        //   field.GROUP_ID = 0;
        // }
        // field.ALL_UNIT = field.ALL_UNIT || 0;
        // field.SPECIALIST = field.SPECIALIST || 0;
        // field.FAMILY_diagnose = field.FAMILY_diagnose || 0;
        //执行重载
        common.xyReload('xy-diagnose-manage', {
          where: field
        });
      });
      
      //监听工具条
      table.on('tool(xy-diagnose-manage)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
          layer.confirm('确定要删除吗', function(index){
            common.req({
              url: layui.setter.api.DeleteDiagnose
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
      } else {
        // common.req({
        //   url: layui.setter.api.GetDiagnoseNO
        //   ,data: {}
        //   ,success: $.proxy(function(data) {
        //     // var topLayui = top.layui;
        //     // var index = topLayui.admin.tabsPage.index;
        //     // topLayui.index.openTabsPage('health/edit.html#/id=' + data.message + '/clientId=' + router.search.clientId, '公共卫生-' + decodeURIComponent(router.search.REAL_NAME));
        //     // topLayui.common.closeTab(index);
        //   }, this)
        // });
        // return;
      }
      common.req({
        url: layui.setter.api.GetDiagnoseInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          form.val('xy-diagnose-form', data.data);
          laydate.render({
            elem: '#BIRTHDAY'
            ,format: layui.setter.dateFormat.day
            ,value: data.data.BIRTHDAY ? data.data.BIRTHDAY.substring(0, 10) : ''
          });
          // $('select[name="SEX"]').attr('data-val', data.data.SEX);
          // $('select[name="STATUS"]').attr('data-val', data.data.STATUS);
          // $('select[name="GROUP_ID"]').attr('data-val', data.data.GROUP_ID);
          // common.initConfig();
        }, this)
      });

      form.on('submit(xy-diagnose-submit)', function(data){

        common.req({
          url: layui.setter.api.ModifyDiagnose
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
            });
          }
        });
        return false;
      });
    }
  }

  exports('diagnose', {init: init})
});