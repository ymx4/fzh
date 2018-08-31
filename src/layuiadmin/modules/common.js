layui.define(['layer', 'admin', 'view', 'table', 'form', 'tree'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form

  ,common = {
    user: {}
    ,saveSuccess: function(href, text) {
      var index = top.layui.admin.tabsPage.index;
      var topLayui = top.layui;
      topLayui.index.openTabsPage(href, text);
      topLayui.admin.events.refresh();
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
      layer.full(index);
      return index;
    }
    ,req: function(options){
      var success = options.success;
      
      var formerror = options.formerror || false;
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

      return $.ajax($.extend({
        type: 'post'
        ,dataType: 'json'
        ,success: function(res){
          if (res.status == 1 && typeof success === 'function') {
            success(res);
          } else if (res.errorCode == 4006) {
            layer.confirm('登录超时，请重新登录', {btn: ['去登录', '取消']}, function(){
              top.location.href = layui.setter.baseUrl + '/passport/login.html';
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
      layer.load(0, {time: 10*1000});
      table.reload(filter, options);
    }
    ,xyRender: function(options){
      if(this.user && this.user.token){
        //自动给参数传入默认 token
        options.url = options.url + '?token=' + this.user.token;
      }
      var that = this;
      var done = options.done;

      delete options.done;

      layer.load(0, {time: 10*1000});

      return table.render($.extend({
        limit: 10
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
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: {none: '暂无相关数据'}
        ,done: function(res, curr, count){
          layer.closeAll('loading');
          if (res.errorCode == 4006) {
            layer.confirm('登录超时，请重新登录', {btn: ['去登录', '取消']}, function(){
              top.location.href = layui.setter.baseUrl + '/passport/login.html';
            });
          } else {
            if (typeof done === 'function') {
              done(res, curr, count);
            }
          }
        }
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
    ,initArea: function(hiddenElem, editElem){
      var that = this;
      form.on('select(xy-addr-select)', function(data){
        $(data.elem).closest('.xy-select').nextAll('.xy-select').remove();
        if (data.value != '') {
          that.area(data.value, $(data.elem).closest('.xy-select'));
          $(hiddenElem).val($(data.elem).val());
        }
      });
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
        var arealist = [];
        $('.xy-area').each(function(){
          arealist.push($(this));
        });
        if (arealist.length > 0) {
          this.area(1, arealist);
        }
      }
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

  if (location.href.indexOf('login') == -1) {
    var sess = layui.data(layui.setter.tableName);
    if (!sess.user) {
      location.href = layui.setter.baseUrl + '/passport/login.html';
    } else {
      common.user = sess.user;
    }
  }

  admin.events.closelayer = function(){
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
  };

  admin.events.closeself = function(){
    parent.layui.admin.closeThisTabs();
  }

  admin.events.xyicd = function(elemid){
    var icdindex = layer.open({
      type: 1,
      content: '<div id="xyicd"></div>',
      title: 'ICD查询'
    });
    layer.full(icdindex);
    view('xyicd').render('common/icd').done(function(){
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

      table.on('tool(xy-icd-table)', function(obj){
        if(obj.event === 'sel'){
          $('#' + elemid.attr('data-id')).val(obj.data.ID);
          $('#' + elemid.attr('data-name')).val(obj.data.DISEASE_NAME);
          $('#' + elemid.attr('data-name')).attr('title', obj.data.DISEASE_NAME);
          layer.close(icdindex);
        }
      });
      
      //监听搜索
      form.on('submit(xy-icd-search)', function(data){
        //执行重载
        common.xyReload('xy-icd-table', {
          page: {
            curr: 1
          }
          ,where: {
            ICD_KEYWORD: data.field.icdq
          }
        });
      });
    });
  };

  var formatTree = function(data) {
    if (data.HOSPITAL_UNIT_INFO) {
      var node = {name: data.HOSPITAL_UNIT_INFO.UNIT_NAME, id: data.HOSPITAL_UNIT_INFO.ID, spread: true};
      if (data.CHILDREN_HOSPITAL_UNIT_INFO && data.CHILDREN_HOSPITAL_UNIT_INFO.length > 0) {
        node.children = [];
        for (i = 0; i < data.CHILDREN_HOSPITAL_UNIT_INFO.length; i++) {
          node.children.push(formatTree(data.CHILDREN_HOSPITAL_UNIT_INFO[i]));
        }
      }
      data = node;
    }
    return data;
  }

  admin.events.xyins = function(elemid){
    var insindex = layer.open({
      type: 1,
      area:['80%', '80%'],
      content: '<div id="xyins"></div>',
      title: '机构选择'
    });
    view('xyins').render('common/ins').done(function(){
      layer.load(0, {time: 10*1000});
      common.req({
        url: layui.setter.api.GetHospitalUnit
        ,data: {
          "HOSPITAL_ID": common.user.UNIT_ID,
          "GET_TYPE": 2
        }
        ,success: function(data){
          layer.closeAll('loading');
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
          $('#' + elemid.attr('data-name')).val($(this).attr('data-name'));
          $('#' + elemid.attr('data-name')).attr('title', $(this).attr('data-name'));
        }
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