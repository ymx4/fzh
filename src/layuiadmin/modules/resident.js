layui.define(['table', 'form', 'element', 'upload', 'laydate', 'laytpl', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,element = layui.element
  ,laydate = layui.laydate
  ,upload = layui.upload
  ,laytpl = layui.laytpl
  ,common = layui.common;

  // --- list

  //用户管理
  table.render({
    elem: '#xy-resident-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,cols: [[
      {type: 'checkbox'}
      ,{field: 'id', title: '个人编号', minWidth:100, event:'detail', style:'cursor: pointer;'}
      ,{field: 'username', title: '姓名', minWidth:100, event:'detail', style:'cursor: pointer;'}
      ,{field: 'phone', title: '手机', minWidth:100}
      ,{field: 'sex', title: '性别', minWidth:100}
      ,{field: 'jointime', title: '加入时间', minWidth:100}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-resident-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'detail'){
      parent.layui.index.openTabsPage('resident/detail.html', data.username);
    }
  });

  // --- edit

  var pageType = 'detail';

  var init = {
    detail: function() {
      pageType = 'detail';

      laytpl(xy_resident_detail.innerHTML).render({username: '测试'}, function(html){
        document.getElementById('xy_resident_view').innerHTML = html;
      });

      laytpl(xy_resident_health_detail.innerHTML).render({username: '测试'}, function(html){
        document.getElementById('xy_resident_health').innerHTML = html;
      });

      laytpl(xy_resident_env_detail.innerHTML).render({username: '测试'}, function(html){
        document.getElementById('xy_resident_env').innerHTML = html;
      });
    },

    edit: function() {
      pageType = 'edit';

      xyArea(1, [$('#xy_begin_addr1'), $('#xy_begin_addr2')]);

      // form.render(null, 'xy-resident-form');
      form.val("xy-resident-form", {
        'username': '测试'
        ,'sex': '1'
        ,'birthday': '2018-09-09'
        ,'create': '2018-09-09'
      });

      lay('.xy-resident-date').each(function(){
        laydate.render({
          elem: this
          ,trigger: 'click'
        });
      });

      //图片上传
      var uploadAvatar = upload.render({
        elem: '#xy-resident-avatar'
        ,auto: false
        ,url: ''
        ,choose: function(obj){
          //预读本地文件示例，不支持ie8
          obj.preview(function(index, file, result){
            $('#xy-resident-avatar-img').attr('src', result); //图片链接（base64）
          });
        }
        ,done: function(res){
          //如果上传失败
          if(res.code > 0){
            return layer.msg('上传失败');
          }
          //上传成功
        }
        ,error: function(){
          //演示失败状态，并实现重传
          var text = $('#xy-redident-avatar-text');
          text.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
          text.find('.demo-reload').on('click', function(){
            uploadAvatar.upload();
          });
        }
      });
      var uploadIdentity = upload.render({
        elem: '#xy-resident-identity'
        ,url: ''
        ,before: function(obj){
          //预读本地文件示例，不支持ie8
          obj.preview(function(index, file, result){
            $('#xy-resident-identity-img').attr('src', result); //图片链接（base64）
          });
        }
        ,done: function(res){
          //如果上传失败
          if(res.code > 0){
            return layer.msg('上传失败');
          }
          //上传成功
        }
        ,error: function(){
          //演示失败状态，并实现重传
          var text = $('#xy-redident-identity-text');
          text.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
          text.find('.demo-reload').on('click', function(){
            uploadIdentity.upload();
          });
        }
      });
    }
  }

  form.on('select(xy-addr-select)', function(data){
    $(data.elem).closest('.xy-select').nextAll('.xy-select').remove();
    if (data.value != '') {
      xyArea(data.value, $(data.elem).closest('.xy-select'));
    }
  });

  var xyArea = function(parentid, elem){
    $.ajax({
      url: layui.setter.api.GetAreaList
      ,type: 'post'
      ,data: JSON.stringify({PARENT_ID: parentid})
      ,dataType: 'json'
      ,success: function(data){
        if (data.status == 1) {
          if (data.data != null && data.data.length > 0) {
            laytpl(xy_select.innerHTML).render({selname: 'area' + data.data[0].LEVEL_NUMBER, list: data.data}, function(html){
              if (elem instanceof Array) {
                $.each(elem,function(i, item){
                  item.after(html);
                });
              } else {
                elem.after(html);
              }
              form.render('select', 'xy-resident-form');
            });
          }
        } else {
          common.apierror(data);
        }
      }
    });
  }

  form.on('submit(xy-resident-submit)', function(data){
    console.log(data.elem) //被执行事件的元素DOM对象，一般为button对象
    console.log(data.form) //被执行提交的form对象，一般在存在form标签时才会返回
    console.log(data.field) //当前容器的全部表单字段，名值对形式：{name: value}
    return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
  });

  table.on('tool(xy-resident-history-person)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    } else if (obj.event === 'edit'){
      var index = common.modal({
        content: common.base + 'history/person.html',
        title: '编辑'
      });
      // obj.update({
      //   username: '123'
      //   ,title: 'xxx'
      // });
    }
  });

  element.on('collapse(collapse-history)', function(data){
    if (data.show && !data.title.attr('data-init')) {
      data.title.attr('data-init', 1);
      var type = data.title.attr('data-type');
      renderHistory[type].call(this);
    }
  });

  var renderHistory = {
    person: function(){
      //个人病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '疾病名称', minWidth:100}
        ,{field: 'jointime', title: '确诊时间', minWidth:100}
        ,{field: 'username', title: '确诊机构', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-person'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,operation: function(){
      //手术史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '名称', minWidth:100}
        ,{field: 'jointime', title: '手术时间', minWidth:100}
        ,{field: 'username', title: '手术机构', minWidth:100}
      ]
      table.render({
        elem: '#xy-resident-history-operation'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,trauma: function(){
      //外伤
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '名称', minWidth:100}
        ,{field: 'jointime', title: '时间', minWidth:100}
        ,{field: 'username', title: '原因', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-trauma'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,blood: function(){
      //输血
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '时间', minWidth:100}
        ,{field: 'username', title: '原因', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-blood'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,hospital: function(){
      //住院史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '住院时间', minWidth:100}
        ,{field: 'username', title: '住院原因', minWidth:100}
        ,{field: 'username', title: '医院名称', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-hospital'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,family: function(){
      //家庭史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '疾病名称', minWidth:100}
        ,{field: 'username', title: '与其关系', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-family'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,inherit: function(){
      //遗传病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '疾病名称', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-inherit'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,allergy: function(){
      //过敏史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '过敏源', minWidth:100}
        ,{field: 'username', title: '来源', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-allergy'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,derfomity: function(){
      //残疾情况
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '残疾名称', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      table.render({
        elem: '#xy-resident-history-derfomity'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,visit: function(){
      //就诊记录
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '就诊时间', minWidth:100}
        ,{field: 'username', title: '科室', minWidth:100}
        ,{field: 'username', title: '就诊医生', minWidth:100}
        ,{field: 'username', title: '就诊机构', minWidth:100}
      ];
      table.render({
        elem: '#xy-resident-history-visit'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,consultation: function(){
      //会诊记录
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '会诊时间', minWidth:100}
        ,{field: 'username', title: '会诊医生', minWidth:100}
        ,{field: 'username', title: '会诊机构', minWidth:100}
      ];
      table.render({
        elem: '#xy-resident-history-consultation'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,referral: function(){
      //转诊记录
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '转诊时间', minWidth:100}
        ,{field: 'username', title: '转诊医生', minWidth:100}
        ,{field: 'username', title: '转诊机构', minWidth:100}
      ];
      table.render({
        elem: '#xy-resident-history-referral'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,examination: function(){
      //体检记录
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '体检时间', minWidth:100}
        ,{field: 'username', title: '体检类型', minWidth:100}
        ,{field: 'username', title: '体检医生', minWidth:100}
        ,{field: 'username', title: '医疗机构', minWidth:100}
      ];
      table.render({
        elem: '#xy-resident-history-examination'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,followup: function(){
      //随访记录
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '随访时间', minWidth:100}
        ,{field: 'username', title: '随访类型', minWidth:100}
        ,{field: 'username', title: '随访医生', minWidth:100}
        ,{field: 'username', title: '医疗机构', minWidth:100}
      ];
      table.render({
        elem: '#xy-resident-history-followup'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }

    ,survey: function(){
      //问卷记录
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '问卷时间', minWidth:100}
        ,{field: 'username', title: '问卷类型', minWidth:100}
        ,{field: 'username', title: '问卷名称', minWidth:100}
        ,{field: 'username', title: '调查人员', minWidth:100}
      ];
      table.render({
        elem: '#xy-resident-history-survey'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,limit: common.constant.DEFAULT_PAGE_SIZE
        ,cols: [cols]
        ,page: {layout:['prev', 'page', 'next', 'count']}
        ,text: '对不起，加载出现异常！'
      });
    }
  };

  exports('resident', {init})
});