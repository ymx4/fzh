layui.define(['table', 'form', 'laytpl', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,laytpl = layui.laytpl
  ,common = layui.common;

  // --- list

  //用户管理
  table.render({
    elem: '#xy-health-manage'
    ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
    ,limit: common.constant.DEFAULT_PAGE_SIZE
    ,cols: [[
      {type: 'checkbox'}
      ,{field: 'id', title: '档案编号', minWidth:100, event:'detail', style:'cursor: pointer;'}
      ,{field: 'username', title: '姓名', minWidth:100, event:'detail', style:'cursor: pointer;'}
      ,{field: 'phone', title: '手机', minWidth:100}
      ,{field: 'sex', title: '性别', minWidth:100}
      ,{field: 'jointime', title: '时间', minWidth:100}
      ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-health', minWidth:70}
    ]]
    ,page: {layout:['prev', 'page', 'next', 'count']}
    ,text: '对不起，加载出现异常！'
  });
  
  //监听工具条
  table.on('tool(xy-health-manage)', function(obj){
    var data = obj.data;
    if(obj.event === 'detail'){
      parent.layui.index.openTabsPage('health/detail.html', data.username);
    }
  });

  // --- edit
  var pageType = 'detail';
  var testhisFlag = false;

  var init = {
    detail: function() {
      pageType = 'detail';

      laytpl(xy_detail.innerHTML).render({username: '测试'}, function(html){
        document.getElementById('xy_detail_container').innerHTML = html;
        renderTable();
      });
    },

    edit: function() {
      pageType = 'edit';
      renderTable();

      $('#health-weight, #health-height').on('input', function(){
        var weight = parseInt($('#health-weight').val());
        var height = parseInt($('#health-height').val());
        if (weight > 0 && height > 0) {
          var bmi = weight / Math.pow(height / 100, 2);
          $('#health-bmi').text(bmi.toFixed(1));
        } else {
          $('#health-bmi').text('体重 / 身高的平方');
        }
      });
      form.on('checkbox(xy-from-extra-input)', function(data){
        var curElem = $(data.elem);
        if (data.elem.checked) {
          curElem.parent().addClass('xy-form-extra');
          curElem.nextAll('.xy-form-extra-control:first').removeClass('layui-hide');
        } else {
          curElem.nextAll('.xy-form-extra-control:first').addClass('layui-hide');
          var hasExtra = false;
          curElem.parent().children('.xy-form-extra-control').each(function() {
            if (!$(this).hasClass('layui-hide')) {
              hasExtra = true;
              return false;
            }
          });
          if (!hasExtra) {
            curElem.parent().removeClass('xy-form-extra');
          }
        }
      });
      form.on('radio(xy-from-extra-input)', function(data){
        var curElem = $(data.elem);
        if ($(data.elem).data('show') == 1) {
          curElem.parent().addClass('xy-form-extra');
          curElem.nextAll('.xy-form-extra-control:first').removeClass('layui-hide');
        } else {
          curElem.parent().removeClass('xy-form-extra');
          curElem.nextAll('.xy-form-extra-control:first').addClass('layui-hide');
        }
      });
    }
  }

  var renderTable = function() {
    var cols = [
      {field: 'jointime', title: '入/出院日期', minWidth:100}
      ,{field: 'username', title: '原因', minWidth:100}
      ,{field: 'username', title: '医疗机构名称', minWidth:100}
      ,{field: 'username', title: '病案号', minWidth:100}
    ];
    if (pageType == 'edit') {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
    }
    table.render({
      elem: '#xy-health-history-person'
      ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
      ,limit: common.constant.DEFAULT_PAGE_SIZE
      ,cols: [cols]
      ,page: {layout:['prev', 'page', 'next', 'count']}
      ,text: '对不起，加载出现异常！'
    });

    var cols = [
      {field: 'jointime', title: '建/撤床日期', minWidth:100}
      ,{field: 'username', title: '原因', minWidth:100}
      ,{field: 'username', title: '医疗机构名称', minWidth:100}
      ,{field: 'username', title: '病案号', minWidth:100}
    ];
    if (pageType == 'edit') {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
    }
    table.render({
      elem: '#xy-health-history-family'
      ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
      ,limit: common.constant.DEFAULT_PAGE_SIZE
      ,cols: [cols]
      ,page: {layout:['prev', 'page', 'next', 'count']}
      ,text: '对不起，加载出现异常！'
    });

    var cols = [
      {field: 'username', title: '药物名称', minWidth:100}
      ,{field: 'username', title: '用法', minWidth:100}
      ,{field: 'username', title: '用量', minWidth:100}
      ,{field: 'jointime', title: '用药时间', minWidth:100}
      ,{field: 'username', title: '<i class="layui-icon layui-icon-tips" lay-tips="规律 / 间断 / 不服药"></i> 服药依从性', minWidth:100}
    ];
    if (pageType == 'edit') {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
    }
    table.render({
      elem: '#xy-health-history-medical'
      ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
      ,limit: common.constant.DEFAULT_PAGE_SIZE
      ,cols: [cols]
      ,page: {layout:['prev', 'page', 'next', 'count']}
      ,text: '对不起，加载出现异常！'
    });

    var cols = [
      {field: 'username', title: '名称', minWidth:100}
      ,{field: 'jointime', title: '接种日期', minWidth:100}
      ,{field: 'username', title: '接种机构', minWidth:100}
    ];
    if (pageType == 'edit') {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
    }
    table.render({
      elem: '#xy-health-history-inoculation'
      ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
      ,limit: common.constant.DEFAULT_PAGE_SIZE
      ,cols: [cols]
      ,page: {layout:['prev', 'page', 'next', 'count']}
      ,text: '对不起，加载出现异常！'
    });
  }

  $('#testhis').on('click', function(){
    var othis = $(this);
    var testhisTxt = $('#testhis-container').html();
    if (!testhisFlag) {
      testhisFlag = true;
      openHis('testhis-container', function() {
        table.render({
          elem: '#testhis-table'
          ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
          ,limit: common.constant.DEFAULT_PAGE_SIZE
          ,cols: [[
            {field: 'username', title: '名称', minWidth:100}
            ,{field: 'jointime', title: '接种日期', minWidth:100}
            ,{field: 'username', title: '接种机构', minWidth:100}
          ]]
          ,page: {layout:['prev', 'page', 'next', 'count']}
          ,text: '对不起，加载出现异常！'
        });
      });
    } else {
      openHis('testhis-container');
    }
  });

  var openHis = function(id, callback){
    layer.open({
      type:1,//类型
      area:['80%', '80%'],//定义宽和高
      title:'历史记录',//题目
      content: $('#' + id),//打开的内容
      success: function(){
        if (callback) {
          callback();
        }
      }
    });
  }

  exports('health', {init})
});