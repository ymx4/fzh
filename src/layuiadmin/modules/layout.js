layui.define(['common', 'laytpl', 'element'], function(exports){
  var $ = layui.$
  ,common = layui.common
  ,laytpl = layui.laytpl;

  var messageTimer = null;
  var refreshUnread = function() {
    common.req({
      url: layui.setter.api.UnreadMessage
      ,disableLoad: true
      ,data: {}
      ,success: function(data){
        if (data.message > 0) {
          $('#xyNewMsg').removeClass('layui-hide');
          clearInterval(messageTimer);
        } else {
          if (!$('#xyNewMsg').hasClass('layui-hide')) {
            $('#xyNewMsg').addClass('layui-hide')
          }
        }
      }
    });
  }

  $('#myRealname').text(common.user.REAL_NAME);
  $('#myUnitname').text(common.user.UNIT_NAME);
  refreshUnread();
  messageTimer = setInterval(function() {refreshUnread();}, layui.setter.unreadInterval);
  //管理员41，科室主任42，医生43：设备管理、机构管理，家庭医生：家庭医生、公共卫生

  laytpl(xySideMenu.innerHTML).render({user: common.user}, function(html){
    $('.layui-side-menu').html(html);
    layui.element.render();
  });

  $('.xy-logout').click(function() {
    common.req({
      url: layui.setter.api.UserLogOut
      ,success: function(data){
        //请求成功后，写入 access_token
        layui.data(layui.setter.tableName, null);
        
        //登入成功的提示与跳转
        layer.msg('登出成功', {
          offset: '15px'
          ,icon: 1
          ,time: 1000
        }, function(){
          location.href = layui.setter.baseUrl + 'passport/login.html';
        });
      }
    });
  });
  
  //对外暴露的接口
  exports('layout', {});
});