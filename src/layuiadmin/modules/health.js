layui.define(['table', 'form', 'laytpl', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,laytpl = layui.laytpl
  ,common = layui.common;

  table.render({
    elem: '#xy-health-history-person'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,cols: [[
      {field: 'jointime', title: '入/出院日期', minWidth:100}
      ,{field: 'username', title: '原因', minWidth:100}
      ,{field: 'username', title: '医疗机构名称', minWidth:100}
      ,{field: 'username', title: '病案号', minWidth:100}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  table.render({
    elem: '#xy-health-history-family'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,cols: [[
      {field: 'jointime', title: '建/撤床日期', minWidth:100}
      ,{field: 'username', title: '原因', minWidth:100}
      ,{field: 'username', title: '医疗机构名称', minWidth:100}
      ,{field: 'username', title: '病案号', minWidth:100}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  table.render({
    elem: '#xy-health-history-medical'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,cols: [[
      {field: 'username', title: '药物名称', minWidth:100}
      ,{field: 'username', title: '用法', minWidth:100}
      ,{field: 'username', title: '用量', minWidth:100}
      ,{field: 'jointime', title: '用药时间', minWidth:100}
      ,{field: 'username', title: '<i class="layui-icon layui-icon-tips" lay-tips="规律 / 间断 / 不服药"></i> 服药依从性', minWidth:100}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });

  table.render({
    elem: '#xy-health-history-inoculation'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,cols: [[
      {field: 'username', title: '名称', minWidth:100}
      ,{field: 'jointime', title: '接种日期', minWidth:100}
      ,{field: 'username', title: '接种机构', minWidth:100}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
});