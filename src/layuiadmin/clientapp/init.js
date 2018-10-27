layui.define(['table', 'form', 'common', 'laydate', 'laytpl', 'element', 'flow', 'history'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,common = layui.common
  ,laydate = layui.laydate
  ,laytpl = layui.laytpl
  ,element = layui.element
  ,flow = layui.flow
  ,history = layui.history
  ,router = layui.router();

  var init = {
    messageList: function() {
      $('#sendmsg').data('name', common.user.MANAGE_REAL_NAME);
      flow.load({
        elem: '#messageContainer'
        ,done: function(page, next) {
          common.req({
            url: layui.setter.api.Client.ClientMessageList
            ,data: {READ_STATE: 2}
            ,disableLoad: true
            ,success: function(data){
              laytpl(messageTpl.innerHTML).render({
                messageList: data.data
              }, function(html){
                next(html, data.message > layui.setter.pageSize * page);
              });
            }
          });
        }
      });
    }
    ,send: function() {console.log(router.search)
      if (router.search.DOCTOR_NAME) {
        $('#RECEIVE_USER').text(decodeURIComponent(router.search.DOCTOR_NAME));
        form.on('submit(xy-message-submit)', function(data){
          common.req({
            url: layui.setter.api.Client.ClientSendMessage
            ,formerror: true
            ,data: data.field
            ,success: function(data){
              layer.msg('操作成功', function() {
                common.closeParent();
              });
            }
          });
          return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
      }
    }
    ,profile: function() {
      var clientuser = common.user;
      Object.keys(clientuser).forEach(function(key){
        if (clientuser[key] == null) {
          clientuser[key] = '';
        }
      });
      laytpl(xy_resident_detail.innerHTML).render(clientuser, function(html){
        document.getElementById('xy_resident_view').innerHTML = html;
        if (clientuser.FACE_FILE_NAME) {
          $('#xy-resident-avatar-img').attr('src', common.getImageUrl(clientuser.FACE_FILE_NAME));
        }
        if (clientuser.ID_NUMBER_FILE_NAME) {
          $('#xy-resident-identity-img').attr('src', common.getImageUrl(clientuser.ID_NUMBER_FILE_NAME));
        }
        previewImg();
      });
      listenHistory(clientuser.ID);
      // history
      laytpl(historyContainer.innerHTML).render({
        edit:1,
        historySort: layui.history.historySort,
        healthSort: layui.history.healthSort,
        equipmentSort: layui.history.equipmentSort
      }, function(html){
        $('.resident-form').after(html);
        renderHealth(clientuser.ID, false);
        element.render('collapse');
      });
    }
    ,equipment: function() {
      laytpl(xy_equipment_detail.innerHTML).render(common.user, function(html){
        document.getElementById('xy_equipment_view').innerHTML = html;
      });

      form.on('submit(xy-equipment-submit)', function(data){
        alert('submit')
        // common.req({
        //   url: layui.setter.api.Client.
        //   ,formerror: true
        //   ,data: data.field
        //   ,success: function(data){
        //     layer.msg('操作成功', function() {
        //     });
        //   }
        // });
        return false;
      });
    }
    ,doctor: function() {
      var clientuser = common.user;
      Object.keys(clientuser).forEach(function(key){
        if (clientuser[key] == null) {
          clientuser[key] = '';
        }
      });
      laytpl(xy_doctor_detail.innerHTML).render(clientuser, function(html){
        document.getElementById('xy_doctor_view').innerHTML = html;
      });
    }
    ,healthDetail: function() {
      var curId = router.search.clientId;
      var healthId = router.search.id;

      var formData = {};

      common.req({
        url: layui.setter.api.Client.GetPhysicalExaminationInfo
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
          laytpl(detailContainer.innerHTML).render({formData: formData, equipmentSort: layui.history.equipmentSort}, function(html){
            $('.layui-fluid').append(html);

            showHistory(curId);
            element.render('collapse');
          });
        }, this)
      });
    }
    ,diagnoseDetail: function() {
      common.req({
        url: layui.setter.api.Client.GetDiagnoseInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_diagnose_detail.innerHTML).render(data.data, function(html){
            document.getElementById('xy_diagnose_detail_container').innerHTML = html;
          });
        }, this)
      });
    }
    ,consultationDetail: function() {
      common.req({
        url: layui.setter.api.Client.GetConsultationInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_consultation_form.innerHTML).render(data.data, function(html) {
            document.getElementById('xy_consultation_container').innerHTML = html;
          });
        }, this)
      });
    }
    ,arrangeDetail: function() {
      common.req({
        url: layui.setter.api.Client.GetArrangeInfo
        ,data: {
          ID: router.search.id
        }
        ,success: $.proxy(function(data){
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          laytpl(xy_arrange_form.innerHTML).render(data.data, function(html) {
            document.getElementById('xy_arrange_container').innerHTML = html;
          });
        }, this)
      });
    }
  }

  var showHistory = function(clientId) {
    var showHistory = ['hospital', 'familyHospital', 'medicine', 'inoculate'];

    var historySort = layui.history.historySort;
    var renderHistory = layui.history.renderHistory;
    var renderEquipment = layui.history.renderEquipment;

    $.each(showHistory, function(hIndex, item) {
      renderHistory[item].call(this, {
        "CLIENT_ID" : clientId,
        "HISTORY_SORT_ID": historySort[item].id
      });
    });
    element.on('collapse(collapse-equipment)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderEquipment(clientId, type);
      }
    });
  }

  var renderHealth = function(cliendId, edit) {
    //公共卫生
    var cols = [
      {field: 'PHYSICAL_EXAMINATION_NO', title: '档案编号', event:'detail'}
      ,{field: 'CLIENT_REAL_NAME', title: '姓名', event:'detail'}
      ,{field: 'SEX_VALUE', title: '性别', event:'detail'}
      ,{field: 'CREATE_TIME', title: '建档时间', event:'detail'}
    ];
    if (edit) {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-health-ope'});
    }
    common.xyRender({
      elem: '#xy-history-health'
      ,url: layui.setter.api.Client.GetPhysicalExaminationList
      ,page: false
      ,where: {
        "CLIENT_ID": cliendId,
        "CREATE_UNIT_ID": 0,
        "CREATE_USER_ID": 0,
        "KEY_WORD" : "",
        "ALL_UNIT": 1,
      }
      ,cols: [cols]
    });
    table.on('tool(xy-history-health)', function(obj){
      var data = obj.data;
      if (obj.event === 'detail') {
        location.href = layui.setter.baseUrl + 'clientapp/health_detail.html#/id=' + obj.data.ID + '/clientId=' + obj.data.CLIENT_ID + '/adapter=clientapp';
      }
    });
  }

  var listenHistory = function(clientId) {
    var historySort = layui.history.historySort;
    var healthSort = layui.history.healthSort;
    var renderHistory = layui.history.renderHistory;
    var renderEquipment = layui.history.renderEquipment;
    element.on('collapse(collapse-history)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderHistory[type].call(this, {
          "CLIENT_ID" : clientId,
          "HISTORY_SORT_ID": historySort[type].id
        });
      }
    });
    element.on('collapse(collapse-health)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderHistory[type].call(this, {
          "CLIENT_ID" : clientId
        });
      }
    });
    element.on('collapse(collapse-equipment)', function(collData){
      if (collData.show && !collData.title.attr('data-init')) {
        collData.title.attr('data-init', 1);
        var type = collData.title.attr('data-type');
        renderEquipment(clientId, type);
      }
    });
  }

  var previewImg = function(){
    $('#xy-resident-avatar-img,#xy-resident-identity-img').click(function() {
      var src = $(this).attr('src');
      if (!common.empty(src)) {
        layer.photos({
          photos: {
            "title": "预览",
            "data": [
              {
                "alt": "预览",
                "src": src
              }
            ]
          }
          ,anim: 5
        });
      }
    });
  }

  exports('init', init)
});
