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
          ,format: layui.setter.dateFormat.sec
          ,type: 'datetime'
          ,trigger: 'click'
        });
      });
      var where = {
        KEY_WORD: ''
      };
      if (router.search.t == 'request') {
        where.STATUS = 0;
      } else if (router.search.t == 'completed') {
        where.STATUS = 9;
      } else if (router.search.s == 't') {
        where.STATUS = 2;
      } else {
        layer.msg('参数错误');
        return;
      }
      if (router.search.c == 'f') {
        where.SearchType = 1;
      } else {
        where.SearchType = 2;
      }
      var cols = [
        {field: 'CONSULTATION_NO', title: '编号', event:'detail'}
        ,{field: 'CLIENT_REAL_NAME', title: '姓名', event:'detail'}
        ,{field: 'DIAGNOSE_UNIT_NAME', title: '就诊单位', event:'detail'}
        ,{field: 'CONSULTATION_UNIT_NAME', title: '会诊单位', event:'detail'}
        ,{field: 'STATUS_NAME', title: '状态', event:'detail',templet: function(d){
          if (d.CONSENT_TRANSFER != 0 && d.STATUS != 2) {
            return d.STATUS_NAME + ' , ' + d.CONSENT_TRANSFER_NAME;
          } else {
            return d.STATUS_NAME;
          }
        }}
      ];
      if (router.search.s != 't') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-consultation'});
      }
      common.xyRender({
        elem: '#xy-consultation-manage'
        ,url: layui.setter.api.GetConsultationList
        ,where: where
        ,cols: [cols]
        ,parseData: function(res){
          if (res.data && res.data.length) {
            $.each(res.data, function(i, item){
              res.data[i].xy_category = router.search.c;
            });
          }
          return res;
        }
      });

      //监听搜索
      form.on('submit(xy-consultation-search)', function(data){
        var field = data.field;
        //执行重载
        common.xyReload('xy-consultation-manage', {
          where: field
        });
      });
      
      //监听工具条
      table.on('tool(xy-consultation-manage)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
          layer.confirm('确定要删除吗', function(index){
            common.req({
              url: layui.setter.api.DeleteConsultation
              ,data: {ID: obj.data.ID}
              ,success: function(data){
                obj.del();
                layer.close(index);
              }
            });
          });
        } else if (obj.event === 'detail') {
          parent.layui.index.openTabsPage('consultation/detail.html#/id=' + obj.data.ID, '就诊-' + obj.data.CLIENT_REAL_NAME);
        } else if (obj.event === 'confirm') {
          common.req({
            url: layui.setter.api.SetTransfer
            ,data: {ID: obj.data.ID, STATUS: 2}
            ,success: function(data){
              $('#xyConfirmConsolusion' + obj.data.ID).remove();
            }
          });
        }
      });
    }
    ,edit: function() {
      common.req({
        url: layui.setter.api.GetConsultationInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_consultation_form.innerHTML).render(data.data, function(html){
            document.getElementById('xy_consultation_container').innerHTML = html;
            form.val('xy-consultation-form', data.data);
          });
        }, this)
      });

      form.on('submit(xy-consultation-submit)', function(data){
        if (data.field.CONSENT_TRANSFER == '0') {
          layer.msg('请选择是否同意转诊', {icon: 5, shift: 6});
          $('select[name="CONSENT_TRANSFER"]').addClass('layui-form-danger');
          return false;
        }
        data.field.STATUS = 1;
        common.req({
          url: layui.setter.api.ModifyConsultation
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
              common.closeSelf();
            });
          }
        });
        return false;
      });
    }
    ,detail: function() {
      common.req({
        url: layui.setter.api.GetConsultationInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_consultation_form.innerHTML).render(data.data, function(html) {
            document.getElementById('xy_consultation_container').innerHTML = html;
          });
        }, this)
      });
    }
  }

  exports('consultation', {init: init})
});
