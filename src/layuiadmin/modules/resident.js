layui.define(['table', 'form', 'upload', 'laydate'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,laydate = layui.laydate
  ,upload = layui.upload
  ,view = layui.view;

  $('#xy_resident_view').on('click', '.xy-resident-cancel', function(){
    view('xy_resident_view').render('resident/basic', {username: '测试'});
    $('html, body').animate({scrollTop:0}, 1);
  });

  $('#xy_resident_view').on('click', '.xy-resident-edit', function(){
    view('xy_resident_view').render('resident/basic-form', {username: '测试'}).done(function(){
      form.render(null, 'xy-resident-form-edit');
      form.val("xy-resident-form-edit", {
        'username': '测试'
        ,'sex': '男'
        ,'marry': '测试'
      })

      lay('.xy-resident-date').each(function(){
        laydate.render({
          elem: this
          ,trigger: 'click'
        });
      });

      //图片上传
      var uploadInst = upload.render({
        elem: '#xy-resident-avatar'
        ,url: ''
        ,before: function(obj){
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
            uploadInst.upload();
          });
        }
      });
    }); 
  });

  //用户管理
  table.render({
    elem: '#xy-resident-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {field: 'id', title: '个人编号'}
      ,{field: 'username', minWidth:100, title: '姓名'}
      ,{field: 'phone', title: '手机'}
      ,{field: 'sex', title: '性别'}
      ,{field: 'jointime', minWidth:100, title: '加入时间'}
      ,{title: '操作', width: 150, align:'center', fixed: 'right', toolbar: '#table-resident'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-resident-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    }
  });

  //个人病史
  table.render({
    elem: '#xy-resident-history-person'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', minWidth:100, title: '疾病名称'}
      ,{field: 'jointime', minWidth:100, title: '确诊时间'}
      ,{field: 'username', minWidth:100, title: '确诊机构'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //手术史
  table.render({
    elem: '#xy-resident-history-operation'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', minWidth:100, title: '名称'}
      ,{field: 'jointime', minWidth:100, title: '手术时间'}
      ,{field: 'username', minWidth:100, title: '手术机构'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //外伤
  table.render({
    elem: '#xy-resident-history-trauma'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', minWidth:100, title: '名称'}
      ,{field: 'jointime', minWidth:100, title: '时间'}
      ,{field: 'username', minWidth:100, title: '原因'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //输血
  table.render({
    elem: '#xy-resident-history-blood'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '时间'}
      ,{field: 'username', minWidth:100, title: '原因'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //住院史
  table.render({
    elem: '#xy-resident-history-hospital'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '住院时间'}
      ,{field: 'username', minWidth:100, title: '住院原因'}
      ,{field: 'username', minWidth:100, title: '医院名称'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //家庭史
  table.render({
    elem: '#xy-resident-history-family'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', minWidth:100, title: '疾病名称'}
      ,{field: 'username', minWidth:100, title: '与其关系'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //遗传病史
  table.render({
    elem: '#xy-resident-history-inherit'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', minWidth:100, title: '疾病名称'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //过敏史
  table.render({
    elem: '#xy-resident-history-allergy'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', minWidth:100, title: '过敏源'}
      ,{field: 'username', minWidth:100, title: '来源'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //残疾情况
  table.render({
    elem: '#xy-resident-history-derfomity'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'username', minWidth:100, title: '残疾名称'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //就诊记录
  table.render({
    elem: '#xy-resident-history-visit'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '就诊时间'}
      ,{field: 'username', minWidth:100, title: '科室'}
      ,{field: 'username', minWidth:100, title: '就诊医生'}
      ,{field: 'username', minWidth:100, title: '就诊机构'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //会诊记录
  table.render({
    elem: '#xy-resident-history-consultation'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '会诊时间'}
      ,{field: 'username', minWidth:100, title: '会诊医生'}
      ,{field: 'username', minWidth:100, title: '会诊机构'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //转诊记录
  table.render({
    elem: '#xy-resident-history-refer'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '转诊时间'}
      ,{field: 'username', minWidth:100, title: '转诊医生'}
      ,{field: 'username', minWidth:100, title: '转诊机构'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //体检记录
  table.render({
    elem: '#xy-resident-history-examination'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '体检时间'}
      ,{field: 'username', minWidth:100, title: '体检类型'}
      ,{field: 'username', minWidth:100, title: '体检医生'}
      ,{field: 'username', minWidth:100, title: '医疗机构'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //随访记录
  table.render({
    elem: '#xy-resident-history-followup'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '随访时间'}
      ,{field: 'username', minWidth:100, title: '随访类型'}
      ,{field: 'username', minWidth:100, title: '随访医生'}
      ,{field: 'username', minWidth:100, title: '医疗机构'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  //问卷记录
  table.render({
    elem: '#xy-resident-history-survey'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,cols: [[
      {type: 'numbers', title: '序号'}
      ,{field: 'jointime', minWidth:100, title: '问卷时间'}
      ,{field: 'username', minWidth:100, title: '问卷类型'}
      ,{field: 'username', minWidth:100, title: '问卷名称'}
      ,{field: 'username', minWidth:100, title: '调查人员'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  exports('resident', {})
});