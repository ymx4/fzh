layui.define(['layer', 'form', 'admin', 'laytpl', 'table'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,form = layui.form
  ,admin = layui.admin
  ,laytpl = layui.laytpl
  ,table = layui.table
  ,router = layui.router()

  ,common = {
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
    ,getImageUrl: function (fn) {
      if(this.user && this.user.token){
        return layui.setter.api.ReadFile + '?FN=' + encodeURIComponent(fn) + '&token=' + this.user.token;
      } else {
        return layui.setter.api.ReadFile + '?FN=' + encodeURIComponent(fn);
      }
    }
    ,xyReload: function(filter, options){
      layer.load(0, {time: layui.setter.loadsec});
      table.reload(filter, $.extend({
        page: {
          curr: 1
        }
      }, options));
    }
    ,xyRender: function(options){
      if(this.user && this.user.token){
        //自动给参数传入默认 token
        options.url = options.url + '?token=' + this.user.token;
      }
      var that = this;
      var parseData = options.parseData;
      var disableLoad = options.disableLoad || false;

      delete options.parseData;
      delete options.disableLoad;

      if (!disableLoad) {
        layer.load(0, {time: layui.setter.loadsec});
      }

      return table.render($.extend({
        limit: layui.setter.pageSize
        ,cellMinWidth: 80
        ,method: 'post'
        ,contentType: 'application/json'
        ,request: {
          pageName: 'PAGE_NO'
          ,limitName: 'PAGE_SIZE'
        }
        ,response: {
          statusName: 'status'
          ,statusCode: 1
          ,countName: 'message'
        }
        ,parseData: function(res){
          layer.closeAll('loading');
          $('.layui-table-body').on('click', '.layui-table-grid-down', function(e) {
            layui.stope(e);
          });
          if (res.errorCode == 4006) {
            top.layer.confirm('登录超时，请重新登录', {btn: ['去登录', '取消'], shade: 1}, function(){
              top.location.href = layui.setter.baseUrl + loginPath;
            }, function(){
              top.location.href = layui.setter.baseUrl + loginPath;
            });
          } else {
            if (res.data && res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                Object.keys(res.data[i]).forEach(function(key){
                  if (res.data[i][key] == null) {
                    res.data[i][key] = '';
                  }
                });
              }
            }
            if (options.url.indexOf('GetClientHistory') != -1 && res.data && res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                Object.keys(res.data[i]).forEach(function(key){
                  if (key.indexOf('_TIME') != -1) {
                    res.data[i][key] = common.empty(res.data[i][key]) ? '' : res.data[i][key].replace(/00:00:00/, '');
                  }
                });
              }
            }
            if (typeof parseData === 'function') {
              parseData(res);
            }
          }
        }
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: {none: '暂无相关数据'}
      }, options));
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
            top.layer.confirm('登录超时，请重新登录', {btn: ['去登录', '取消'], shade: 1}, function(){
              top.location.href = layui.setter.baseUrl + loginPath;
            }, function(){
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
  };

  var activePage = function() {
    var activeTab = 'default';
    var pages = {
      equipment: ['equipment.html']
      ,doctor: ['doctor.html']
      ,message: ['message_list.html']
    };
    $.each(pages, function(key, keyitem){
      $.each(pages[key], function(i, item){
        if (location.href.indexOf(item) != -1) {
          activeTab = key;
          return false;
        }
      });
      if (activeTab != 'default') {
        return false;
      }
    });
    return activeTab;
  }

  var layout = function(){
    var activeTab = activePage();
    $.ajax({
      url: layui.setter.views + 'clientapp/layout' + layui.setter.engine
      ,type: 'get'
      ,dataType: 'html'
      ,data: {
        v: layui.cache.version
      }
      ,success: $.proxy(function(html){
        html = '<div>' + html + '</div>';
        var layoutElem = $(html).find('*[template]');
        $('.layui-body').before(laytpl(layoutElem.eq(0).html()).render({user: common.user}));
        $('.layui-body').after(laytpl(layoutElem.eq(1).html()).render({activeTab: activeTab}));
      }, this)
    });
  }

  var messageTimer = null;
  var refreshUnread = function() {
    common.req({
      url: layui.setter.api.Client.UnreadMessage
      ,disableLoad: true
      ,data: {}
      ,success: function(data){
        if (data.message > 0) {
          $('#xyNewMsg').addClass('layui-show');
          clearInterval(messageTimer);
        } else {
          if ($('#xyNewMsg').hasClass('layui-show')) {
            $('#xyNewMsg').removeClass('layui-show');
          }
        }
      }
    });
  }

  var loginPath = 'clientapp/login.html';
  if (location.href.indexOf('login') == -1 && location.href.indexOf('register') == -1) {
    loginPath += '#/redirect=' + encodeURIComponent(location.href);
    var sess = layui.data(layui.setter.clientSess);
    if (!sess.user) {
      location.href = layui.setter.baseUrl + loginPath;
    } else {
      common.user = sess.user;
      layout();
      if (location.href.indexOf('message_list.html') == -1) {
        refreshUnread();
        messageTimer = setInterval(function() {refreshUnread();}, layui.setter.unreadInterval);
      }
    }
  }

  admin.events.xyrefresh = function(){
    location.reload();
  }

  admin.events.xyback = function(){
    history.back();
  }

  admin.events.xytab = function(e){
    switch(e.attr('lay-type')) {
      case 'equipment':
        var ua = window.navigator.userAgent.toLowerCase();
        var redirectUrl = layui.setter.baseUrl + 'clientapp/equipment.html#/test=1';
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
          wx.miniProgram.navigateTo({url: '../../page/index/index?redirect=' + encodeURIComponent(redirectUrl)});
        } else {
          // android
          js2Android.showDataDetailsActivity('client', common.user.ID, common.user.REAL_NAME, layui.setter.api.Client.ReceiveClient34 + '?token=' + common.user.token);
        }
        break;
      case 'doctor':
        location.href = layui.setter.baseUrl + 'clientapp/doctor.html';
        break;
      case 'message':
        location.href = layui.setter.baseUrl + 'clientapp/message_list.html';
        break;

      default:
        location.href = layui.setter.baseUrl + 'clientapp/profile.html';
    }
  }
console.log(common.user)
  admin.events.sendmsg = function(elem){
    layer.open({
      type: 2,
      area:['100%', $('#LAY_app_body').height() + 'px'],
      content: layui.setter.baseUrl + 'clientapp/send.html#/DOCTOR_NAME=' + elem.data('name'),
      title: '发送消息'
    });
  };

  exports('common', common);
});