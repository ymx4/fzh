layui.define(['table', 'form'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form;

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