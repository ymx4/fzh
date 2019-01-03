layui.define(['table', 'form', 'element', 'upload', 'laydate', 'laytpl', 'common', 'history', 'dropdown'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,element = layui.element
  ,laydate = layui.laydate
  ,upload = layui.upload
  ,laytpl = layui.laytpl
  ,common = layui.common
  ,router = layui.router();

  var renderHealth = function(clientId, edit) {
    var renderHistory = layui.history.renderHistory;
    renderHistory.pinggu({"CLIENT_ID" : clientId});
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
      ,url: layui.setter.api.GetPhysicalExaminationList
      ,page: false
      ,where: {
        "CLIENT_ID": clientId,
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
        parent.layui.index.openTabsPage('health/detail.html#/id=' + obj.data.ID + '/clientId=' + obj.data.CLIENT_ID, '查看档案-' + obj.data.CLIENT_REAL_NAME);
      }
    });
    common.xyRender({
      elem: '#xy-history-eqdc'
      ,url: layui.setter.api.GetDCList
      ,page: false
      ,where: {
        "CLIENT_ID": clientId
      }
      ,cols: [[
        {field: 'CREATE_TIME', title: '建立时间', event:'detail'}
        ,{field: 'REAL_NAME', title: '检测医生', event:'detail'}
      ]]
    });
    table.on('tool(xy-history-eqdc)', function(obj){
      var data = obj.data;
      if (obj.event === 'detail') {
        layer.open({
          type: 1,
          area:['90%', '90%'],
          content: '<div id="eqdcDetail"></div>',
          title: '生理多参详情'
        });
        if (data.ECG_DATA) {
          data.ECG_IMG = getECGImg(data.ID);
        }
        layui.view('eqdcDetail').render('resident/eqdc', data).done(function(){
          var src = $('.xy-ecg-img').attr('src');
          if (!common.empty(src)) {
          }
        });
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

  var renderResident = function(where) {
    var cols = [
      {field: 'REAL_NAME', title: '姓名', event:'detail'}
      ,{field: 'SEX_VALUE', title: '性别', event:'detail'}
      ,{field: 'BIRTHDAY', title: '出生日期', event:'detail', templet: function(d){
        return common.empty(d.BIRTHDAY) ? '' : d.BIRTHDAY.replace(/00:00:00/, '');
      }}
      ,{field: 'ID_NUMBER', title: '身份证号', event:'detail'}
      ,{field: 'MANAGE_REAL_NAME', title: '签约医生', event:'detail'}
      ,{field: 'EMPHASIS_CAUSE', title: '重点人群', event:'detail', templet: function(d){
        return common.empty(d.EMPHASIS_CAUSE) ? '非重点人群' : d.EMPHASIS_CAUSE;
      }}
      ,{field: 'CREATE_TIME', title: '建档时间', event:'detail'}
    ];
    if (router.search.t == 'l') {
      cols.push({field: 'MANAGE_UNIT_NAME', title: '管理单位', event:'detail'});
    } else {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230});
    }
    common.xyRender({
      elem: '#xy-resident-manage'
      ,url: layui.setter.api.SearchClient
      ,where: where
      ,cols: [cols]
      ,parseData: function(res){
        if (res.data && res.data.length) {
          $.each(res.data, function(i, item){
            res.data[i].loginUser = {
              ID: common.user.ID,
              REAL_NAME: common.user.REAL_NAME,
              token: common.user.token
            };
          });
        }
        return res;
      }
      ,done: function() {
        layui.dropdown.render();
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

  var getECGImg = function (id) {
    if (common.user && common.user.token){
      return layui.setter.api.ShowECG + '?id=' + id + '&token=' + common.user.token;
    } else {
      return layui.setter.api.ShowECG + '?id=' + id;
    }
  }

  var init = {
    list: function() {
      if (router.search.t == 's') {
        //本单位
        laytpl(searchTpl.innerHTML).render({t: router.search.t}, function(html){
          $('#searchContainer').after(html);
          renderResident({
            "KEY_WORD" : "",
            "UNIT_ID": common.user.UNIT_ID,
            "CHILDREN_UNIT": 0,
            "USER_ID": router.search.u
          });
        });
      } else if (router.search.t == 'l') {
        //下级
        laytpl(searchTpl.innerHTML).render({t: router.search.t}, function(html){
          $('#searchContainer').after(html);
          form.val('xy-resident-search-form', {
            UNIT_ID: common.user.UNIT_ID
            ,UNIT_NAME: common.user.UNIT_NAME
          });
          renderResident({
            "KEY_WORD" : "",
            "UNIT_ID": common.user.UNIT_ID,
            "CHILDREN_UNIT": 1,
            "USER_ID": router.search.u
          });
        });
      } else {
        //我的客户
        laytpl(searchTpl.innerHTML).render({t: router.search.t}, function(html){
          $('#searchContainer').after(html);
          renderResident({
            "KEY_WORD" : "",
            "UNIT_ID": common.user.UNIT_ID,
            "CHILDREN_UNIT": 0,
            "USER_ID": common.user.ID
          });
        });
      }

      //监听搜索
      form.on('submit(xy-resident-search)', function(data){
        var field = data.field;
        delete field.UNIT_NAME;
        delete field.REAL_NAME;
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
        } else if (obj.event === 'detail') {
          parent.layui.index.openTabsPage('resident/detail.html#/id=' + obj.data.ID, '查看-' + data.REAL_NAME);
        } else if (obj.event === 'pinggu') {
          common.req({
            url: layui.setter.api.GetPingGu
            ,data: {CLIENT_ID: obj.data.ID}
            ,success: function(res){
              top.layui.index.openTabsPage(res.data, '评估-' + data.REAL_NAME);
            }
          });
        }
      });
    }
    ,detail: function() {
      common.req({
        url: layui.setter.api.GetClientInfo
        ,data: {
          CLIENT_ID: router.search.id
        }
        ,success: $.proxy(function(data){
          Object.keys(data.data).forEach(function(key){
            if (data.data[key] == null) {
              data.data[key] = '';
            }
          });
          data.data.EMPHASIS_CAUSE = common.empty(data.data.EMPHASIS_CAUSE) ? '非重点人群' : data.data.EMPHASIS_CAUSE;
          laytpl(xy_resident_detail.innerHTML).render(data.data, function(html){
            document.getElementById('xy_resident_view').innerHTML = html;
            if (data.data.FACE_FILE_NAME) {
              $('#xy-resident-avatar-img').attr('src', common.getImageUrl(data.data.FACE_FILE_NAME));
            }
            if (data.data.ID_NUMBER_FILE_NAME) {
              $('#xy-resident-identity-img').attr('src', common.getImageUrl(data.data.ID_NUMBER_FILE_NAME));
            }
            previewImg();
          });
          listenHistory(data.data.ID);
          // history
          laytpl(historyContainer.innerHTML).render({
            edit:1,
            historySort: layui.history.historySort,
            healthSort: layui.history.healthSort,
            equipmentSort: layui.history.equipmentSort
          }, function(html){
            $('.resident-form').after(html);
            renderHealth(data.data.ID, false);
            element.render('collapse');
          });
        }, this)
      });
    }
    ,edit: function() {
      common.user.pageType = 'edit';

      if (router.search.id) {
        common.req({
          url: layui.setter.api.GetClientInfo
          ,data: {
            CLIENT_ID: router.search.id
          }
          ,success: $.proxy(function(data){
            data.data.BIRTHDAY = data.data.BIRTHDAY ? data.data.BIRTHDAY.substring(0, 10) : '';
            form.val('xy-resident-form', data.data);
            $('#CREATE_USER_ID_V').text(data.data.DOCTOR_REAL_NAME);
            $('#UNIT_ID_V').text(data.data.UNIT_NAME);
            laydate.render({
              elem: '#CREATE_TIME'
              ,format: layui.setter.dateFormat.day
              ,value: data.data.CREATE_TIME ? data.data.CREATE_TIME.substring(0, 10) : ''
            });
            if (data.data.FACE_FILE_NAME) {
              $('#xy-resident-avatar-img').attr('src', common.getImageUrl(data.data.FACE_FILE_NAME));
            }
            if (data.data.ID_NUMBER_FILE_NAME) {
              $('#xy-resident-identity-img').attr('src', common.getImageUrl(data.data.ID_NUMBER_FILE_NAME));
            }
            previewImg();
            $('select[name="SEX"]').attr('data-val', data.data.SEX);
            $('select[name="MARRIAGE"]').attr('data-val', data.data.MARRIAGE);
            $('select[name="DWELL_TYPE"]').attr('data-val', data.data.DWELL_TYPE);
            $('select[name="NATION"]').attr('data-val', data.data.NATION);
            $('select[name="EDUCATION"]').attr('data-val', data.data.EDUCATION);
            $('select[name="OCCUPATION"]').attr('data-val', data.data.OCCUPATION);
            $('select[name="PAYMENT"]').attr('data-val', data.data.PAYMENT);
            $('select[name="POVERTY_ID"]').attr('data-val', data.data.POVERTY_ID);
            $('#ELEM_EMPHASIS_CAUSE').attr('data-val', data.data.EMPHASIS_CAUSE);
            $('select[name="BLOOD_TYPE"]').attr('data-val', data.data.BLOOD_TYPE);
            $('select[name="BLOOD_RH_TYPE"]').attr('data-val', data.data.BLOOD_RH_TYPE);
            $('select[name="SHHJ_RLLX_ID"]').attr('data-val', data.data.SHHJ_RLLX_ID);
            $('select[name="SHHJ_YS_ID"]').attr('data-val', data.data.SHHJ_YS_ID);
            $('select[name="SHHJ_CS_ID"]').attr('data-val', data.data.SHHJ_CS_ID);
            $('select[name="SHHJ_QXL_ID"]').attr('data-val', data.data.SHHJ_QXL_ID);
            $('select[name="SHHJ_CFPFSS_ID"]').attr('data-val', data.data.SHHJ_CFPFSS_ID);
            common.initConfig();
            common.initArea({default: data.data.HOME_ADDRESS_AREA_ID, elem: '#home_address_area_container'});
            common.initArea({default: data.data.ADDRESS_AREA_ID, elem: '#address_area_container'});

            $('#bmiDiv').text(data.data.BMI ? data.data.BMI : '');

            listenHistory(data.data.ID);
            var historySort = layui.history.historySort;
            var renderHistory = layui.history.renderHistory;
            // history
            laytpl(historyContainer.innerHTML).render({
              edit:1,
              historySort: historySort,
              healthSort: layui.history.healthSort,
              equipmentSort: layui.history.equipmentSort,
              client: data.data
            }, function(html){
              $('.resident-form').after(html);

              renderHealth(data.data.ID, true);

              element.render('collapse');
              $('.history-refresh').click(function(){
                var type = $(this).closest('.layui-colla-content').siblings('.layui-colla-title').attr('data-type');
                renderHistory[type].call(this, {
                  "CLIENT_ID" : data.data.ID,
                  "HISTORY_SORT_ID": historySort[type].id
                });
              });
            });
            $('.add-history').on('click', function(){
              layer.open({
                type:2
                ,area:['90%', '90%']
                ,title:$(this).attr('data-text')
                ,content: layui.setter.baseUrl + $(this).attr('data-href')
                ,success: function(){
                  //
                }
              });
            });

            Object.keys(historySort).forEach(function(key){
              table.on('tool(xy-history-' + key + ')', function(obj){
                var data = obj.data;
                  if(obj.event === 'del'){
                    layer.confirm('确定要删除吗', function(index){
                      common.req({
                        url: layui.setter.api.DeleteClientHistory
                        ,data: {ID: obj.data.ID}
                        ,success: function(data){
                          obj.del();
                          layer.close(index);
                        }
                      });
                    });
                  }
              });
            });
          }, this)
        });
      } else {
        form.val('xy-resident-form', {
          MANAGE_USER_ID: common.user.ID
          ,MANAGE_REAL_NAME: common.user.REAL_NAME
          ,MANAGE_UNIT_ID: common.user.UNIT_ID
          ,MANAGE_UNIT_NAME: common.user.UNIT_NAME
          ,UNIT_ID: common.user.UNIT_ID
          ,CREATE_USER_ID: common.user.ID
        });
        $('#CREATE_USER_ID_V').text(common.user.REAL_NAME);
        $('#UNIT_ID_V').text(common.user.UNIT_NAME);
        common.initArea();
        common.initConfig();

        laydate.render({
          elem: '#CREATE_TIME'
          ,format: layui.setter.dateFormat.day
        });
      }

      $('#ID_NUMBER').on('blur', function() {
        var identity = $(this).val();
        if (identity.length == 18) {
          $('#BIRTHDAY').val(identity.substr(6, 4) + '/' + identity.substr(10, 2) + '/' + identity.substr(12, 2));
        }
      });

      $('input[name="WEIGHT"],input[name="HEIGHT"]').on('input', function(){
        var weight = parseInt($('input[name="WEIGHT"]').val());
        var height = parseInt($('input[name="HEIGHT"]').val());
        if (weight > 0 && height > 0) {
          var bmi = weight / height / height * 10000;
          bmi = bmi.toFixed(1);
          $('#bmiDiv').text(bmi);
          $('input[name="BMI"]').val(bmi);
        }
      });

      form.on('submit(xy-resident-submit)', function(data){
        delete data.field.MANAGE_UNIT_NAME;
        delete data.field.MANAGE_REAL_NAME;
        $(".resident-form input:checkbox:checked").each(function() {
          var formKey = $(this).attr('name');
          if (!data.field[formKey] || data.field[formKey].indexOf(',') == -1) {
            data.field[formKey] = '';
          }

          data.field[formKey] += $(this).val() + ',';
        });
        if (data.field['EMPHASIS_CAUSE']) {
          data.field['EMPHASIS_CAUSE'] = data.field['EMPHASIS_CAUSE'].substr(0, data.field['EMPHASIS_CAUSE'].length - 1);
        } else {
          data.field['EMPHASIS_CAUSE'] = '';
        }
        
        common.req({
          url: layui.setter.api.ModifyClientInfo
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
              parent.layui.admin.closeThisTabs();
            });
          }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });

      //图片上传
      var uploadUrl = common.getUploadUrl();
      var uploadAvatar = upload.render({
        elem: '#xy-resident-avatar'
        // ,auto: false
        ,url: uploadUrl
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
        ,url: uploadUrl
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
    ,history: function() {
      var historySort = layui.history.historySort;
      var renderHistory = layui.history.renderHistory;
      laytpl(hiddenContainer.innerHTML).render({CLIENT_ID:router.search.CLIENT_ID, historyKey:router.search.historyKey, historySort:historySort}, function(html){
        $('#historyForm').prepend(html);
        $('title').text(historySort[router.search.historyKey].name);
        $('.layui-card-header').text(historySort[router.search.historyKey].name);
        $('#icdname').on('input', function() {
          $('#icdid').val('');
        });
      });

      laydate.render({
        elem: '#TIME_VALUE_1'
        ,format: layui.setter.dateFormat.day
      });

      laydate.render({
        elem: '#TIME_VALUE_2'
        ,format: layui.setter.dateFormat.day
      });

      switch(router.search.historyKey) {
        case 'medicine':
          form.render('select');
          break;
        case 'familyMedical':
          common.initConfig();
          break;
        default:
          break;
      }

      form.on('submit(xy-history-submit)', function(data){
        delete data.field.UNIT_NAME;
        common.req({
          url: layui.setter.api.ModifyClientHistory
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
              common.saveSuccess({
                type: 1
                ,refresh: '.history-refresh-' + router.search.historyKey
              });
            });
          }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
    }
  }

  exports('resident', {init: init})
});