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
          {field: 'CLIENT_NUMBER', title: '客户编号', minWidth:100, event:'detail', style:'cursor: pointer;'}
          ,{field: 'REAL_NAME', title: '姓名', minWidth:100, event:'detail', style:'cursor: pointer;'}
          ,{field: 'MOBILE', title: '手机', minWidth:100}
          ,{field: 'SEX_VALUE', title: '性别', minWidth:100}
          ,{field: 'CREATE_TIME', title: '加入时间', minWidth:100}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-resident', minWidth:230}
        ]]
      });

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
        }
      });
    }
    ,detail: function() {
      pageType = 'detail';

      laytpl(xy_resident_detail.innerHTML).render({username: '测试'}, function(html){
        document.getElementById('xy_resident_view').innerHTML = html;
      });

      laytpl(xy_resident_health_detail.innerHTML).render({username: '测试'}, function(html){
        document.getElementById('xy_resident_health').innerHTML = html;
      });

      laytpl(xy_resident_env_detail.innerHTML).render({username: '测试'}, function(html){
        document.getElementById('xy_resident_env').innerHTML = html;
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
            common.initConfig();
            common.initArea({default: data.data.HOME_ADDRESS_AREA_ID, elem: '#home_address_area_container'});
            common.initArea({default: data.data.ADDRESS_AREA_ID, elem: '#address_area_container'});

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
      });

      laydate.render({
        elem: '#TIME_VALUE_1'
        ,type: 'datetime'
        ,format: layui.setter.dateFormat.sec
      });

      laydate.render({
        elem: '#TIME_VALUE_2'
        ,type: 'datetime'
        ,format: layui.setter.dateFormat.sec
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
                href: 'resident/edit.html#/id=' + router.search.CLIENT_ID
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
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-medical'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,surgery: function(where){
      //手术史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'SURGERY_NAME', title: '手术名称', minWidth:100}
        ,{field: 'SURGERY_TIME', title: '手术时间', minWidth:100}
        ,{field: 'SURGERY_COMPANY', title: '手术机构', minWidth:100}
      ]
      common.xyRender({
        elem: '#xy-resident-history-surgery'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,traumatic: function(where){
      //外伤
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'TRAUMATIC_NAME', title: '名称', minWidth:100}
        ,{field: 'TRAUMATIC_TIME', title: '时间', minWidth:100}
        ,{field: 'TRAUMATIC_UAUSES', title: '原因', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-traumatic'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,transfusion: function(where){
      //输血
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'TRANSFUSION_TIME', title: '时间', minWidth:100}
        ,{field: 'TRANSFUSION_CAUSE', title: '原因', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-transfusion'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,hospital: function(where){
      //住院史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '住院时间', minWidth:100}
        ,{field: 'username', title: '住院原因', minWidth:100}
        ,{field: 'username', title: '医院名称', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-hospital'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,medicine: function(where){
      //用药情况
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '疾病名称', minWidth:100}
        ,{field: 'username', title: '与其关系', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-medicine'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
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
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-familyHospital'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,familyMedical: function(where){
      //家庭病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '残疾名称', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-familyMedical'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,geneticDisorders: function(where){
      //遗传病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '过敏源', minWidth:100}
        ,{field: 'username', title: '来源', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-geneticDisorders'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,allergy: function(where){
      //过敏史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'ALLERGY_SOURCE', title: '过敏源', minWidth:100}
        ,{field: 'SOURCE', title: '来源', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-allergy'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,disability: function(where){
      //残疾情况
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'username', title: '过敏源', minWidth:100}
        ,{field: 'username', title: '来源', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-disability'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
      });
    }

    ,inoculate: function(where){
      //预防接种史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'INOCULATE_NAME', title: '名称', minWidth:100}
        ,{field: 'INOCULATE_TIME', title: '接种日期', minWidth:100}
        ,{field: 'INOCULATE_COMPANY', title: '接种机构', minWidth:100}
      ];
      if (pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-resident-history-inoculate'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
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