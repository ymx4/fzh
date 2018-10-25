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
      arrangeStatus = router.search.st || 0;
      if (arrangeStatus == 0) {
        var cols = [
          {field: 'PLAN_TIME', title: '计划时间', event:'detail'}
          ,{field: 'CLIENT_REAL_NAME', title: '姓名', event:'detail'}
          ,{field: 'ARRANAGE_TYPE_NAME', title: '随访类型', event:'detail'}
          ,{field: 'USER_REAL_NAME', title: '医生', event:'detail'}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-arrange'}
        ];
      } else {
        var cols = [
          {field: 'ARRANGE_TIME', title: '随访时间'}
          ,{field: 'CLIENT_REAL_NAME', title: '姓名'}
          ,{field: 'ARRANAGE_TYPE_NAME', title: '随访类型'}
          ,{field: 'USER_REAL_NAME', title: '医生'}
        ];
      }
      common.xyRender({
        elem: '#xy-arrange-manage'
        ,url: layui.setter.api.SearchArrange
        ,where: {
          "STATUS" : arrangeStatus
        }
        ,cols: [cols]
      });

      //监听搜索
      form.on('submit(xy-arrange-search)', function(data){
        var field = data.field;
        //执行重载
        common.xyReload('xy-arrange-manage', {
          where: field
        });
      });
      
      //监听工具条
      table.on('tool(xy-arrange-manage)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
          layer.confirm('确定要删除吗', function(index){
            common.req({
              url: layui.setter.api.DeleteArrange
              ,data: {ID: obj.data.ID}
              ,success: function(data){
                obj.del();
                layer.close(index);
              }
            });
          });
        } else if (obj.event === 'detail') {
          parent.layui.index.openTabsPage('arrange/detail.html#/id=' + obj.data.ID, '随访-' + obj.data.CLIENT_REAL_NAME);
        }
      });
    }
    ,edit: function() {
      if (router.search.id) {
        common.req({
          url: layui.setter.api.GetArrangeInfo
          ,data: {
            ID: router.search.id
          }
          ,success: $.proxy(function(data){
            form.val('xy-arrange-form', data.data);
            laydate.render({
              elem: '#PLAN_TIME'
              ,format: layui.setter.dateFormat.sec
              ,type: 'datetime'
              ,value: data.data.PLAN_TIME ? data.data.PLAN_TIME : ''
            });
            $('select[name="ARRANGE_TYPE"]').attr('data-val', data.data.ARRANGE_TYPE);
            common.initConfig();
          }, this)
        });
      } else {
        laydate.render({
          elem: '#PLAN_TIME'
          ,format: layui.setter.dateFormat.sec
          ,type: 'datetime'
        });
        form.val('xy-arrange-form', {CLIENT_ID: router.search.CLIENT_ID});
        common.initConfig();
      }

      form.on('submit(xy-arrange-submit)', function(data){
        common.req({
          url: layui.setter.api.ModifyArrange
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
              if (router.search.adapter == 'm') {
                common.closeParent();
              } else {
                common.closeSelf();
              }
            });
          }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
    }
    ,detail: function() {
      common.req({
        url: layui.setter.api.GetArrangeInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          common.clientData('xyClientData', data.data.CLIENT_ID, router.search.adapter);
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_arrange_form.innerHTML).render(data.data, function(html) {
            document.getElementById('xy_arrange_container').innerHTML = html;
          });
        }, this)
      });
    }
  }

  exports('arrange', {init: init})
});