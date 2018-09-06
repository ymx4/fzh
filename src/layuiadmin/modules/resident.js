layui.define(['table', 'form', 'element', 'upload', 'laydate', 'laytpl', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,element = layui.element
  ,laydate = layui.laydate
  ,upload = layui.upload
  ,laytpl = layui.laytpl
  ,common = layui.common;

  var pageType = 'detail';

  var init = {
    list: function() {
      form.val('xy-resident-search-form', {UNIT_ID: common.user.UNIT_ID, UNIT_NAME: common.user.UNIT_NAME});
      common.xyRender({
        elem: '#xy-resident-manage'
        ,url: layui.setter.api.SearchClient
        ,where: {
          "KEY_WORD" : "",
          "UNIT_ID": common.user.UNIT_ID,
          "CHILDREN_UNIT": 0,
          "USER_ID": common.user.ID
        }
        ,cols: [[
          {field: 'ID', title: '个人编号', minWidth:100, event:'detail', style:'cursor: pointer;'}
          ,{field: 'REAL_NAME', title: '姓名', minWidth:100, event:'detail', style:'cursor: pointer;'}
          ,{field: 'MOBILE', title: '手机', minWidth:100}
          ,{field: 'USER_SEX', title: '性别', minWidth:100}
          ,{field: 'CREATE_TIME', title: '加入时间', minWidth:100}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230}
        ]]
      });

      //监听搜索
      form.on('submit(xy-resident-search)', function(data){
        var field = data.field;
        delete field.UNIT_NAME;
        field.CHILDREN_UNIT = field.CHILDREN_UNIT || 0;
        //执行重载
        common.xyReload('xy-resident-manage', {
          where: field
        });
      });
      
      //监听工具条
      table.on('tool(xy-resident-manage)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
          layer.confirm('确定要删除吗', function(index){
            common.req({
              url: layui.setter.api.DeleteClient
              ,data: {CLIENT_ID: obj.data.ID}
              ,success: function(data){
                obj.del();
                layer.close(index);
              }
            });
          });
        }
      });
    }
    ,detail: function() {
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
    }
    ,edit: function() {
      pageType = 'edit';
      layui.common.initArea();

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
            content: layui.setter.baseUrl + '/history/person.html',
            title: '编辑'
          });
        }
      });

      element.on('collapse(collapse-history)', function(data){
        if (data.show && !data.title.attr('data-init')) {
          data.title.attr('data-init', 1);
          var type = data.title.attr('data-type');
          renderHistory[type].call(this);
        }
      });

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
        // ,auto: false
        ,url: 'http://holtest.fres.cn/PublicMethods/UpLoad/UpFile.ashx'
        ,choose: function(obj){
          //预读本地文件示例，不支持ie8
          obj.preview(function(index, file, result){
            $('#xy-resident-avatar-img').attr('src', result); //图片链接（base64）
          });
        }
        ,done: function(res){
          if (res.status == 1) {
            $('#FACE_PICTURE_ID').val(res.message);
          } else {
            return layer.msg(res.message);
          }
          $('#xy-resident-avatar').text('重新上传');
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
        ,url: 'http://holtest.fres.cn/PublicMethods/UpLoad/UpFile.ashx'
        ,before: function(obj){
          //预读本地文件示例，不支持ie8
          obj.preview(function(index, file, result){
            $('#xy-resident-identity-img').attr('src', result); //图片链接（base64）
          });
        }
        ,done: function(res){
          if (res.status == 1) {
            $('#ID_NUMBER_FILE_ID').val(res.message);
          } else {
            return layer.msg(res.message);
          }
          $('#xy-resident-avatar').text('重新上传');
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
      common.xyRender({
        elem: '#xy-resident-history-person'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-operation'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-trauma'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-blood'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-hospital'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-family'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-inherit'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-allergy'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-derfomity'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-visit'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-consultation'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-referral'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-examination'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-followup'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
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
      common.xyRender({
        elem: '#xy-resident-history-survey'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
      });
    }
  };

  exports('resident', {init})
});