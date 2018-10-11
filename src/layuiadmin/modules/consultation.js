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
      } else {
        layer.msg('参数错误');
        return;
      }
      common.xyRender({
        elem: '#xy-consultation-manage'
        ,url: layui.setter.api.SearchConsultation
        ,where: where
        ,cols: [[
          {field: 'CONSULTATION_NO', title: '编号', event:'detail'}
          ,{field: 'CLIENT_REAL_NAME', title: '姓名', event:'detail'}
          ,{field: 'DIAGNOSE_UNIT_NAME', title: '就诊单位', event:'detail'}
          ,{field: 'CONSULTATION_UNIT_NAME', title: '会诊单位', event:'detail'}
          ,{field: 'STATUS_NAME', title: '状态', event:'detail'}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-consultation'}
        ]]
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
        if (data.field.STATUS == '1') {
          layer.confirm('确认会诊已完成吗？完成后不可修改', function(index){
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
          });
        } else {
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
        }
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
