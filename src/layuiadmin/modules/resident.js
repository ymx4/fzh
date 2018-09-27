layui.define(['table', 'form', 'element', 'upload', 'laydate', 'laytpl', 'common', 'history'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,element = layui.element
  ,laydate = layui.laydate
  ,upload = layui.upload
  ,laytpl = layui.laytpl
  ,common = layui.common
  ,router = layui.router();

  var renderHealth = function(cliendId, edit) {
    //公共卫生
    var cols = [
      {field: 'PHYSICAL_EXAMINATION_NO', title: '档案编号', minWidth:100, event:'detail'}
      ,{field: 'CLIENT_REAL_NAME', title: '姓名', minWidth:100, event:'detail'}
      ,{field: 'SEX_VALUE', title: '性别', minWidth:100, event:'detail'}
      ,{field: 'CREATE_TIME', title: '建档时间', minWidth:100, event:'detail'}
    ];
    if (edit) {
      cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-health-ope'});
    }
    common.xyRender({
      elem: '#xy-history-health'
      ,url: layui.setter.api.GetPhysicalExaminationList
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
        parent.layui.index.openTabsPage('health/detail.html#/id=' + obj.data.ID + '/clientId=' + obj.data.CLIENT_ID, '查看档案-' + obj.data.CLIENT_REAL_NAME);
      }
    });

    common.xyRender({
      elem: '#xy-history-equipment'
      ,url: layui.setter.api.GetDataFormClientID
      ,where: {
        "CLIENT_ID": cliendId
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
  }

  var renderResident = function(where) {
    common.xyRender({
      elem: '#xy-resident-manage'
      ,url: layui.setter.api.SearchClient
      ,where: where
      ,cols: [[
        {field: 'REAL_NAME', title: '姓名', minWidth:100, event:'detail'}
        ,{field: 'SEX_VALUE', title: '性别', minWidth:100, event:'detail'}
        ,{field: 'BIRTHDAY', title: '出生日期', minWidth:100, event:'detail'}
        ,{field: 'ID_NUMBER', title: '身份证号', minWidth:100, event:'detail'}
        ,{field: 'CREATE_TIME', title: '建档时间', minWidth:100, event:'detail'}
        ,{field: 'MANAGE_REAL_NAME', title: '签约医生', minWidth:100, event:'detail'}
        ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230}
      ]]
    });
  }

  var init = {
    list: function() {
      if (router.search.t == 's') {
        //本单位
        laytpl(searchTpl.innerHTML).render({t: router.search.t}, function(html){
          $('#searchContainer').after(html);
          form.val('xy-resident-search-form', {
            USER_ID: 0
            ,REAL_NAME: '全部'
          });
          renderResident({
            "KEY_WORD" : "",
            "UNIT_ID": common.user.UNIT_ID,
            "CHILDREN_UNIT": 0,
            "USER_ID": common.user.ID
          });
        });
      } else if (router.search.t == 'l') {
        //下级
        laytpl(searchTpl.innerHTML).render({t: router.search.t}, function(html){
          $('#searchContainer').after(html);
          form.val('xy-resident-search-form', {
            UNIT_ID: common.user.UNIT_ID
            ,UNIT_NAME: common.user.UNIT_NAME
            ,USER_ID: common.user.ID
            ,REAL_NAME: common.user.REAL_NAME
          });
          renderResident({
            "KEY_WORD" : "",
            "UNIT_ID": common.user.UNIT_ID,
            "CHILDREN_UNIT": 1,
            "USER_ID": common.user.ID
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
        }
      });
    }
    ,detail: function() {
      var historySort = layui.history.historySort;
      var renderHistory = layui.history.renderHistory;

      layer.load(0, {time: layui.setter.loadsec});
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
          laytpl(xy_resident_detail.innerHTML).render(data.data, function(html){
            document.getElementById('xy_resident_view').innerHTML = html;
            if (data.data.FACE_FILE_NAME) {
              $('#xy-resident-avatar-img').attr('src', common.getImageUrl(data.data.FACE_FILE_NAME));
            }
            if (data.data.ID_NUMBER_FILE_NAME) {
              $('#xy-resident-identity-img').attr('src', common.getImageUrl(data.data.ID_NUMBER_FILE_NAME));
            }
          });
          element.on('collapse(collapse-history)', function(collData){
            if (collData.show && !collData.title.attr('data-init')) {
              collData.title.attr('data-init', 1);
              var type = collData.title.attr('data-type');
              renderHistory[type].call(this, {
                "CLIENT_ID" : data.data.ID,
                "HISTORY_SORT_ID": historySort[type].id
              });
            }
          });
          // history
          laytpl(historyContainer.innerHTML).render({edit:1, historySort: historySort}, function(html){
            $('.resident-form').after(html);
            renderHealth(data.data.ID, false);
            element.render('collapse');
          });
        }, this)
      });
    }
    ,edit: function() {
      common.user.pageType = 'edit';
      var historySort = layui.history.historySort;
      var renderHistory = layui.history.renderHistory;

      if (router.search.id) {
        layer.load(0, {time: layui.setter.loadsec});
        common.req({
          url: layui.setter.api.GetClientInfo
          ,data: {
            CLIENT_ID: router.search.id
          }
          ,success: $.proxy(function(data){
            form.val('xy-resident-form', data.data);
            $('#CREATE_USER_ID_V').text(data.data.DOCTOR_REAL_NAME);
            $('#UNIT_ID_V').text(data.data.UNIT_NAME);
            laydate.render({
              elem: '#BIRTHDAY'
              ,format: layui.setter.dateFormat.day
              ,value: data.data.BIRTHDAY ? data.data.BIRTHDAY.substring(0, 10) : ''
            });
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
            $('select[name="SEX"]').attr('data-val', data.data.SEX);
            $('select[name="MARRIAGE"]').attr('data-val', data.data.MARRIAGE);
            $('select[name="DWELL_TYPE"]').attr('data-val', data.data.DWELL_TYPE);
            $('select[name="NATION"]').attr('data-val', data.data.NATION);
            $('select[name="EDUCATION"]').attr('data-val', data.data.EDUCATION);
            $('select[name="OCCUPATION"]').attr('data-val', data.data.OCCUPATION);
            $('select[name="PAYMENT"]').attr('data-val', data.data.PAYMENT);
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

            element.on('collapse(collapse-history)', function(collData){
              if (collData.show && !collData.title.attr('data-init')) {
                collData.title.attr('data-init', 1);
                var type = collData.title.attr('data-type');
                renderHistory[type].call(this, {
                  "CLIENT_ID" : data.data.ID,
                  "HISTORY_SORT_ID": historySort[type].id
                });
              }
            });
            // history
            laytpl(historyContainer.innerHTML).render({edit:1, historySort: historySort, client: data.data}, function(html){
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

        lay('#BIRTHDAY,#CREATE_TIME').each(function(){
          laydate.render({
            elem: this
            ,format: layui.setter.dateFormat.day
          });
        });
      }

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