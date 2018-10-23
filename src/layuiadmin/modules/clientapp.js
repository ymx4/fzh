layui.define(['layer', 'form', 'admin', 'laytpl', 'flow'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,form = layui.form
  ,admin = layui.admin
  ,laytpl = layui.laytpl
  ,flow = layui.flow
  ,router = layui.router()

  ,clientapp = {
    user: {}
    ,empty: function(value) {
      if (value && value != '') {
        return false;
      } else {
        return true;
      }
    }
    ,closeParent: function() {
      var index = parent.layer.getFrameIndex(window.name);
      parent.layer.close(index);
    }
    ,req: function(options){
      var success = options.success;
      
      var formerror = options.formerror || false;
      var disableLoad = options.disableLoad || false;

      options.data = options.data || {};
      var params = JSON.stringify(options.data);
      if (params != '{}') {
        var flag = false;
        for (var ii in options.data) {
          if (/[a-z]/.test(ii.charAt(0))) {
            flag = true;
            delete options.data[ii];
          }
        }
        if (flag) {
          params = JSON.stringify(options.data);
        }
      }
      options.data = params;
      
      if(this.user && this.user.token){
        //自动给参数传入默认 token
        options.url = options.url + '?token=' + this.user.token;
      }

      delete options.success;
      delete options.disableLoad;

      if (!disableLoad) {
        layer.load(0, {time: layui.setter.loadsec});
      }

      return $.ajax($.extend({
        type: 'post'
        ,dataType: 'json'
        ,success: function(res){
          layer.closeAll('loading');
          if (res.status == 1 && typeof success === 'function') {
            success(res);
          } else if (res.errorCode == 4006) {
            layer.confirm('登录超时，请重新登录', {btn: ['去登录', '取消']}, function(){
              top.location.href = layui.setter.baseUrl + loginPath;
            });
          } else {
            if (formerror) {
              res.message = res.message.replace(/(^\|)|(\|$)/g, '');
              res.message = res.message.split('|').join('<br>');
            }
            layer.msg(res.message);
          }
        }
      }, options));
    }

    ,init: {
      messageList: function() {
        flow.load({
          elem: '#messageContainer'
          ,done: function(page, next) {
            var where = {
            }
            
            laytpl(messageTpl.innerHTML).render({
              messageList: {}
            }, function(html){
              next(html, true);
            });
          }
        });
      }
    }
  };

  var loginPath = 'clientapp/login.html';
  if (location.href.indexOf('login') != -1) {
    loginPath += '#/redirect=' + encodeURIComponent(location.href);
    var sess = layui.data(layui.setter.tableName);
    if (!sess.user) {
      location.href = layui.setter.baseUrl + loginPath;
    } else {
      clientapp.user = sess.user;
    }
  }

  admin.events.xyrefresh = function(){
    location.reload();
  }

  admin.events.xyback = function(){
    history.back();
  }

  exports('clientapp', clientapp);
});