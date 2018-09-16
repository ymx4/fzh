layui.define(['table', 'form', 'element', 'upload', 'laydate', 'laytpl', 'common'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,element = layui.element
  ,laydate = layui.laydate
  ,upload = layui.upload
  ,laytpl = layui.laytpl
  ,common = layui.common
  ,router = layui.router();

  var pageType = 'detail';

  var init = {
    list: function() {
      if (router.search.t == 's') {
        //本单位
        laytpl(searchTpl.innerHTML).render({t: router.search.t}, function(html){
          $('#searchContainer').after(html);
          form.val('xy-resident-search-form', {
            USER_ID: common.user.ID
            ,REAL_NAME: common.user.REAL_NAME
          });
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
              {field: 'REAL_NAME', title: '姓名', minWidth:100, event:'detail'}
              ,{field: 'SEX_VALUE', title: '性别', minWidth:100, event:'detail'}
              ,{field: 'BIRTHDAY', title: '出生日期', minWidth:100, event:'detail'}
              ,{field: 'ID_NUMBER', title: '身份证号', minWidth:100, event:'detail'}
              ,{field: 'CREATE_TIME', title: '建档时间', minWidth:100, event:'detail'}
              ,{field: 'MANAGE_REAL_NAME', title: '签约医生', minWidth:100, event:'detail'}
              ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230}
            ]]
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
          common.xyRender({
            elem: '#xy-resident-manage'
            ,url: layui.setter.api.SearchClient
            ,where: {
              "KEY_WORD" : "",
              "UNIT_ID": common.user.UNIT_ID,
              "CHILDREN_UNIT": 1,
              "USER_ID": common.user.ID
            }
            ,cols: [[
              {field: 'REAL_NAME', title: '姓名', minWidth:100, event:'detail'}
              ,{field: 'SEX_VALUE', title: '性别', minWidth:100, event:'detail'}
              ,{field: 'BIRTHDAY', title: '出生日期', minWidth:100, event:'detail'}
              ,{field: 'ID_NUMBER', title: '身份证号', minWidth:100, event:'detail'}
              ,{field: 'CREATE_TIME', title: '建档时间', minWidth:100, event:'detail'}
              ,{field: 'UNIT_NAME', title: '所属单位', minWidth:100, event:'detail'}
              ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230}
            ]]
          });
        });
      } else {
        //我的客户
        laytpl(searchTpl.innerHTML).render({t: router.search.t}, function(html){
          $('#searchContainer').after(html);
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
              {field: 'REAL_NAME', title: '姓名', minWidth:100, event:'detail'}
              ,{field: 'SEX_VALUE', title: '性别', minWidth:100, event:'detail'}
              ,{field: 'BIRTHDAY', title: '出生日期', minWidth:100, event:'detail'}
              ,{field: 'ID_NUMBER', title: '身份证号', minWidth:100, event:'detail'}
              ,{field: 'CREATE_TIME', title: '建档时间', minWidth:100, event:'detail'}
              ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230}
            ]]
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
      pageType = 'detail';

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
            element.render('collapse');
          });
        }, this)
      });
    }
    ,edit: function() {
      pageType = 'edit';
      if (router.search.id) {
        common.req({
          url: layui.setter.api.GetClientInfo
          ,data: {
            CLIENT_ID: router.search.id
          }
          ,success: $.proxy(function(data){
            form.val('xy-resident-form', data.data);
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
            $('select[name="CENSUS_TYPE_ID"]').attr('data-val', data.data.CENSUS_TYPE_ID);
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

            if (data.data.WEIGHT && data.data.HEIGHT) {
              var bmi = data.data.WEIGHT / data.data.HEIGHT / data.data.HEIGHT * 10000;
              bmi = bmi.toFixed(1);
              $('#bmiDiv').text(bmi);
              $('input[name="BMI"]').val(bmi);
            }

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
                ,area:['80%', '80%']
                ,title:$(this).attr('data-text')
                ,content: layui.setter.baseUrl + $(this).attr('data-href')
                ,success: function(){
                  //
                }
              });
            });

            Object.keys(historySort).forEach(function(key){
              table.on('tool(xy-resident-history-' + key + ')', function(obj){
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
        delete data.field.UNIT_NAME;
        delete data.field.DOCTOR_REAL_NAME;
        delete data.field.MANAGE_UNIT_NAME;
        delete data.field.MANAGE_REAL_NAME;
        common.req({
          url: layui.setter.api.ModifyClientInfo
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
              common.saveSuccess('resident/list.html');
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

  var historySort = {
    medical: {id:1,name:'个人病史'}
    ,surgery: {id:2,name:'手术史'}
    ,traumatic: {id:3,name:'外伤史'}
    ,transfusion: {id:4,name:'输血'}
    ,hospital: {id:5,name:'住院史'}
    ,medicine: {id:6,name:'用药情况'}
    ,familyHospital: {id:7,name:'家庭病床史'}
    ,familyMedical: {id:8,name:'家庭病史'}
    ,geneticDisorders: {id:9,name:'遗传病史'}
    ,allergy: {id:10,name:'过敏史'}
    ,disability: {id:11,name:'残疾情况'}
    ,inoculate: {id:12,name:'预防接种史'}
  }

  var renderHistory = {
    medical: function(where){
      //个人病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'DISEASE_NAME', title: '疾病名称', minWidth:100}
        ,{field: 'CONFIRMED_TIME', title: '确诊时间', minWidth:100}
        ,{field: 'HOSPITAL_NAME', title: '确诊机构', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-medical'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,surgery: function(where){
      //手术史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'SURGERY_NAME', title: '手术名称', minWidth:100}
        ,{field: 'SURGERY_TIME', title: '手术时间', minWidth:100}
        ,{field: 'SURGERY_COMPANY', title: '手术机构', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-surgery'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,traumatic: function(where){
      //外伤
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'TRAUMATIC_NAME', title: '名称', minWidth:100}
        ,{field: 'TRAUMATIC_TIME', title: '时间', minWidth:100}
        ,{field: 'TRAUMATIC_UAUSES', title: '原因', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-traumatic'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,transfusion: function(where){
      //输血
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'TRANSFUSION_TIME', title: '时间', minWidth:100}
        ,{field: 'TRANSFUSION_CAUSE', title: '原因', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-transfusion'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,hospital: function(where){
      //住院史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'IN_HOSIPITAL_TIME', title: '入院时间', minWidth:100}
        ,{field: 'OUT_HOSIPITAL_TIME', title: '出院时间', minWidth:100}
        ,{field: 'HOSPITAL_CAUSE', title: '住院原因', minWidth:100}
        ,{field: 'COMPANY_NAME', title: '医院名称', minWidth:100}
        ,{field: 'RECORD_NUMBER', title: '病案号', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-hospital'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,medicine: function(where){
      //用药情况
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'MEDICINE_NAME', title: '药物名称', minWidth:100}
        ,{field: 'MEDICINE_TIME', title: '用药时间', minWidth:100}
        ,{field: 'MEDICINE_DOSE', title: '用量', minWidth:100}
        ,{field: 'MEDICINE_PLAN', title: '服药依从性', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-medicine'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,familyHospital: function(where){
      //家庭病床史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'IN_HOSPITAL', title: '建床日期', minWidth:100}
        ,{field: 'OUT_HOSPITAL', title: '撤床日期', minWidth:100}
        ,{field: 'HOSPITAL_CAUSE', title: '原因', minWidth:100}
        ,{field: 'COMPANY_NAME', title: '医疗机构', minWidth:100}
        ,{field: 'RECORD_NUMBER', title: '病案号', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-familyHospital'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,familyMedical: function(where){
      //家庭病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'MEDICAL_NAME', title: '残疾名称', minWidth:100}
        ,{field: 'RELATION_NAME', title: '与其关系', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-familyMedical'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,geneticDisorders: function(where){
      //遗传病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'MEDICAL_NAME', title: '疾病名称', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-geneticDisorders'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,allergy: function(where){
      //过敏史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'ALLERGY_SOURCE', title: '过敏源', minWidth:100}
        ,{field: 'SOURCE', title: '来源', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-allergy'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,disability: function(where){
      //残疾情况
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'DISABILITY_NAME', title: '残疾名称', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-disability'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,inoculate: function(where){
      //预防接种史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'INOCULATE_NAME', title: '名称', minWidth:100}
        ,{field: 'INOCULATE_TIME', title: '接种日期', minWidth:100}
        ,{field: 'INOCULATE_COMPANY', title: '接种机构', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-inoculate'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
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