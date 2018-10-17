layui.define(['common', 'laytpl', 'laypage', 'element'], function(exports){
  var $ = layui.$
  ,common = layui.common
  ,laypage = layui.laypage
  ,element = layui.element
  ,laytpl = layui.laytpl;

  var pageSize = 2;

  var renderResident = function(page) {
    var where = {
      "KEY_WORD" : "",
      "UNIT_ID": common.user.UNIT_ID,
      "CHILDREN_UNIT": 0,
      "PAGE_NO": page,
      "PAGE_SIZE": pageSize
    }
    if ($('#clientTab .layui-this').data('tab') == 2) {
      where.USER_ID = -2;
    } else {
      where.USER_ID = common.user.ID;
    }

    common.req({
      url: layui.setter.api.SearchClient
      ,data: where
      ,success: function(data){
        laytpl(clientTpl.innerHTML).render({clientList: data.data}, function(html){
          $('#clientContainer').html(html);
        });
        laypage.render({
          elem: 'clientPage'
          ,count: data.message
          ,limit: pageSize
          ,curr: page
          ,jump: function(obj, first){
            if (!first) {
              renderResident(obj.curr);
            }
          }
        });
      }
    });
  }

  var init = {
    clientList: function() {
      renderResident(1);

      element.on('tab(clientSwitch)', function(data){
        renderResident(1);
      });
    }
  };

  exports('xymobile', {init: init})
});