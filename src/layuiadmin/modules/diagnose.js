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
      $('.xy-date').each(function(){
        laydate.render({
          elem: this
          ,format: layui.setter.dateFormat.day
          ,trigger: 'click'
        });
      });
      var where = {
        CLIENT_ID: 0,
        UNIT_ID: common.user.UNIT_ID,
        CHILDREN_UNIT: 1,
        USER_ID: 0,
        START_TIME: '',
        END_TIME: '',
        START_REVIEW_DATE: '',
        END_REVIEW_DATE: '',
      };
      if (router.search.t == 'completed') {
        where.NEED_REVIEW = -1;
        where.STATAUS = 1;
      } else if (router.search.t == 'revisit') {
        where.NEED_REVIEW = 1;
        where.STATAUS = -1;
      } else {
        //未完成
        where.NEED_REVIEW = -1;
        where.STATAUS = 0;
      }
      form.val('xy-diagnose-search-form', {UNIT_ID: common.user.UNIT_ID, UNIT_NAME: common.user.UNIT_NAME});
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
        delete field.UNIT_NAME;
        field.CHILDREN_UNIT = field.CHILDREN_UNIT || 0;
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
        common.req({
          url: layui.setter.api.GetDiagnoseInfo
          ,data: {
            ID: router.search.id
          }
          ,success: $.proxy(function(data){
            form.val('xy-diagnose-form', data.data);
            if (data.data.NEED_REVIEW) {
              $(':input[name="REVIEW_DATE"]').removeClass('layui-hide');
              laydate.render({
                elem: '#REVIEW_DATE'
                ,format: layui.setter.dateFormat.day
                ,value: data.data.REVIEW_DATE ? data.data.REVIEW_DATE.substring(0, 10) : ''
              });
            }
            $('#SHOW_DIAGNOSE_NO').text(data.data.DIAGNOSE_NO);
          }, this)
        });
      } else {
        common.req({
          url: layui.setter.api.GetDiagnoseNO
          ,data: {}
          ,success: function(data) {
            diagnoseNo = data.message;
            $('#SHOW_DIAGNOSE_NO').text(diagnoseNo);
            $('#DIAGNOSE_NO').val(diagnoseNo);
            $(':input[name="CLIENT_ID"]').val(router.search.CLIENT_ID);
            laydate.render({
              elem: '#REVIEW_DATE'
              ,format: layui.setter.dateFormat.day
            });
          }
        });
      }

      form.on('checkbox(xy-revisit)', function(data){
        if (data.elem.checked) {
          $(':input[name="REVIEW_DATE"]').removeClass('layui-hide');
        } else {
          $(':input[name="REVIEW_DATE"]').addClass('layui-hide').val('');
        }
      });

      form.on('submit(xy-diagnose-submit)', function(data){
        console.log(data.field.STATUS);
        if (data.field.STATUS == '1') {
          layer.confirm('确认就诊已完成吗？完成后不可修改', function(index){
            common.req({
              url: layui.setter.api.ModifyDiagnose
              ,formerror: true
              ,data: data.field
              ,success: function(data){
                layer.msg('操作成功', function() {
                  common.closeSelf();
                });
              }
            });
          });
        } else {
          common.req({
            url: layui.setter.api.ModifyDiagnose
            ,formerror: true
            ,data: data.field
            ,success: function(data){
              layer.msg('操作成功', function() {
                common.closeSelf();
              });
            }
          });
        }
        return false;
      });
    }
  }

  exports('diagnose', {init: init})
});