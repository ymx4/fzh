layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,router = layui.router();

  var init = {
    list: function() {
      common.xyRender({
        elem: '#xy-message-manage'
        ,url: layui.setter.api.ReadMessage
        ,where: {READ_STATE: 2}
        ,cols: [[
          {field: 'SEND_REAL_NAME', title: '发件人'}
          ,{field: 'RECEIVE_REAL_NAME', title: '收件人'}
          ,{field: 'MESSAGE', title: '内容'}
          ,{field: 'SEND_TIME', title: '时间'}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-message'}
        ]]
      });
    }
    ,send: function() {console.log(router.search)
      if (router.search.CLIENT_ID && router.search.CLIENT_NAME) {
        $('#RECEIVE_USER_ID').val(router.search.CLIENT_ID);
        $('#RECEIVE_USER').text(decodeURIComponent(router.search.CLIENT_NAME));
        form.on('submit(xy-message-submit)', function(data){
          common.req({
            url: layui.setter.api.SendMessage
            ,formerror: true
            ,data: data.field
            ,success: function(data){
              layer.msg('操作成功', function() {
                common.closeParent();
              });
            }
          });
          return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
      }
    }
  }

  exports('message', {init: init})
});