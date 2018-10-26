layui.define(['table', 'form', 'common', 'laydate', 'laytpl'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,laydate = layui.laydate
  ,laytpl = layui.laytpl
  ,router = layui.router();

  var consultationIndex;

  var init = {
    list: function() {
      $('.xy-date').each(function(){
        laydate.render({
          elem: this
          ,format: layui.setter.dateFormat.sec
          ,type: 'datetime'
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
      if (router.search.t == 'uncompleted') {
        where.NEED_REVIEW = -1;
        where.STATAUS = 0;
      } else if (router.search.t == 'completed') {
        where.NEED_REVIEW = -1;
        where.STATAUS = 1;
      } else if (router.search.t == 'revisit') {
        where.NEED_REVIEW = 1;
        where.STATAUS = -1;
      } else {
        layer.msg('参数错误');
        return;
      }
      form.val('xy-diagnose-search-form', {UNIT_ID: common.user.UNIT_ID, UNIT_NAME: common.user.UNIT_NAME});
      common.xyRender({
        elem: '#xy-diagnose-manage'
        ,url: layui.setter.api.SearchDiagnose
        ,where: where
        ,cols: [[
          {field: 'DIAGNOSE_NO', title: '就诊编号', event:'detail'}
          ,{field: 'DIAGNOSE_DATE', title: '就诊时间', event:'detail'}
          ,{field: 'CLIENT_REAL_NAME', title: '患者姓名', event:'detail'}
          ,{field: 'DOCTOR_REAL_NAME', title: '就诊医生', event:'detail'}
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
        } else if (obj.event === 'detail') {
          parent.layui.index.openTabsPage('diagnose/detail.html#/id=' + obj.data.ID, '就诊-' + obj.data.CLIENT_REAL_NAME);
        } else if (obj.event === 'consultation') {
          common.req({
            url: layui.setter.api.HospitalGetParent
            ,formerror: true
            ,data: {}
            ,success: function(data){
              consultationIndex = layer.open({
                type: 1,
                area:['80%', 'auto'],
                content: laytpl(consolusionCause.innerHTML).render({ID: obj.data.ID, UNIT_NAME: data.data.PARENT_UNIT_NAME}),
                title: '申请会诊'
              });
            }
          });
        }
      });

      form.on('submit(xy-consolusion-submit)', function(data){
        $('#xyAddConsolusion' + data.field.DIAGNOSE_ID).remove();
        common.req({
          url: layui.setter.api.ModifyConsultation
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
              layer.close(consultationIndex);
            });
          }
        });
        return false;
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
            common.clientData('xyClientData', data.data.CLIENT_ID);
            form.val('xy-diagnose-form', data.data);
            if (data.data.NEED_REVIEW) {
              $(':input[name="REVIEW_DATE"]').removeClass('layui-hide');
            }
            laydate.render({
              elem: '#REVIEW_DATE'
              ,format: layui.setter.dateFormat.sec
              ,type: 'datetime'
            });
            $('#DOCTOR_REAL_NAME').text(data.data.DOCTOR_REAL_NAME);
            $('#UNIT_NAME').text(data.data.UNIT_NAME);
            $('#SHOW_DIAGNOSE_NO').text(data.data.DIAGNOSE_NO);
          }, this)
        });
      } else {
        common.clientData('xyClientData', router.search.CLIENT_ID);
        common.req({
          url: layui.setter.api.GetDiagnoseNO
          ,data: {}
          ,success: function(data) {
            diagnoseNo = data.message;
            $('#DOCTOR_REAL_NAME').text(common.user.REAL_NAME);
            $('#UNIT_NAME').text(common.user.UNIT_NAME);
            $('#SHOW_DIAGNOSE_NO').text(diagnoseNo);
            $('#DIAGNOSE_NO').val(diagnoseNo);
            $(':input[name="CLIENT_ID"]').val(router.search.CLIENT_ID);
            laydate.render({
              elem: '#REVIEW_DATE'
              ,format: layui.setter.dateFormat.sec
              ,type: 'datetime'
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
    ,detail: function() {
      common.req({
        url: layui.setter.api.GetDiagnoseInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          common.clientData('xyClientData', data.data.CLIENT_ID);
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_diagnose_detail.innerHTML).render(data.data, function(html){
            document.getElementById('xy_diagnose_detail_container').innerHTML = html;
          });
        }, this)
      });
    }
  }

  exports('diagnose', {init: init})
});