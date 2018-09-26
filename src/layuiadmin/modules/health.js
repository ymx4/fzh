layui.define(['table', 'form', 'laytpl', 'common', 'history'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,laytpl = layui.laytpl
  ,common = layui.common
  ,router = layui.router();

  var testhisFlag = false;

  var renderHisForm = function(item) {
    switch(item.Physical_Detail.INPUT_MODE) {
      case 1:
        var longProjectId = [27, 28, 29, 30];
        if (longProjectId.indexOf(item.Physical_Detail.PROJECT_ID) != -1) {
          item.Physical_Detail.longTitle = true;
        } else {
          item.Physical_Detail.longTitle = false;
        }
        var otherChecked = true;
        $.each(item.Project_ENUM_DATA_List, function(subIndex, subItem) {
          if (subItem.DATA_VALUE == 'OTHER_VALUE') {
            item.Physical_Detail.hasOther = true;
          }
          if (subItem.DATA_VALUE == item.Physical_Detail.DATA_VALUE) {
            otherChecked = false;
          }
        });
        if (item.Physical_Detail.hasOther && otherChecked && !common.empty(item.Physical_Detail.DATA_VALUE)) {
          item.Physical_Detail.INPUT_OTHER_VALUE = item.Physical_Detail.DATA_VALUE;
        } else {
          item.Physical_Detail.INPUT_OTHER_VALUE = '';
        }
        var html = laytpl('<label class="layui-form-label"{{#  if(d.Physical_Detail.longTitle){ }} style="width:220px;"{{#  } }}>\
          {{#  if(d.Physical_Detail.REMARK && d.Physical_Detail.REMARK != ""){ }}\
            <i class="layui-icon layui-icon-tips" lay-tips="{{d.Physical_Detail.REMARK}}"></i> \
          {{#  } }}{{d.Physical_Detail.CHINESE_NAME}}</label>\
          <div class="layui-input-block">\
            <input type="radio" name="hproject_{{d.Physical_Detail.PROJECT_ID}}"{{#  if(d.Physical_Detail.STATUS == 0){ }} checked{{#  } }} value="未检" title="未检" lay-filter="xy-form-extra-input">\
            {{#  layui.each(d.Project_ENUM_DATA_List, function(index, tplitem){ }}\
              {{#  if(tplitem.DATA_VALUE == "OTHER_VALUE"){ }}\
                <input type="radio" name="hproject_{{d.Physical_Detail.PROJECT_ID}}"{{#  if(d.Physical_Detail.INPUT_OTHER_VALUE != ""){ }} checked{{#  } }} value="{{tplitem.DATA_VALUE}}" title="{{tplitem.ENUM_VALUE}}" data-show="1" lay-filter="xy-form-extra-input">\
                <div class="xy-form-extra-control extra-control-other{{#  if(d.Physical_Detail.INPUT_OTHER_VALUE == ""){ }} layui-hide{{#  } }}">\
                  <input type="text" name="other_hproject_{{d.Physical_Detail.PROJECT_ID}}" value="{{d.Physical_Detail.INPUT_OTHER_VALUE}}" autocomplete="off" class="layui-input xy-form-unit">\
                </div>\
              {{#  } else if(d.Physical_Detail.hasOther) { }}\
                <input type="radio" name="hproject_{{d.Physical_Detail.PROJECT_ID}}"{{#  if (d.Physical_Detail.DATA_VALUE == tplitem.DATA_VALUE) { }} checked{{#  } }} value="{{tplitem.DATA_VALUE}}" title="{{tplitem.ENUM_VALUE}}" lay-filter="xy-form-extra-input">\
              {{#  } else { }}\
                <input type="radio" name="hproject_{{d.Physical_Detail.PROJECT_ID}}"{{#  if (d.Physical_Detail.DATA_VALUE == tplitem.DATA_VALUE) { }} checked{{#  } }} value="{{tplitem.DATA_VALUE}}" title="{{tplitem.ENUM_VALUE}}">\
              {{#  } }}\
            {{#  }); }}\
          </div>').render(item);
        $('#hproject_' + item.Physical_Detail.PROJECT_ID).html(html);
        break;
      case 2:
        var defaultProjectId = [122, 123];
        if (defaultProjectId.indexOf(item.Physical_Detail.PROJECT_ID) != -1) {
          item.Physical_Detail.hasDefault = false;
        } else {
          item.Physical_Detail.hasDefault = true;
        }
        if (!common.empty(item.Physical_Detail.DATA_VALUE)) {
          if (item.Physical_Detail.DATA_VALUE.indexOf('|') != -1) {
            var arrValue = item.Physical_Detail.DATA_VALUE.split('|');
            item.Physical_Detail.DATA_VALUE = arrValue[0] == '' ? [] : arrValue[0].split(',');
            item.Physical_Detail.INPUT_OTHER_VALUE = arrValue[1];
          } else {
            item.Physical_Detail.DATA_VALUE = item.Physical_Detail.DATA_VALUE.split(',');
            item.Physical_Detail.INPUT_OTHER_VALUE = '';
          }
        } else {
          item.Physical_Detail.DATA_VALUE = [];
          item.Physical_Detail.INPUT_OTHER_VALUE = '';
        }
        var html = laytpl('<label class="layui-form-label">{{d.Physical_Detail.CHINESE_NAME}}</label>\
          <div class="layui-input-block">\
            {{#  if(d.Physical_Detail.hasDefault){ }}\
            <input type="checkbox" name="hproject_{{d.Physical_Detail.PROJECT_ID}}" lay-skin="primary"{{#  if(d.Physical_Detail.STATUS == 0){ }} checked{{#  } }} value="未检" title="未检" lay-filter="xy-form-extra-input">\
            {{#  } }}\
            {{#  layui.each(d.Project_ENUM_DATA_List, function(index, tplitem){ }}\
              {{#  if(tplitem.DATA_VALUE == "OTHER_VALUE"){ }}\
                <input type="checkbox" name="hproject_{{d.Physical_Detail.PROJECT_ID}}" lay-skin="primary"{{#  if(d.Physical_Detail.INPUT_OTHER_VALUE != ""){ }} checked{{#  } }} value="{{tplitem.DATA_VALUE}}" title="{{tplitem.ENUM_VALUE}}" lay-filter="xy-form-extra-input">\
                <div class="xy-form-extra-control extra-control-other{{#  if(d.Physical_Detail.INPUT_OTHER_VALUE == ""){ }} layui-hide{{#  } }}">\
                  <input type="text" name="other_hproject_{{d.Physical_Detail.PROJECT_ID}}" value="{{d.Physical_Detail.INPUT_OTHER_VALUE}}" autocomplete="off" class="layui-input xy-form-unit">\
                </div>\
              {{#  } else { }}\
                <input type="checkbox" name="hproject_{{d.Physical_Detail.PROJECT_ID}}" lay-skin="primary"{{#  if (d.Physical_Detail.DATA_VALUE.indexOf(tplitem.DATA_VALUE) != -1) { }} checked{{#  } }} value="{{tplitem.DATA_VALUE}}" title="{{tplitem.ENUM_VALUE}}" lay-filter="xy-form-extra-check">\
              {{#  } }}\
            {{#  }); }}\
          </div>').render(item);
        $('#hproject_' + item.Physical_Detail.PROJECT_ID).html(html);
        break;
      default:
        break;
    }
  };

  var init = {
    list: function() {
      form.val('xy-health-search-form', {
        CREATE_UNIT_ID: common.user.UNIT_ID
        ,UNIT_NAME: common.user.UNIT_NAME
        ,CREATE_USER_ID: common.user.ID
        ,REAL_NAME: common.user.REAL_NAME
      });
      common.xyRender({
        elem: '#xy-health-manage'
        ,url: layui.setter.api.GetPhysicalExaminationList
        ,where: {
          "KEY_WORD" : "",
          "UNIT_ID": common.user.UNIT_ID,
          "ALL_UNIT": 1,
          "USER_ID": common.user.ID
        }
        ,cols: [[
          {field: 'PHYSICAL_EXAMINATION_NO', title: '档案编号', minWidth:100, event:'detail'}
          ,{field: 'CLIENT_REAL_NAME', title: '姓名', minWidth:100, event:'detail'}
          ,{field: 'SEX_VALUE', title: '性别', minWidth:100, event:'detail'}
          ,{field: 'CREATE_TIME', title: '建档时间', minWidth:100, event:'detail'}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-health', minWidth:230}
        ]]
      });

      //监听搜索
      form.on('submit(xy-health-search)', function(data){
        var field = data.field;
        delete field.UNIT_NAME;
        delete field.REAL_NAME;
        //执行重载
        common.xyReload('xy-health-manage', {
          where: field
        });
      });
      
      //监听工具条
      table.on('tool(xy-health-manage)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
          layer.confirm('确定要删除吗', function(index){
            common.req({
              url: layui.setter.api.DeletePhysicalExamination
              ,data: {ID: obj.data.ID}
              ,success: function(data){
                obj.del();
                layer.close(index);
              }
            });
          });
        } else if (obj.event === 'detail') {
          parent.layui.index.openTabsPage('health/detail.html#/id=' + obj.data.ID + '/clientId=' + obj.data.CLIENT_ID, '查看档案-' + obj.data.CLIENT_REAL_NAME);
        }
      });
    }
    ,detail: function() {
      var curId = router.search.clientId;
      var healthId = router.search.id;
      var showHistory = ['hospital', 'familyHospital', 'medicine', 'inoculate'];

      var historySort = layui.history.historySort;
      var renderHistory = layui.history.renderHistory;

      var formData = {};

      common.req({
        url: layui.setter.api.GetClientInfo
        ,data: {
          CLIENT_ID: curId
        }
        ,success: $.proxy(function(clientData){
          laytpl(clientContainer.innerHTML).render({clientData: clientData.data}, function(html){
            $('.layui-fluid').prepend(html);
          });
        })
      });

      common.req({
        url: layui.setter.api.GetPhysicalExaminationInfo
        ,data: {
          ID: healthId
        }
        ,success: $.proxy(function(examData) {
          $.each(examData.data, function(hIndex, item) {
            if (item.Physical_Detail.STATUS == 0) {
              item.Physical_Detail.DATA_VALUE = '未检';
            } else if (common.empty(item.Physical_Detail.DATA_VALUE)) {
              item.Physical_Detail.DATA_VALUE = '无';
            } else if (item.Physical_Detail.INPUT_MODE == 2) {
              item.Physical_Detail.DATA_VALUE = item.Physical_Detail.DATA_VALUE.replace(/^\|/, '').replace(/\|/, ' ');
            }
            formData['hproject_' + item.Physical_Detail.PROJECT_ID] = item.Physical_Detail;
          });
          laytpl(detailContainer.innerHTML).render({formData: formData}, function(html){
            $('.layui-fluid').append(html);

            common.xyRender({
              elem: '#xy-equipment'
              ,url: layui.setter.api.GetDataFormClientID
              ,where: {
                "CLIENT_ID": curId
                ,"ID_NUMBER": ''
                ,"SATRT_DATE": ''
                ,"END_DATE": ''
              }
              ,cols: [[
                {field: 'RECEIVE_TIME', title: '接收时间'}
                ,{field: 'CHINESE_NAME', title: '项目名称'}
                ,{field: 'RECEIVE_DATA', title: '接收数据'}
                ,{field: 'UNIT_NAME', title: '单位'}
                ,{field: 'ABNORMAL', title: '异常'}
                ,{field: 'STANDARD_RANGE', title: '参考范围',templet: function(d){
                  if (d.STANDARD_MAX_VALUE) {
                    return d.STANDARD_MIX_VALUE + ' - ' + d.STANDARD_MAX_VALUE;
                  } else {
                    return d.STANDARD_MIX_VALUE;
                  }
                }}
                ,{field: 'USED', title: '是否使用',templet: function(d){
                  return d.USED == 1 ? '已使用' : '未使用';
                }}
              ]]
            });

            $.each(showHistory, function(hIndex, item) {
              renderHistory[item].call(this, {
                "CLIENT_ID" : curId,
                "HISTORY_SORT_ID": historySort[item].id
              });
            });
          });
        }, this)
      });
    }
    ,edit: function() {
      if (router.search.id) {
        var curId = router.search.clientId;
        var healthId = router.search.id;
      } else {
        common.req({
          url: layui.setter.api.NewPhysicalExamination
          ,data: {
            CLIENT_ID: router.search.clientId
            ,PACKAGE_ID: 1
          }
          ,success: $.proxy(function(data) {
            var topLayui = top.layui;
            var index = topLayui.admin.tabsPage.index;
            topLayui.index.openTabsPage('health/edit.html#/id=' + data.message + '/clientId=' + router.search.clientId, '公共卫生-' + decodeURIComponent(router.search.REAL_NAME));
            topLayui.common.closeTab(index);
          }, this)
        });
        return;
      }
      
      var showHistory = ['hospital', 'familyHospital', 'medicine', 'inoculate'];

      var historySort = layui.history.historySort;
      var renderHistory = layui.history.renderHistory;

      var formData = {};

      common.req({
        url: layui.setter.api.GetClientInfo
        ,data: {
          CLIENT_ID: curId
        }
        ,success: $.proxy(function(clientData){
          laytpl(clientContainer.innerHTML).render({clientData: clientData.data}, function(html){
            $('.layui-fluid').prepend(html);
          });
        })
      });

      common.req({
        url: layui.setter.api.GetPhysicalExaminationInfo
        ,data: {
          ID: healthId
        }
        ,success: $.proxy(function(examData) {
          var arrInputMode = [1, 2];
          $.each(examData.data, function(hIndex, item) {
            formData['hproject_' + item.Physical_Detail.PROJECT_ID] = item;
          });
          laytpl(formContainer.innerHTML).render({formData: formData}, function(html){
            $('.layui-fluid').append(html);
            var inputData = {};
            $.each(formData, function(hIndex, item) {
              if (arrInputMode.indexOf(item.Physical_Detail.INPUT_MODE) != -1) {
                renderHisForm(item);
              } else {
                inputData['hproject_' + item.Physical_Detail.PROJECT_ID] = item.Physical_Detail.DATA_VALUE;
              }
            });

            $('#bmiDiv').text(inputData['hproject_25'] ? inputData['hproject_25'] : '');
            $('#hproject_29 .layui-input-block').append('<div class="xy-form-extra-control">\
                <div class="layui-form-mid">简易智力状态检查，总分</div>\
                <input type="text" name="hproject_129" autocomplete="off" class="layui-input xy-form-unit" style="width: 100px;">\
              </div>');
            $('#hproject_30 .layui-input-block').append('<div class="xy-form-extra-control">\
                <div class="layui-form-mid">老年人抑郁评分检查，总分</div>\
                <input type="text" name="hproject_128" autocomplete="off" class="layui-input xy-form-unit" style="width: 100px;">\
              </div>');
            $('#hproject_41 .layui-input-block').find(':radio[title="已戒酒"]').after('<div class="xy-form-extra-control">\
                <div class="layui-form-mid">戒酒年龄</div>\
                <input type="text" name="hproject_130" autocomplete="off" class="layui-input xy-form-unit" style="width: 100px;">\
              </div>');
            $('#hproject_46 .layui-input-block').find(':radio[title="有"]').after('<div class="xy-form-extra-control">\
                <div class="layui-form-mid">工种</div>\
                <input type="text" name="hproject_131" autocomplete="off" class="layui-input xy-form-unit" style="width: 100px;">\
                <div class="layui-form-mid">从业时间</div>\
                <input type="text" name="hproject_132" autocomplete="off" class="layui-input xy-form-unit" style="width: 100px;">\
                <div class="layui-form-mid">年</div>\
              </div>');
            $('#hproject_123 .layui-input-block').find(':checkbox[title="减体重"]').after('<div class="xy-form-extra-control">\
                （<div class="layui-form-mid">目标</div>\
                  <input type="text" name="hproject_134" autocomplete="off" class="layui-input xy-form-unit" style="width: 100px;">\
                  <div class="layui-form-mid">kg</div>）\
              </div>');

            form.val('xy-health-form', inputData);
            form.render();
          
            common.xyRender({
              elem: '#xy-equipment'
              ,url: layui.setter.api.GetDataFormClientID
              ,where: {
                "CLIENT_ID": curId
                ,"ID_NUMBER": ''
                ,"SATRT_DATE": ''
                ,"END_DATE": ''
              }
              ,cols: [[
                {field: 'RECEIVE_TIME', title: '接收时间'}
                ,{field: 'CHINESE_NAME', title: '项目名称'}
                ,{field: 'RECEIVE_DATA', title: '接收数据'}
                ,{field: 'UNIT_NAME', title: '单位'}
                ,{field: 'ABNORMAL', title: '异常'}
                ,{field: 'STANDARD_RANGE', title: '参考范围',templet: function(d){
                  if (d.STANDARD_MAX_VALUE) {
                    return d.STANDARD_MIX_VALUE + ' - ' + d.STANDARD_MAX_VALUE;
                  } else {
                    return d.STANDARD_MIX_VALUE;
                  }
                }}
                ,{field: 'USED', title: '是否使用',templet: function(d){
                  return d.USED == 1 ? '已使用' : '未使用';
                }}
              ]]
            });

            $.each(showHistory, function(hIndex, item) {
              renderHistory[item].call(this, {
                "CLIENT_ID" : curId,
                "HISTORY_SORT_ID": historySort[item].id
              });
            });

            $('input[name="hproject_24"],input[name="hproject_23"]').on('input', function(){
              var weight = parseInt($('input[name="hproject_24"]').val());
              var height = parseInt($('input[name="hproject_23"]').val());
              if (weight > 0 && height > 0) {
                var bmi = weight / height / height * 10000;
                bmi = bmi.toFixed(1);
                $('#bmiDiv').text(bmi);
                $('input[name="hproject_25"]').val(bmi);
              }
            });
          });

          form.on('submit(xy-health-submit)', function(sdata){
            var submitData = [];
            $("#healthForm input:checkbox:checked").each(function() {
              var formKey = $(this).attr('name');
              if (!sdata.field[formKey] || sdata.field[formKey].indexOf(',') == -1) {
                sdata.field[formKey] = '';
              }

              if ($(this).val() == '未检' || $(this).val() == 'OTHER_VALUE') {
                return true;
              }
              sdata.field[formKey] += $(this).val() + ',';
            });
            $("#healthForm input:radio:checked").each(function() {
              var formKey = $(this).attr('name');
              if (!sdata.field[formKey] || $(this).val() == '未检' || $(this).val() == 'OTHER_VALUE') {
                sdata.field[formKey] = '';
              }
            });

            $.each(formData, function(hIndex, item) {
              if (item.Physical_Detail.INPUT_MODE == 2) {
                if (!sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID]) {
                  sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID] = '';
                }
                if (sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID] != '') {
                  sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID] = sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID].substr(0, sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID].length - 1);
                }
               if (!common.empty(sdata.field['other_hproject_' + item.Physical_Detail.PROJECT_ID])) {
                  sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID] += '|' + sdata.field['other_hproject_' + item.Physical_Detail.PROJECT_ID];
                }
              } else if (item.Physical_Detail.INPUT_MODE == 1) {
                if (!sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID]) {
                  sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID] = '';
                }
                if (!common.empty(sdata.field['other_hproject_' + item.Physical_Detail.PROJECT_ID])) {
                  sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID] = sdata.field['other_hproject_' + item.Physical_Detail.PROJECT_ID];
                }
              }
              submitData.push({
                ID: item.Physical_Detail.ID
                ,PROJECT_ID: item.Physical_Detail.PROJECT_ID
                ,PHYSICAL_EXAMINATION_ID: item.Physical_Detail.PHYSICAL_EXAMINATION_ID
                ,DATA_VALUE: sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID]
                ,status: sdata.field['hproject_' + item.Physical_Detail.PROJECT_ID] == '' ? 0 : 1
              });
            });

            common.req({
              url: layui.setter.api.SavePhysicalExaminationData
              ,formerror: true
              ,data: submitData
              ,success: function(data){
                layer.msg('操作成功', function() {
                  // common.saveSuccess('health/list.html');
                });
              }
            });
            return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
          });
        }, this)
      });

      form.on('checkbox(xy-form-extra-input)', function(data){
        var curElem = $(data.elem);
        if (curElem.attr('title') == '未检') {
          if (data.elem.checked) {
            curElem.nextAll(':checkbox').prop("checked", false);
            form.render('checkbox');
            curElem.nextAll('.extra-control-other').addClass('layui-hide');
            curElem.nextAll('.xy-form-extra-control').find('input').val('');
          }
        } else {
          if (data.elem.checked) {
            if ($(data.elem).siblings(':checkbox[title="未检"]').length > 0) {
              $(data.elem).siblings(':checkbox[title="未检"]').prop("checked", false);
              form.render('checkbox');
            }
            curElem.nextAll('.xy-form-extra-control:first').removeClass('layui-hide');
          } else {
            curElem.nextAll('.xy-form-extra-control:first').addClass('layui-hide').find('input').val('');
          }
        }
      });
      form.on('checkbox(xy-form-extra-check)', function(data){
        if (data.elem.checked) {
          if ($(data.elem).siblings(':checkbox[title="未检"]').length > 0) {
            $(data.elem).siblings(':checkbox[title="未检"]').prop("checked", false);
            form.render('checkbox');
          }
        }
      });
      form.on('radio(xy-form-extra-input)', function(data){
        var curElem = $(data.elem);
        if ($(data.elem).data('show') == 1) {
          curElem.nextAll('.xy-form-extra-control:first').removeClass('layui-hide');
        } else {
          curElem.nextAll('.xy-form-extra-control:first').addClass('layui-hide').find('input').val('');
        }
      });
    }
  }

  $('#testhis').on('click', function(){
    var othis = $(this);
    var testhisTxt = $('#testhis-container').html();
    if (!testhisFlag) {
      testhisFlag = true;
      openHis('testhis-container', function() {
        common.xyRender({
          elem: '#testhis-table'
          ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
          ,cols: [[
            {field: 'username', title: '名称', minWidth:100}
            ,{field: 'jointime', title: '接种日期', minWidth:100}
            ,{field: 'username', title: '接种机构', minWidth:100}
          ]]
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