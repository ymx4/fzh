layui.define(['common'], function(exports){
  var common = layui.common;

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
        ,{field: 'SURGERY_NAME', title: '手术名称', minWidth:100}
        ,{field: 'SURGERY_TIME', title: '手术时间', minWidth:100}
        ,{field: 'SURGERY_COMPANY', title: '手术机构', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'TRAUMATIC_NAME', title: '名称', minWidth:100}
        ,{field: 'TRAUMATIC_TIME', title: '时间', minWidth:100}
        ,{field: 'TRAUMATIC_UAUSES', title: '原因', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'TRANSFUSION_TIME', title: '时间', minWidth:100}
        ,{field: 'TRANSFUSION_CAUSE', title: '原因', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'IN_HOSIPITAL_TIME', title: '入院时间', minWidth:100}
        ,{field: 'OUT_HOSIPITAL_TIME', title: '出院时间', minWidth:100}
        ,{field: 'HOSPITAL_CAUSE', title: '住院原因', minWidth:100}
        ,{field: 'COMPANY_NAME', title: '医院名称', minWidth:100}
        ,{field: 'RECORD_NUMBER', title: '病案号', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'MEDICINE_NAME', title: '药物名称', minWidth:100}
        ,{field: 'MEDICINE_TIME', title: '用药时间', minWidth:100}
        ,{field: 'MEDICINE_DOSE', title: '用量', minWidth:100}
        ,{field: 'MEDICINE_PLAN', title: '服药依从性', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'IN_HOSPITAL', title: '建床日期', minWidth:100}
        ,{field: 'OUT_HOSPITAL', title: '撤床日期', minWidth:100}
        ,{field: 'HOSPITAL_CAUSE', title: '原因', minWidth:100}
        ,{field: 'COMPANY_NAME', title: '医疗机构', minWidth:100}
        ,{field: 'RECORD_NUMBER', title: '病案号', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'MEDICAL_NAME', title: '残疾名称', minWidth:100}
        ,{field: 'RELATION_NAME', title: '与其关系', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'MEDICAL_NAME', title: '疾病名称', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'ALLERGY_SOURCE', title: '过敏源', minWidth:100}
        ,{field: 'SOURCE', title: '来源', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'DISABILITY_NAME', title: '残疾名称', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        ,{field: 'INOCULATE_NAME', title: '名称', minWidth:100}
        ,{field: 'INOCULATE_TIME', title: '接种日期', minWidth:100}
        ,{field: 'INOCULATE_COMPANY', title: '接种机构', minWidth:100}
        ,{field: 'REMARK', title: '备注', minWidth:100}
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
        elem: '#xy-history-visit'
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
        elem: '#xy-history-consultation'
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
        elem: '#xy-history-referral'
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
        elem: '#xy-history-examination'
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
        elem: '#xy-history-followup'
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
        elem: '#xy-history-survey'
        ,url: layui.setter.base + 'json/useradmin/webuser.js' //模拟接口
        ,cols: [cols]
      });
    }
  };

  exports('history', {historySort: historySort, renderHistory: renderHistory})
});