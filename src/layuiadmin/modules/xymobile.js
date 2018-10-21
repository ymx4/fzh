layui.define(['common', 'laytpl', 'element', 'flow', 'form'], function(exports){
  var $ = layui.$
  ,common = layui.common
  ,element = layui.element
  ,laytpl = layui.laytpl
  ,flow = layui.flow
  ,form = layui.form
  ,router = layui.router();

  var pageSize = 10;

  var renderResident = function(page, next) {
    var where = {
      "KEY_WORD" : "",
      "UNIT_ID": common.user.UNIT_ID,
      // "CHILDREN_UNIT": 0,
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
      ,disableLoad: true
      ,success: function(data){
        laytpl(clientTpl.innerHTML).render({
          clientList: data.data,
          detailUrl: layui.setter.baseUrl + 'resident/detail.html',
          equipmentUrl: layui.setter.baseUrl + 'mobile/equipment.html',
          addArrangeUrl: layui.setter.baseUrl + 'arrange/edit.html'
        }, function(html){
          next(html, data.message > pageSize * page);
        });
      }
    });
  }

  var renderArrange = function(page, next) {
    var where = {
      "PAGE_NO": page,
      "PAGE_SIZE": pageSize
    }
    if ($('#arrangeTab .layui-this').data('tab') == 2) {
      where.STATUS = 1;
    } else {
      where.STATUS = 0;
    }

    common.req({
      url: layui.setter.api.SearchArrange
      ,data: where
      ,disableLoad: true
      ,success: function(data){
        laytpl(arrangeTpl.innerHTML).render({
          arrangeList: data.data,
          editUrl: layui.setter.baseUrl + 'arrange/edit.html',
          detailUrl: layui.setter.baseUrl + 'arrange/detail.html',
        }, function(html){
          next(html, data.message > pageSize * page);
        });
      }
    });
  }

  var init = {
    clientList: function() {
      element.on('tab(clientSwitch)', function(data){
        $('#clientContainer').html('');
        flow.load({
          elem: '#clientContainer'
          ,done: function(page, next) {
            renderResident(page, next);
          }
        });
      });

      flow.load({
        elem: '#clientContainer'
        ,done: function(page, next) {
          renderResident(page, next);
        }
      });
    }
    ,arrangeList: function() {
      element.on('tab(arrangeSwitch)', function(data){
        $('#arrangeContainer').html('');
        flow.load({
          elem: '#arrangeContainer'
          ,done: function(page, next) {
            renderArrange(page, next);
          }
        });
      });

      flow.load({
        elem: '#arrangeContainer'
        ,done: function(page, next) {
          renderArrange(page, next);
        }
      });
    }
    ,equipment: function() {
      common.req({
        url: layui.setter.api.GetClientInfo
        ,data: {
          CLIENT_ID: router.search.id
        }
        ,success: $.proxy(function(data){
          laytpl(xy_equipment_detail.innerHTML).render(data.data, function(html){
            document.getElementById('xy_equipment_view').innerHTML = html;
          });
        })
      });

      form.on('submit(xy-equipment-submit)', function(data){
        alert('submit')
        // common.req({
        //   url: layui.setter.api.
        //   ,formerror: true
        //   ,data: data.field
        //   ,success: function(data){
        //     layer.msg('操作成功', function() {
        //     });
        //   }
        // });
        return false;
      });
    }
    ,myProfile: function() {
      laytpl(xy_profile_detail.innerHTML).render(common.user, function(html){
        document.getElementById('xy_profile_view').innerHTML = html;
      });
    }
  };

  exports('xymobile', {init: init})
});