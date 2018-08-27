layui.define(['layer', 'admin', 'view', 'table', 'form', 'tree'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,admin = layui.admin
  ,view = layui.view
  ,table = layui.table
  ,form = layui.form

  ,common = {
    user: {}
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
    ,base: '/views/'
    ,constant: {
      DEFAULT_PAGE_SIZE: 10,
    }
    ,req: function(options){
      var success = options.success;
      
      var formerror = options.formerror || false;
      options.data = options.data || {};
      options.data = JSON.stringify(options.data);
      
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
    ,tRender: function(options){
      if(this.user && this.user.token){
        //自动给参数传入默认 token
        options.url = options.url + '?token=' + this.user.token;
      }
      return table.render(options);
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
    ,initArea: function(hiddenElem){
      var that = this;
      form.on('select(xy-addr-select)', function(data){
        $(data.elem).closest('.xy-select').nextAll('.xy-select').remove();
        if (data.value != '') {
          that.area(data.value, $(data.elem).closest('.xy-select'));
          $(hiddenElem).val($(data.elem).children('option:selected').attr('data-code'));
        }
      });
      var arealist = [];
      $('.xy-area').each(function(){
        arealist.push($(this));
      });
      if (arealist.length > 0) {
        this.area(1, arealist);
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
                  <select name="{{d.selname}}" lay-filter="xy-addr-select">\
                    <option value="">请选择</option>\
                    {{#  layui.each(d.list, function(index, item){ }}\
                      <option value="{{ item.ID }}" data-code="{{item.AREA_CODE}}">{{ item.AREA_NAME }}</option>\
                    {{#  }); }}\
                  </select>\
                </div>\
            ').render({selname: 'area' + data.data[0].LEVEL_NUMBER, list: data.data}, function(html){
              if (elem instanceof Array) {
                $.each(elem,function(i, item){
                  item.after(html);
                });
              } else {
                elem.after(html);
              }
              form.render('select');
            });
          } else {

          }
        }
      });
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
  console.log(common.user);

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
        tRender({
          elem: '#xy-icd-table'
          ,url: layui.setter.api.SearchICD
          ,limit: constant.DEFAULT_PAGE_SIZE
          ,method: 'post'
          ,contentType: 'application/json'
          ,where: {
            ICD_KEYWORD: '',
          }
          ,request: {
            pageName: 'PAGE_NO'
            ,limitName: 'PAGE_SIZE'
          }
          ,response: {
            statusName: 'status'
            ,statusCode: 1
            ,countName: 'message'
          }
          ,cols: [[
            {type: 'numbers', title: '序号'}
            ,{field: 'DISEASE_NAME', title: '疾病名称'}
            ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-icd-ope'}
          ]]
          ,page: {layout:['prev', 'page', 'next', 'count']}
          ,text: '对不起，加载出现异常！'
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
        table.reload('xy-icd-table', {
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