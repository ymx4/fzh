layui.define(['layer', 'admin', 'view', 'table', 'form', 'tree', 'element'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form
  ,element = layui.element
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
    ,closeSelf: function() {
      top.layui.common.closeTab(top.layui.admin.tabsPage.index);
    }
    ,getUploadUrl: function () {
      if(this.user && this.user.token){
        return layui.setter.api.UpFile + '?token=' + this.user.token;
      } else {
        return layui.setter.api.UpFile;
      }
    }
    ,getImageUrl: function (fn) {
      if(this.user && this.user.token){
        return layui.setter.api.ReadFile + '?FN=' + encodeURIComponent(fn) + '&token=' + this.user.token;
      } else {
        return layui.setter.api.ReadFile + '?FN=' + encodeURIComponent(fn);
      }
    }
    ,saveSuccess: function(options) {
      if (typeof options == 'string') {
        var href = options;
        var refreshElem = '.layui-icon-search';
        var type = 0;
      } else {
        var href = options.href;
        var refreshElem = options.refresh;
        var type = options.type;
      }
      if (type == 1) {
        var searchBtn = $(refreshElem, parent.document);
        searchBtn.trigger('click');
        this.closeParent();
        return;
      }
      var index = top.layui.admin.tabsPage.index;
      var topLayui = top.layui;
      if (href) {
        //遍历页签选项卡
        var matchTo
        ,tabs = $('#LAY_app_tabsheader>li', top.document)
        ,curIndex;
        
        tabs.each(function(index){
          var li = $(this)
          ,layid = li.attr('lay-id');

          if(layid === href){
            curIndex = index;
            matchTo = true;
            return false;
          }
        });

        if (matchTo) {
          topLayui.index.openTabsPage(href);
          var iframe = topLayui.admin.tabsBody(curIndex).find('.layadmin-iframe');
          var searchBtn = $(refreshElem, iframe[0].contentWindow.document);
          if (searchBtn.length > 0) {
            searchBtn.trigger('click');
          } else {
            topLayui.admin.events.refresh();
          }
        }
      }
      topLayui.common.closeTab(index);
    }
    ,closeTab: function(index) {
      $('#LAY_app_tabsheader>li').eq(index).find('.layui-tab-close').trigger('click');
    }
    ,modal: function(options) {
      options = $.extend({
        type: 2
      }, options);
      var index = layer.open({
        type: options.type,
        content: options.content,
        title: options.title
      });
      if (options.full) {
        layer.full(index);
      }
      return index;
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
            layer.confirm('登录超时，请重新登录', {btn: ['去登录', '取消']}, function(){
              top.location.href = layui.setter.baseUrl + loginPath;
            });
          } else {
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
    ,initConfig: function(){
      var that = this;
      var configlen = $('.xy-config').length;
      $('.xy-config').each(function(index){
        var dataVal = $(this).attr('data-val');
        that.req({
          url: layui.setter.api.GetConfigDetail
          ,data: {
            "CONFIG_ID": $(this).attr('data-cf') ? $(this).attr('data-cf') : 9 //TODO
          }
          ,success: $.proxy(function(data){
            if (data.data.length > 0) {
              var html = '<option value="">请选择</option>';
              for (i = 0; i < data.data.length; i++) {
                var selected = '';
                if (dataVal == data.data[i].ID) {
                  selected = ' selected';
                }
                html += '<option value="' + data.data[i].ID + '"' + selected + '>' + data.data[i].CONFIG_VALUE + '</option>';
              }
              $(this).html(html);
            }
            form.render('select');
          }, this)
        });
      });
    }
    ,areaFirst: true
    ,initArea: function(editElem){
      var that = this;
      if (this.areaFirst) {
        form.on('select(xy-addr-select)', function(data){
          $(data.elem).closest('.xy-select').nextAll('.xy-select').remove();
          if (data.value != '') {
            var selElem = $(data.elem).closest('.xy-select');
            that.area(data.value, selElem);
            selElem.siblings('.xy-select-val').val($(data.elem).val());
          }
        });
      }
      if (editElem && editElem.default) {
        that.req({
          url: layui.setter.api.GetAreaText
          ,data: {AREA_ID: editElem.default}
          ,success: function(areadata){
            var parentid = 1;
            var tmp = $(editElem.elem);
            for (ii = 0; ii < areadata.data.length; ii++) {
              tmp.after('<div class="layui-inline xy-select">\
                  <select lay-filter="xy-addr-select" data-pid="' + parentid + '" data-id="' + areadata.data[ii].ID + '">\
                    <option value="">请选择</option>\
                  </select>\
                </div>'
              );

              tmp = tmp.next();
              parentid = areadata.data[ii].ID;
            }

            $(editElem.elem).siblings('.xy-select').children('select').each(function(){
              var othis = $(this);
              that.req({
                url: layui.setter.api.GetAreaList
                ,data: {PARENT_ID: $(this).attr('data-pid')}
                ,success: function(data){
                  if (data.data != null && data.data.length > 0) {
                    layui.laytpl('{{#  layui.each(d.list, function(index, item){ }}\
                        <option value="{{ item.ID }}"{{#  if(d.defaultId == item.ID){ }} selected{{#  } }} >{{ item.AREA_NAME }}</option>\
                      {{#  }); }}'
                    ).render({list: data.data, defaultId: othis.attr('data-id')}, function(html){
                      othis.append(html);
                      form.render('select');
                    });
                  }
                }
              });
            });
          }
        });
      } else {
        if (editElem) {
          var arealist = $(editElem.elem);
        } else {
          var arealist = [];
          $('.xy-area').each(function(){
            arealist.push($(this));
          });
        }
        if (arealist.length > 0) {
          this.area(1, arealist);
        }
      }
      this.areaFirst = false;
    }
    ,area: function(parentid, elem){
      var that = this;

      that.req({
        url: layui.setter.api.GetAreaList
        ,data: {PARENT_ID: parentid}
        ,success: function(data){
          if (data.data != null && data.data.length > 0) {
            layui.laytpl('<div class="layui-inline xy-select">\
                <select lay-filter="xy-addr-select">\
                  <option value="">请选择</option>\
                  {{#  layui.each(d.list, function(index, item){ }}\
                    <option value="{{ item.ID }}">{{ item.AREA_NAME }}</option>\
                  {{#  }); }}\
                </select>\
              </div>'
            ).render({list: data.data}, function(html){
              if (elem instanceof Array) {
                $.each(elem,function(i, item){
                  item.after(html);
                });
              } else {
                elem.after(html);
              }
              form.render('select');
            });
          }
        }
      });
    }
    ,clientData: function(elem, clientId, adapter){
      adapter = adapter || 'pc';
      if (adapter == 'clientapp') {
        return;
      }
      common.req({
        url: layui.setter.api.GetClientInfo
        ,data: {
          CLIENT_ID: clientId
        }
        ,success: $.proxy(function(clientData){
          view(elem).render('common/client', {
            clientData: clientData.data,
            adapter: adapter,
            detailUrl: layui.setter.baseUrl + 'resident/detail.html'
          }).done(function(){
          });
        })
      });
    }
    ,rowspan: function(fieldName,index,flag){
      /**
        *跨行合并单元格
        *@param 
        *fieldName 列名
        *index 用来区分固定左表，非固定表，固定右表,待用
        *flag 是否根据td内的html判断内容是否一致，true是
        */
      // 1为不冻结的情况，左侧列为冻结的情况
      var fixedNode = index=="1"?$(".layui-table-body")[index - 1]:(index=="3"?$(".layui-table-fixed-r"):$(".layui-table-fixed-l"));
      // 左侧导航栏不冻结的情况
      var child = $(fixedNode).find("td");
      var childFilterArr = [];
      // 获取data-field属性为fieldName的td
      for(var i = 0; i < child.length; i++){
        if(child[i].getAttribute("data-field") == fieldName){
          childFilterArr.push(child[i]);
        }
      }
      // 获取td的个数和种类
      var childFilterTextObj = {};
      for(var i = 0; i < childFilterArr.length; i++){
        var childText = flag?childFilterArr[i].innerHTML:childFilterArr[i].textContent;
        if(childFilterTextObj[childText] == undefined){
          childFilterTextObj[childText] = 1;
        }else{
          var num = childFilterTextObj[childText];
          childFilterTextObj[childText] = num*1 + 1;
        }
      }
      var canRowspan = true;
      var maxNum = 9999;
      for(var i = 0; i < childFilterArr.length; i++){
        maxNum = $(childFilterArr[i]).prev().attr("rowspan")&&fieldName!="8"?$(childFilterArr[i]).prev().attr("rowspan"):maxNum;
        var key = flag?childFilterArr[i].innerHTML:childFilterArr[i].textContent;
        var tdNum = childFilterTextObj[key];
        var curNum = maxNum<tdNum?maxNum:tdNum;
     
        for(var j =1;j<curNum&&(i+j<childFilterArr.length);j++){
          var nextKey = flag?childFilterArr[i+j].innerHTML:childFilterArr[i+j].textContent;
          if(key!=nextKey&&curNum>1){
            canRowspan = true;
            curNum = j;
          }
        }
        if(canRowspan){
          childFilterArr[i].setAttribute("rowspan",curNum);
          if($(childFilterArr[i]).find("div.rowspan").length>0){//设置td内的div.rowspan高度适应合并后的高度
            $(childFilterArr[i]).find("div.rowspan").parent("div.layui-table-cell").addClass("rowspanParent");
            $(childFilterArr[i]).find("div.layui-table-cell")[0].style.height= curNum*39-10 +"px";
          }
          canRowspan = false;
        }else{
          childFilterArr[i].style.display = "none";
        }
        if(maxNum){
          maxNum--;
        }
        if(--childFilterTextObj[key]==0||maxNum==0||(nextKey!=undefined&&key!=nextKey)){
          canRowspan = true;
        }
      }
    }
  };

  var loginPath = 'passport/login.html';
  if (location.href.indexOf('/mobile/') != -1 || router.search.adapter == 'm') {
    loginPath += '#/redirect=' + encodeURIComponent(location.href);
  }

  if (location.href.indexOf('login') == -1 && router.search.adapter != 'clientapp') {
    var sess = layui.data(layui.setter.tableName);
    if (!sess.user) {
      location.href = layui.setter.baseUrl + loginPath;
    } else {
      common.user = sess.user;
      if (location.href.indexOf('views/index.html') != -1) {
        $('#myRealname').text(common.user.REAL_NAME);
        $('#myUnitname').text(common.user.UNIT_NAME);
      }
    }
  }

  admin.events.closelayer = function(){
    common.closeParent();
  };

  admin.events.closeself = function(){
    parent.layui.admin.closeThisTabs();
  }

  admin.events.xyicd = function(elemid){
    var icdindex = layer.open({
      type: 1,
      area:['90%', '90%'],
      content: '<div id="xyicd"></div>',
      title: 'ICD查询'
    });
    var typeId = elemid.data('type');
    view('xyicd').render('common/icd', {often: typeId ? true : false}).done(function(){
      setTimeout(function(){
        common.xyRender({
          elem: '#xy-icd-table'
          ,url: layui.setter.api.SearchICD
          ,where: {
            ICD_KEYWORD: '',
          }
          ,cols: [[
            {type: 'numbers', title: '序号'}
            ,{field: 'DISEASE_NAME', title: '疾病名称'}
            ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-icd-ope'}
          ]]
        });
      },100);

      element.on('tab(xy-icd-tab)', function(data){
        if (data.index == 1) {
          if (common.empty(data.elem.data('check'))) {
            data.elem.data('check', 1);
            common.xyRender({
              elem: '#xy-icd-often-table'
              ,url: layui.setter.api.GetOftenICD
              ,where: {
                TYPE_ID: typeId,
              }
              ,cols: [[
                {type: 'numbers', title: '序号'}
                ,{field: 'DISEASE_NAME', title: '疾病名称'}
                ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-icd-ope'}
              ]]
            });
          }
        }
      });

      table.on('tool(xy-icd-table)', function(obj){
        if(obj.event === 'sel'){
          if (elemid.attr('data-id')) {
            $('#' + elemid.attr('data-id')).val(obj.data.ID);
          }
          $('#' + elemid.attr('data-name')).val(obj.data.DISEASE_NAME);
          $('#' + elemid.attr('data-name')).attr('title', obj.data.DISEASE_NAME);
          layer.close(icdindex);
        }
      });

      table.on('tool(xy-icd-often-table)', function(obj){
        if(obj.event === 'sel'){
          if (elemid.attr('data-id')) {
            $('#' + elemid.attr('data-id')).val(obj.data.ID);
          }
          $('#' + elemid.attr('data-name')).val(obj.data.DISEASE_NAME);
          $('#' + elemid.attr('data-name')).attr('title', obj.data.DISEASE_NAME);
          layer.close(icdindex);
        }
      });
      
      //监听搜索
      form.on('submit(xy-icd-search)', function(data){
        //执行重载
        common.xyReload('xy-icd-table', {
          where: {
            ICD_KEYWORD: data.field.icdq
          }
        });
      });
    });
  };

  admin.events.xyalldoctor = function(elemid){
    if (elemid.attr('data-id')) {
      $('#' + elemid.attr('data-id')).val('0');
    }
    $('#' + elemid.attr('data-name')).val(elemid.text());
    $('#' + elemid.attr('data-name')).attr('title', elemid.text());
  }

  admin.events.xyseldoctor = function(elemid){
    var seldoctorindex = layer.open({
      type: 1,
      area:['90%', '90%'],
      content: '<div id="xyseldoctor"></div>',
      title: '选择医生'
    });
    view('xyseldoctor').render('common/doctor').done(function(){
      setTimeout(function(){
        common.xyRender({
          elem: '#xy-seldoctor-table'
          ,url: layui.setter.api.GetUserList
          ,where: {
            "KEY_WORD" : "",
            "UNIT_ID": common.user.UNIT_ID,
            "ALL_UNIT": 0,
            "GROUP_ID": 0,
            "FAMILY_DOCTOR": 0,
            "SPECIALIST": 0
          }
          ,cols: [[
            {type: 'numbers', title: '序号'}
            ,{field: 'REAL_NAME', title: '医生姓名'}
            ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-seldoctor-ope'}
          ]]
        });
      },100);

      table.on('tool(xy-seldoctor-table)', function(obj){
        if(obj.event === 'sel'){
          if (elemid.attr('data-id')) {
            $('#' + elemid.attr('data-id')).val(obj.data.ID);
          }
          $('#' + elemid.attr('data-name')).val(obj.data.REAL_NAME);
          $('#' + elemid.attr('data-name')).attr('title', obj.data.REAL_NAME);
          layer.close(seldoctorindex);
        }
      });
      
      //监听搜索
      form.on('submit(xy-seldoctor-search)', function(data){
        //执行重载
        common.xyReload('xy-seldoctor-table', {
          where: {"KEY_WORD" : data.field.KEY_WORD}
        });
      });
    });
  };

  var formatTree = function(data) {
    if (data.HOSPITAL_UNIT_INFO) {
      var node = {name: data.HOSPITAL_UNIT_INFO.UNIT_NAME, id: data.HOSPITAL_UNIT_INFO.ID, spread: true};
      if (data.CHILDREN_HOSPITAL_UNIT_INFO && data.CHILDREN_HOSPITAL_UNIT_INFO.length > 0) {
        node.children = [];
        for (var i = 0; i < data.CHILDREN_HOSPITAL_UNIT_INFO.length; i++) {
          node.children.push(formatTree(data.CHILDREN_HOSPITAL_UNIT_INFO[i]));
        }
      }
      data = node;
    }
    return data;
  }

  admin.events.xyallins = function(elemid){
    if (elemid.attr('data-id')) {
      $('#' + elemid.attr('data-id')).val('0');
    }
    $('#' + elemid.attr('data-name')).val(elemid.text());
    $('#' + elemid.attr('data-name')).attr('title', elemid.text());
  }

  admin.events.xyinscancel = function(elemid){
    if (elemid.attr('data-id')) {
      $('#' + elemid.attr('data-id')).val(common.user.UNIT_ID);
    }
    $('#' + elemid.attr('data-name')).val(common.user.UNIT_NAME);
    $('#' + elemid.attr('data-name')).attr('title', common.user.UNIT_NAME);
  }

  admin.events.xyins = function(elemid){
    var insindex = layer.open({
      type: 1,
      area:['90%', '90%'],
      content: '<div id="xyins"></div>',
      title: '机构选择'
    });
    view('xyins').render('common/ins').done(function(){
      common.req({
        url: layui.setter.api.GetHospitalUnit
        ,data: {
          "HOSPITAL_ID": common.user.UNIT_ID,
          "GET_TYPE": 2
        }
        ,success: function(data){
          var nodes = formatTree(data.data);
          nodes = [nodes];
          layui.tree({
            elem: '#xy-inslist'
            ,nodes: nodes
            ,click: function(node){
              $('#ins-confirm').attr('data-id', node.id);
              $('#ins-confirm').attr('data-name', node.name);
            }
          });
        }
      });
      $("#xyins").on("mousedown", ".layui-tree a cite",function(){ 
        $(".layui-tree a cite").removeClass('layui-bg-green');
        $(this).addClass('layui-bg-green');
      });
      $('#ins-confirm').on('click', function(){
        if ($(this).attr('data-id')) {
          $('#' + elemid.attr('data-id')).val($(this).attr('data-id'));
        }
        $('#' + elemid.attr('data-name')).val($(this).attr('data-name'));
        $('#' + elemid.attr('data-name')).attr('title', $(this).attr('data-name'));
        layer.close(insindex);
      });
    });
  };

  // var getParams = function () {
  //    var url = location.search;
  //    var theRequest = new Object();
  //    if (url.indexOf("?") != -1) {
  //       var str = url.substr(1);
  //       strs = str.split("&");
  //       for(var i = 0; i < strs.length; i ++) {
  //          theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
  //       }
  //    }
  //    return theRequest;
  // }

	exports('common', common);
});