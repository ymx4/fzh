layui.define(['laytpl', 'element', 'flow', 'form', 'admin', 'history', 'table', 'view'], function(exports){
  var $ = layui.$
  ,element = layui.element
  ,laytpl = layui.laytpl
  ,flow = layui.flow
  ,form = layui.form
  ,admin = layui.admin
  ,table = layui.table
  ,view = layui.view
  ,router = layui.router()

  ,xymobile = {
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
        limit: 10
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
            if (options.url.indexOf('GetClientHistory') != -1 && res.data && res.data.length > 0) {
              for (var i = 0; i < res.data.length; i++) {
                Object.keys(res.data[i]).forEach(function(key){
                  if (key.indexOf('_TIME') != -1) {
                    res.data[i][key] = xymobile.empty(res.data[i][key]) ? '' : res.data[i][key].replace(/00:00:00/, '');
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
    ,clientData: function(elem, clientId, adapter){
      adapter = adapter || 'pc';
      if (adapter == 'clientapp') {
        return;
      }
      xymobile.req({
        url: layui.setter.api.GetClientInfo
        ,data: {
          CLIENT_ID: clientId
        }
        ,success: $.proxy(function(clientData){
          view(elem).render('xymobile/client', {
            clientData: clientData.data,
            adapter: adapter,
            detailUrl: layui.setter.baseUrl + 'mobile/resident_detail.html'
          }).done(function(){
          });
        })
      });
    }

    ,init: {
      messageList: function() {
        flow.load({
          elem: '#messageContainer'
          ,done: function(page, next) {
            xymobile.req({
              url: layui.setter.api.ReadMessage
              ,data: {READ_STATE: 2}
              ,disableLoad: true
              ,success: function(data){
                laytpl(messageTpl.innerHTML).render({
                  messageList: data.data
                }, function(html){
                  next(html, data.message > layui.setter.pageSize * page);
                });
              }
            });
          }
        });
      }
      ,clientList: function() {
        element.on('tab(clientSwitch)', function(data){
          $('#clientContainer').html('');
          flow.load({
            elem: '#clientContainer'
            ,done: function(page, next) {
              renderResident(page, next);
            }
          });
        });
        form.on('submit(client-search)', function(data){
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
        $('#clientContainer').on('click', '.addArrange', function() {
          layer.open({
            type: 2,
            area:['100%', $('#LAY_app_body').height() + 'px'],
            content: layui.setter.baseUrl + 'arrange/edit.html#/CLIENT_ID=' + $(this).closest('.caller-item').data('id') + '/adapter=m',
            title: '添加随访'
          });
        });
        $('#clientContainer').on('click', '.getEquipment', function() {
          var ua = window.navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            wx.miniProgram.navigateTo({url: '../../page/index/index?redirect=' + encodeURIComponent($(this).data('href'))});
          } else {
            // android
            showDataDetailsActivity('doctor', $(this).data('id'), $(this).data('name'), layui.setter.api.Receive34 + '?token=' + xymobile.user.token);
          }
        });
      }
      ,residentDetail: function() {
        xymobile.req({
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
                $('#xy-resident-avatar-img').attr('src', xymobile.getImageUrl(data.data.FACE_FILE_NAME));
              }
              if (data.data.ID_NUMBER_FILE_NAME) {
                $('#xy-resident-identity-img').attr('src', xymobile.getImageUrl(data.data.ID_NUMBER_FILE_NAME));
              }
              previewImg();
            });
            listenHistory(data.data.ID);
            // history
            laytpl(historyContainer.innerHTML).render({
              edit:1,
              historySort: layui.history.historySort,
              healthSort: layui.history.healthSort,
              equipmentSort: layui.history.equipmentSort
            }, function(html){
              $('.resident-form').after(html);
              renderHealth(data.data.ID, false);
              element.render('collapse');
            });
          }, this)
        });
      }
      ,healthDetail: function() {
        var curId = router.search.clientId;
        var healthId = router.search.id;

        var formData = {};

        xymobile.clientData('xyClientData', curId, router.search.adapter);

        xymobile.req({
          url: layui.setter.api.GetPhysicalExaminationInfo
          ,data: {
            ID: healthId
          }
          ,success: $.proxy(function(examData) {
            $.each(examData.data, function(hIndex, item) {
              if (item.Physical_Detail.STATUS == 0) {
                item.Physical_Detail.DATA_VALUE = '未检';
              } else if (xymobile.empty(item.Physical_Detail.DATA_VALUE)) {
                item.Physical_Detail.DATA_VALUE = '无';
              } else if (item.Physical_Detail.INPUT_MODE == 2) {
                item.Physical_Detail.DATA_VALUE = item.Physical_Detail.DATA_VALUE.replace(/^\|/, '').replace(/\|/, ' ');
              }
              formData['hproject_' + item.Physical_Detail.PROJECT_ID] = item.Physical_Detail;
            });
            laytpl(detailContainer.innerHTML).render({formData: formData, equipmentSort: layui.history.equipmentSort}, function(html){
              $('.layui-fluid').append(html);

              showHistory(curId);
              element.render('collapse');
            });
          }, this)
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
        $('#arrangeContainer').on('click', '.editArrange', function() {
          layer.open({
            type: 2,
            area:['100%', $('#LAY_app_body').height() + 'px'],
            content: layui.setter.baseUrl + 'arrange/edit.html#/id=' + $(this).closest('.caller-item').data('id') + '/adapter=m',
            title: '随访'
          });
        });
        $('#arrangeContainer').on('click', '.showArrange', function() {
          layer.open({
            type: 2,
            area:['100%', $('#LAY_app_body').height() + 'px'],
            content: layui.setter.baseUrl + 'arrange/detail.html?abc#/id=' + $(this).closest('.caller-item').data('id') + '/adapter=m',
            title: '随访'
          });
        });
      }
      ,equipment: function() {
        if (!router.search.params) {
          layer.msg('参数错误', function() {
            location.href = layui.setter.baseUrl + 'mobile/client_list.html';
          });
          return;
        }
        var params = JSON.parse(decodeURIComponent(router.search.params));
        xymobile.req({
          url: layui.setter.api.GetClientInfo
          ,data: {
            CLIENT_ID: router.search.id
          }
          ,success: $.proxy(function(data){
            laytpl(xy_equipment_detail.innerHTML).render({clientData: data.data, equipmentData: params.value}, function(html){
              document.getElementById('xy_equipment_view').innerHTML = html;
            });

            form.on('submit(xy-equipment-submit)', function(data){
              //设备编号,测试时间,项目编号1: 项目1数值 | 项目编号2:项目2数值
              var eqdata = params.number + ',' + params.datetime + ',';
              $.each(params.value, function(index, item) {
                eqdata += item.no + ':' + item.value + '|';
              });
              eqdata = eqdata.replace(/\|$/g, '');
              alert(eqdata);
              xymobile.req({
                url: layui.setter.api.Receive34
                ,formerror: true
                ,data: {
                  CLIENT_ID: router.search.id,
                  DATA: eqdata
                }
                ,success: function(data){
                  layer.msg('操作成功', function() {
                  });
                }
              });
              return false;
            });
          })
        });
      }
      ,profile: function() {
        laytpl(xy_profile_detail.innerHTML).render(xymobile.user, function(html){
          document.getElementById('xy_profile_view').innerHTML = html;
        });
      }
    }
  };

  var renderHealth = function(cliendId, edit) {
    //公共卫生
    var cols = [
      {field: 'PHYSICAL_EXAMINATION_NO', title: '档案编号', event:'detail'}
      ,{field: 'CLIENT_REAL_NAME', title: '姓名', event:'detail'}
      ,{field: 'SEX_VALUE', title: '性别', event:'detail'}
      ,{field: 'CREATE_TIME', title: '建档时间', event:'detail'}
    ];
    if (edit) {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-health-ope'});
    }
    xymobile.xyRender({
      elem: '#xy-history-health'
      ,url: layui.setter.api.GetPhysicalExaminationList
      ,page: false
      ,where: {
        "CLIENT_ID": cliendId,
        "CREATE_UNIT_ID": 0,
        "CREATE_USER_ID": 0,
        "KEY_WORD" : "",
        "ALL_UNIT": 1,
      }
      ,cols: [cols]
    });
    table.on('tool(xy-history-health)', function(obj){
      var data = obj.data;
      if (obj.event === 'detail') {
        location.href = layui.setter.baseUrl + 'mobile/health_detail.html#/id=' + obj.data.ID + '/clientId=' + obj.data.CLIENT_ID + '/adapter=m';
      }
    });
  }

  var listenHistory = function(clientId) {
    var historySort = layui.history.historySort;
    var healthSort = layui.history.healthSort;
    var renderHistory = layui.history.renderHistory;
    var renderEquipment = layui.history.renderEquipment;
    element.on('collapse(collapse-history)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderHistory[type].call(this, {
          "CLIENT_ID" : clientId,
          "HISTORY_SORT_ID": historySort[type].id
        });
      }
    });
    element.on('collapse(collapse-health)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderHistory[type].call(this, {
          "CLIENT_ID" : clientId
        });
      }
    });
    element.on('collapse(collapse-equipment)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderEquipment(clientId, type);
      }
    });
  }

  var renderResident = function(page, next) {
    var where = {
      "KEY_WORD" : $('#KEY_WORD').val(),
      "UNIT_ID": xymobile.user.UNIT_ID,
      // "CHILDREN_UNIT": 0,
      "PAGE_NO": page,
      "PAGE_SIZE": layui.setter.pageSize
    }
    if ($('#clientTab .layui-this').data('tab') == 2) {
      where.USER_ID = -2;
    } else {
      where.USER_ID = xymobile.user.ID;
    }

    xymobile.req({
      url: layui.setter.api.SearchClient
      ,data: where
      ,disableLoad: true
      ,success: function(data){
        laytpl(clientTpl.innerHTML).render({
          clientList: data.data,
          detailUrl: layui.setter.baseUrl + 'mobile/resident_detail.html',
          equipmentUrl: layui.setter.baseUrl + 'mobile/equipment.html',
        }, function(html){
          next(html, data.message > layui.setter.pageSize * page);
        });
      }
    });
  }

  var showHistory = function(clientId) {
    var showHistory = ['hospital', 'familyHospital', 'medicine', 'inoculate'];

    var historySort = layui.history.historySort;
    var renderHistory = layui.history.renderHistory;
    var renderEquipment = layui.history.renderEquipment;

    $.each(showHistory, function(hIndex, item) {
      renderHistory[item].call(this, {
        "CLIENT_ID" : clientId,
        "HISTORY_SORT_ID": historySort[item].id
      });
    });
    element.on('collapse(collapse-equipment)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderEquipment(clientId, type);
      }
    });
  }

  var renderArrange = function(page, next) {
    var where = {
      "PAGE_NO": page,
      "PAGE_SIZE": layui.setter.pageSize
    }
    if ($('#arrangeTab .layui-this').data('tab') == 2) {
      where.STATUS = 1;
    } else {
      where.STATUS = 0;
    }

    xymobile.req({
      url: layui.setter.api.SearchArrange
      ,data: where
      ,disableLoad: true
      ,success: function(data){
        laytpl(arrangeTpl.innerHTML).render({
          arrangeList: data.data
        }, function(html){
          next(html, data.message > layui.setter.pageSize * page);
        });
      }
    });
  }

  var activePage = function() {
    var activeTab = 'default';
    var pages = {
      arrange: ['arrange.html']
      ,profile: ['profile.html']
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
      url: layui.setter.views + 'xymobile/layout' + layui.setter.engine
      ,type: 'get'
      ,dataType: 'html'
      ,data: {
        v: layui.cache.version
      }
      ,success: $.proxy(function(html){
        html = '<div>' + html + '</div>';
        var layoutElem = $(html).find('*[template]');
        $('.layui-body').before(laytpl(layoutElem.eq(0).html()).render({user: xymobile.user}));
        $('.layui-body').after(laytpl(layoutElem.eq(1).html()).render({activeTab: activeTab}));
      }, this)
    });
  }

  var messageTimer = null;
  var refreshUnread = function() {
    xymobile.req({
      url: layui.setter.api.UnreadMessage
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

  var loginPath = 'passport/login.html';
  if (location.href.indexOf('login') == -1) {
    loginPath += '#/redirect=' + encodeURIComponent(location.href);
    var sess = layui.data(layui.setter.tableName);
    if (!sess.user) {
      location.href = layui.setter.baseUrl + loginPath;
    } else {
      xymobile.user = sess.user;
      layout();
      if (location.href.indexOf('message_list.html') == -1) {
        refreshUnread();
        messageTimer = setInterval(function() {refreshUnread();}, layui.setter.unreadInterval);
      }
    }
  }

  var previewImg = function(){
    $('#xy-resident-avatar-img,#xy-resident-identity-img').click(function() {
      var src = $(this).attr('src');
      if (!xymobile.empty(src)) {
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

  admin.events.xyrefresh = function(){
    location.reload();
  }

  admin.events.xyback = function(){
    history.back();
  }

  admin.events.xytab = function(e){
    switch(e.attr('lay-type')) {
      case 'arrange':
        location.href = layui.setter.baseUrl + 'mobile/arrange.html';
        break;
      case 'profile':
        location.href = layui.setter.baseUrl + 'mobile/profile.html';
        break;
      case 'message':
        location.href = layui.setter.baseUrl + 'mobile/message_list.html';
        break;

      default:
        location.href = layui.setter.baseUrl + 'mobile/client_list.html';
    }
  }

  admin.events.sendmsg = function(elem){
    layer.open({
      type: 2,
      area:['100%', $('#LAY_app_body').height() + 'px'],
      content: layui.setter.baseUrl + 'message/send.html#/CLIENT_ID=' + elem.data('id') + '/CLIENT_NAME=' + elem.data('name'),
      title: '发送消息'
    });
  };

  $('body').on('click', '.xylink', function() {
    top.location.href = layui.setter.baseUrl + $(this).data('href');
  });
  exports('xymobile', xymobile)
});