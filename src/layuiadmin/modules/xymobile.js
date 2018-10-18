layui.define(['common', 'laytpl', 'element', 'flow'], function(exports){
  var $ = layui.$
  ,common = layui.common
  ,element = layui.element
  ,laytpl = layui.laytpl
  ,flow = layui.flow
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
      ,success: function(data){
        laytpl(clientTpl.innerHTML).render({clientList: data.data}, function(html){
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
    ,clientDetail: function() {
      layer.load(0, {time: layui.setter.loadsec});
      common.req({
        url: layui.setter.api.GetClientInfo
        ,data: {
          CLIENT_ID: router.search.id
        }
        ,success: $.proxy(function(data){
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_resident_detail.innerHTML).render(data.data, function(html){
            document.getElementById('xy_resident_view').innerHTML = html;
            if (data.data.FACE_FILE_NAME) {
              $('#xy-resident-avatar-img').attr('src', common.getImageUrl(data.data.FACE_FILE_NAME));
            }
            if (data.data.ID_NUMBER_FILE_NAME) {
              $('#xy-resident-identity-img').attr('src', common.getImageUrl(data.data.ID_NUMBER_FILE_NAME));
            }
            previewImg();
          });
        }, this)
      });
    }
    ,myProfile: function() {
      laytpl(xy_profile_detail.innerHTML).render(common.user, function(html){
        document.getElementById('xy_profile_view').innerHTML = html;
      });
    }
  };

  var previewImg = function(){
    $('#xy-resident-avatar-img,#xy-resident-identity-img').click(function() {
      var src = $(this).attr('src');
      if (!common.empty(src)) {
        layer.photos({
          photos: {
            "title": "预览",
            "data": [
              {
                "alt": "预览",
                "src": src
              }
            ]
          }
          ,anim: 5
        });
      }
    });
  }

  exports('xymobile', {init: init})
});