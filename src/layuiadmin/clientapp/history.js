layui.define(['common', 'table'], function(exports){
  var $ = layui.$
  ,common = layui.common
  ,table = layui.table;

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
  };

  var equipmentSort = {
    data1: {id:1,name:'血总胆固醇'}
    ,data2: {id:2,name:'血高密度胆固醇'}
    ,data3: {id:3,name:'血甘油三酯'}
    ,data4: {id:4,name:'血低密度胆固醇'}
    ,data5: {id:5,name:'白细胞'}
    ,data6: {id:6,name:'亚硝酸盐'}
    ,data7: {id:7,name:'尿胆原'}
    ,data8: {id:8,name:'胆红素'}
    ,data9: {id:9,name:'尿潜血'}
    ,data10: {id:10,name:'尿蛋白'}
    ,data11: {id:11,name:'酸碱度'}
    ,data12: {id:12,name:'尿比重'}
    ,data13: {id:13,name:'维生素C'}
    ,data14: {id:14,name:'尿酮体'}
    ,data15: {id:15,name:'葡萄糖'}
    ,data16: {id:16,name:'血糖'}
  };

  var healthSort = {
    diagnose: {name:'就诊记录'}
    ,consultation: {name:'会诊记录'}
    ,arrange: {name:'随访记录'}
    // ,survey: {name:'问卷记录'}
  };

  var renderEquipment = function(clientId, equipmentType){
    common.xyRender({
      elem: '#xy-equipment-' + equipmentType
      ,url: layui.setter.api.GetDataFormClientID
      ,where: {
        "CLIENT_ID": clientId
        ,"PROJECT_ID": equipmentSort[equipmentType].id
        // ,"ID_NUMBER": ''
        // ,"SATRT_DATE": ''
        // ,"END_DATE": ''
      }
      ,cols: [[
        {field: 'RECEIVE_TIME', title: '接收时间'}
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
      ]]
    });
  }

  var renderHistory = {
    medical: function(where){
      //个人病史
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'DISEASE_NAME', title: '疾病名称'}
        ,{field: 'CONFIRMED_TIME', title: '确诊时间'}
        ,{field: 'HOSPITAL_NAME', title: '确诊机构'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-medical'
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
        ,{field: 'SURGERY_NAME', title: '手术名称'}
        ,{field: 'SURGERY_TIME', title: '手术时间'}
        ,{field: 'SURGERY_COMPANY', title: '手术机构'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-surgery'
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
        ,{field: 'TRAUMATIC_NAME', title: '名称'}
        ,{field: 'TRAUMATIC_TIME', title: '时间'}
        ,{field: 'TRAUMATIC_UAUSES', title: '原因'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-traumatic'
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
        ,{field: 'TRANSFUSION_TIME', title: '时间'}
        ,{field: 'TRANSFUSION_CAUSE', title: '原因'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-transfusion'
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
        ,{field: 'IN_HOSIPITAL_TIME', title: '入院时间'}
        ,{field: 'OUT_HOSIPITAL_TIME', title: '出院时间'}
        ,{field: 'HOSPITAL_CAUSE', title: '住院原因'}
        ,{field: 'COMPANY_NAME', title: '医院名称'}
        ,{field: 'RECORD_NUMBER', title: '病案号'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-hospital'
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
        ,{field: 'MEDICINE_NAME', title: '药物名称'}
        ,{field: 'MEDICINE_TIME', title: '用药时间'}
        ,{field: 'MEDICINE_DOSE', title: '用量'}
        ,{field: 'MEDICINE_PLAN', title: '服药依从性'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-medicine'
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
        ,{field: 'IN_HOSPITAL', title: '建床日期'}
        ,{field: 'OUT_HOSPITAL', title: '撤床日期'}
        ,{field: 'HOSPITAL_CAUSE', title: '原因'}
        ,{field: 'COMPANY_NAME', title: '医疗机构'}
        ,{field: 'RECORD_NUMBER', title: '病案号'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-familyHospital'
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
        ,{field: 'MEDICAL_NAME', title: '残疾名称'}
        ,{field: 'RELATION_NAME', title: '与其关系'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-familyMedical'
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
        ,{field: 'MEDICAL_NAME', title: '疾病名称'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-geneticDisorders'
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
        ,{field: 'ALLERGY_SOURCE', title: '过敏源'}
        ,{field: 'SOURCE', title: '来源'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-allergy'
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
        ,{field: 'DISABILITY_NAME', title: '残疾名称'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-disability'
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
        ,{field: 'INOCULATE_NAME', title: '名称'}
        ,{field: 'INOCULATE_TIME', title: '接种日期'}
        ,{field: 'INOCULATE_COMPANY', title: '接种机构'}
        ,{field: 'REMARK', title: '备注'}
      ];
      if (common.user.pageType == 'edit') {
        cols.push({title: '操作', align:'center', fixed: 'right', toolbar: '#table-history-ope'});
      }
      common.xyRender({
        elem: '#xy-history-inoculate'
        ,url: layui.setter.api.GetClientHistory
        ,where: where
        ,cols: [cols]
        ,page: false
      });
    }

    ,diagnose: function(where){
      //就诊记录
      var cols = [
        {field: 'DIAGNOSE_NO', title: '就诊编号', event:'detail'}
        ,{field: 'DIAGNOSE_DATE', title: '就诊时间', event:'detail'}
        ,{field: 'CLIENT_REAL_NAME', title: '患者姓名', event:'detail'}
        ,{field: 'DOCTOR_REAL_NAME', title: '就诊医生', event:'detail'}
      ];
      common.xyRender({
        elem: '#xy-history-diagnose'
        ,url: layui.setter.api.SearchDiagnose
        ,where: where
        ,cols: [cols]
      });
      
      table.on('tool(xy-history-diagnose)', function(obj){
        if (obj.event === 'detail') {
          layer.open({
            type: 2,
            area:['100%', $('#LAY_app_body').height() + 'px'],
            content: layui.setter.baseUrl + 'clientapp/diagnose_detail.html#/id=' + obj.data.ID,
            title: '就诊'
          });
        }
      });
    }

    ,consultation: function(where){
      //会诊记录
      var cols = [
        {field: 'CONSULTATION_NO', title: '编号', event:'detail'}
        ,{field: 'CLIENT_REAL_NAME', title: '姓名', event:'detail'}
        ,{field: 'DIAGNOSE_UNIT_NAME', title: '就诊单位', event:'detail'}
        ,{field: 'CONSULTATION_UNIT_NAME', title: '会诊单位', event:'detail'}
        ,{field: 'STATUS_NAME', title: '状态', event:'detail',templet: function(d){
          if (d.CONSENT_TRANSFER != 0 && d.STATUS != 2) {
            return d.STATUS_NAME + ' , ' + d.CONSENT_TRANSFER_NAME;
          } else {
            return d.STATUS_NAME;
          }
        }}
      ];
      common.xyRender({
        elem: '#xy-history-consultation'
        ,url: layui.setter.api.SearchConsultation
        ,where: where
        ,cols: [cols]
      });
      
      table.on('tool(xy-history-consultation)', function(obj){
        if (obj.event === 'detail') {
          layer.open({
            type: 2,
            area:['100%', $('#LAY_app_body').height() + 'px'],
            content: layui.setter.baseUrl + 'clientapp/consultation_detail.html#/id=' + obj.data.ID,
            title: '会诊'
          });
        }
      });
    }

    ,arrange: function(where){
      //随访记录
      where.STATUS = where.STATUS || 1;
      var cols = [
        {field: 'ARRANGE_TIME', title: '随访时间', event:'detail'}
        ,{field: 'CLIENT_REAL_NAME', title: '姓名', event:'detail'}
        ,{field: 'ARRANAGE_TYPE_NAME', title: '随访类型', event:'detail'}
        ,{field: 'USER_REAL_NAME', title: '医生', event:'detail'}
      ];
      common.xyRender({
        elem: '#xy-history-arrange'
        ,url: layui.setter.api.SearchArrange
        ,where: where
        ,cols: [cols]
      });
      
      table.on('tool(xy-history-arrange)', function(obj){
        if (obj.event === 'detail') {
          layer.open({
            type: 2,
            area:['100%', $('#LAY_app_body').height() + 'px'],
            content: layui.setter.baseUrl + 'clientapp/arrange_detail.html#/id=' + obj.data.ID,
            title: '随访'
          });
        }
      });
    }

    ,survey: function(){
      //问卷记录
      var cols = [
        {type: 'numbers', title: '序号'}
        ,{field: 'jointime', title: '问卷时间'}
        ,{field: 'username', title: '问卷类型'}
        ,{field: 'username', title: '问卷名称'}
        ,{field: 'username', title: '调查人员'}
      ];
      common.xyRender({
        elem: '#xy-history-survey'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
      });
    }
  };

  exports('history', {
    historySort: historySort,
    healthSort: healthSort,
    renderHistory: renderHistory,
    equipmentSort: equipmentSort,
    renderEquipment: renderEquipment
  })
});