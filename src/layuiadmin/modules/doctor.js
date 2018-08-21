layui.define(['table', 'form', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common;

  //监听搜索
  form.on('submit(xy-doctor-search)', function(data){
    var field = data.field;
    
    //执行重载
    table.reload('xy-doctor-manage', {
      // url:'',
      where: field
    });
  });

  table.render({
    elem: '#xy-doctor-manage'
    ,url: layui.setter.api.GetUserList
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,method: 'post'
    ,contentType: 'application/json'
    ,where: {
      "KEY_WORD" : "",
      "UNIT_ID": common.user.UNIT_ID,
      "GROUP_ID": 0,
      "FAMILY_DOCTOR": 0,
      "SPECIALIST": 0
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
      {field: 'ID', title: '医生编号'}
      ,{field: 'REAL_NAME', title: '医生姓名'}
      ,{field: 'USER_NAME', title: '登录名'}
      ,{field: 'USER_STATUS', title: '账号状态'}
      ,{field: 'ROLE', title: '医生角色',templet: function(d){
        var r = '';
        if (d.FAMILY_DOCTOR == 1) {
          r += ' 家庭医生';
        }
        if (d.FAMILY_DOCTOR == 1) {
          r += ' 专科医生';
        }
        return $.trim(r);
      }}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-doctor'}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-doctor-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'del'){
      layer.confirm('确定要删除吗', function(index){
        obj.del();
        layer.close(index);
      });
    }
  });

  exports('doctor', {})
});