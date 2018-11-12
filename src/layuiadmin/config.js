/**

 @Name：layuiAdmin iframe版全局配置
 @Author：贤心
 @Site：http://www.layui.com/admin/
 @License：LPPL（layui付费产品协议）
    
 */
layui.config({
  version: Date.parse(new Date())
  ,debug: true
});
layui.define(['laytpl', 'layer', 'element', 'util'], function(exports){
  exports('setter', {
    container: 'LAY_app' //容器ID
    ,base: layui.cache.base //记录静态资源所在路径
    ,views: layui.cache.base + 'tpl/' //动态模板所在目录
    ,entry: 'index' //默认视图文件名
    ,engine: '.html' //视图文件后缀名
    ,pageTabs: true //是否开启页面选项卡功能。iframe版推荐开启
    
    ,name: 'layuiAdmin'
    ,tableName: 'layuiAdmin' //本地存储表名
    ,MOD_NAME: 'admin' //模块事件名
    
    ,debug: true //是否开启调试模式。如开启，接口异常时会抛出异常 URL 等信息

    //自定义请求字段
    ,request: {
      tokenName: false //自动携带 token 的字段名（如：access_token）。可设置 false 不携带。
    }
    
    //自定义响应字段
    ,response: {
      statusName: 'code' //数据状态的字段名称
      ,statusCode: {
        ok: 0 //数据状态一切正常的状态码
        ,logout: 1001 //登录状态失效的状态码
      }
      ,msgName: 'msg' //状态信息的字段名称
      ,dataName: 'data' //数据详情的字段名称
    }
    
    //扩展的第三方模块
    ,extend: [
      'echarts', //echarts 核心包
      'echartsTheme' //echarts 主题
    ]

    //主题配置
    ,theme: {
      //内置主题配色方案
      color: [{
        main: '#20222A' //主题色
        ,selected: '#009688' //选中色
        ,alias: 'default' //默认别名
      },{
        main: '#03152A'
        ,selected: '#3B91FF'
        ,alias: 'dark-blue' //藏蓝
      },{
        main: '#2E241B'
        ,selected: '#A48566'
        ,alias: 'coffee' //咖啡
      },{
        main: '#50314F'
        ,selected: '#7A4D7B'
        ,alias: 'purple-red' //紫红
      },{
        main: '#344058'
        ,logo: '#1E9FFF'
        ,selected: '#1E9FFF'
        ,alias: 'ocean' //海洋
      },{
        main: '#3A3D49'
        ,logo: '#2F9688'
        ,selected: '#5FB878'
        ,alias: 'green' //墨绿
      },{
        main: '#20222A'
        ,logo: '#F78400'
        ,selected: '#F78400'
        ,alias: 'red' //橙色
      },{
        main: '#28333E'
        ,logo: '#AA3130'
        ,selected: '#AA3130'
        ,alias: 'fashion-red' //时尚红
      },{
        main: '#24262F'
        ,logo: '#3A3D49'
        ,selected: '#009688'
        ,alias: 'classic-black' //经典黑
      },{
        logo: '#226A62'
        ,header: '#2F9688'
        ,alias: 'green-header' //墨绿头
      },{
        main: '#344058'
        ,logo: '#0085E8'
        ,selected: '#1E9FFF'
        ,header: '#1E9FFF'
        ,alias: 'ocean-header' //海洋头
      },{
        header: '#393D49'
        ,alias: 'classic-black-header' //经典黑头
      }]
      
      //初始的颜色索引，对应上面的配色方案数组索引
      //如果本地已经有主题色记录，则以本地记录为优先，除非请求本地数据（localStorage）
      ,initColorIndex: 0
    }

    ,api: {
      GetAreaList: 'http://dataserver.hihol.com/PublicMethods/AreaCode/GetAreaList.ashx',
      GetAreaText: 'http://dataserver.hihol.com/PublicMethods/AreaCode/GetAreaText.ashx',
      SearchICD: 'http://dataserver.hihol.com/PublicMethods/ICD10/SearchICD.ashx',
      GetOftenICD: 'http://dataserver.hihol.com/PublicMethods/ICD10/GetOftenICD.ashx',
      UserLogin: 'http://dataserver.hihol.com/User/UserLogin.ashx',
      UserLogOut: 'http://dataserver.hihol.com/User/UserLogOut.ashx',
      GetUserList: 'http://dataserver.hihol.com/User/GetUserList.ashx',
      GetUserInfo: 'http://dataserver.hihol.com/User/GetUserInfo.ashx',
      ModifyUserInfo: 'http://dataserver.hihol.com/User/ModifyUserInfo.ashx',
      GetLoginUser: 'http://dataserver.hihol.com/User/GetLoginUser.ashx',
      DeleteUser: 'http://dataserver.hihol.com/User/DeleteUser.ashx',
      ChangeUserPassword: 'http://dataserver.hihol.com/User/ChangeUserPassword.ashx',
      GetConfigDetail: 'http://dataserver.hihol.com/Config/GetConfigDetail.ashx',
      GetConfigInfo: 'http://dataserver.hihol.com/Config/GetConfigInfo.ashx',
      GetHospitalUnit: 'http://dataserver.hihol.com/Hospital/GetHospitalUnit.ashx',
      ModificationHospitalUnit: 'http://dataserver.hihol.com/Hospital/ModificationHospitalUnit.ashx',
      DeleteHospitalUnit: 'http://dataserver.hihol.com/Hospital/DeleteHospitalUnit.ashx',
      HospitalGetParent: 'http://dataserver.hihol.com/Hospital/GetParent.ashx',
      GetDataFormClientID: 'http://dataserver.hihol.com/Equipment/GetDataFormClientID.ashx',
      GetEquipmentType: 'http://dataserver.hihol.com/Equipment/GetEquipmentType.ashx',
      GetEquipmentList: 'http://dataserver.hihol.com/Equipment/GetEquipmentList.ashx',
      GetEquipmentInfo: 'http://dataserver.hihol.com/Equipment/GetEquipmentInfo.ashx',
      RegisterEquipment: 'http://dataserver.hihol.com/Equipment/RegisterEquipment.ashx',
      ModifyEquipment: 'http://dataserver.hihol.com/Equipment/ModifyEquipment.ashx',
      DeleteEquipment: 'http://dataserver.hihol.com/Equipment/DeleteEquipment.ashx',
      GetEquipmentData: 'http://dataserver.hihol.com/Equipment/GetEquipmentData.ashx',
      ModifyClientInfo: 'http://dataserver.hihol.com/Client/ModifyClientInfo.ashx',
      GetClientInfo: 'http://dataserver.hihol.com/Client/GetClientInfo.ashx',
      SearchClient: 'http://dataserver.hihol.com/Client/SearchClient.ashx',
      DeleteClient: 'http://dataserver.hihol.com/Client/DeleteClient.ashx',
      UpFile: 'http://dataserver.hihol.com/PublicMethods/UpLoad/UpFile.ashx',
      ReadFile: 'http://dataserver.hihol.com/PublicMethods/UpLoad/ReadFile.ashx',
      ModifyClientHistory: 'http://dataserver.hihol.com/Client/History/ModifyClientHistory.ashx',
      DeleteClientHistory: 'http://dataserver.hihol.com/Client/History/DeleteClientHistory.ashx',
      GetClientHistory: 'http://dataserver.hihol.com/Client/History/GetClientHistory.ashx',
      GetPhysicalExaminationList: 'http://dataserver.hihol.com/PhysicalExamination/GetPhysicalExaminationList.ashx',
      GetPhysicalExaminationInfo: 'http://dataserver.hihol.com/PhysicalExamination/GetPhysicalExaminationInfo.ashx',
      NewPhysicalExamination: 'http://dataserver.hihol.com/PhysicalExamination/NewPhysicalExamination.ashx',
      DeletePhysicalExamination: 'http://dataserver.hihol.com/PhysicalExamination/DeletePhysicalExamination.ashx',
      SavePhysicalExaminationData: 'http://dataserver.hihol.com/PhysicalExamination/SavePhysicalExaminationData.ashx',
      GetDiagnoseNO: 'http://dataserver.hihol.com/Client/Diagnose/GetDiagnoseNO.ashx',
      GetDiagnoseInfo: 'http://dataserver.hihol.com/Client/Diagnose/GetDiagnoseInfo.ashx',
      SearchDiagnose: 'http://dataserver.hihol.com/Client/Diagnose/SearchDiagnose.ashx',
      DeleteDiagnose: 'http://dataserver.hihol.com/Client/Diagnose/DeleteDiagnose.ashx',
      ModifyDiagnose: 'http://dataserver.hihol.com/Client/Diagnose/ModifyDiagnose.ashx',
      ModifyConsultation: 'http://dataserver.hihol.com/Client/Consultation/ModifyConsultation.ashx',
      GetConsultationInfo: 'http://dataserver.hihol.com/Client/Consultation/GetConsultationInfo.ashx',
      SearchConsultation: 'http://dataserver.hihol.com/Client/Consultation/SearchConsultation.ashx',
      GetConsultationList: 'http://dataserver.hihol.com/Client/Consultation/GetConsultationList.ashx',
      SetTransfer: 'http://dataserver.hihol.com/Client/Consultation/SetTransfer.ashx',
      SetToDiagnose: 'http://dataserver.hihol.com/Client/Consultation/SetToDiagnose.ashx',
      SearchArrange: 'http://dataserver.hihol.com/Client/Arrange/SearchArrange.ashx',
      ModifyArrange: 'http://dataserver.hihol.com/Client/Arrange/ModifyArrange.ashx',
      DeleteArrange: 'http://dataserver.hihol.com/Client/Arrange/DeleteArrange.ashx',
      GetArrangeInfo: 'http://dataserver.hihol.com/Client/Arrange/GetArrangeInfo.ashx',
      SendMessage: 'http://dataserver.hihol.com/Message/SendMessage.ashx',
      ReadMessage: 'http://dataserver.hihol.com/Message/ReadMessage.ashx',
      UnreadMessage: 'http://dataserver.hihol.com/Message/UnreadMessage.ashx',
      Receive34: 'http://dataserver.hihol.com/ReceiveData/Receive34.ashx',
      GetDCList: 'http://dataserver.hihol.com/Equipment/GetDCList.ashx',
      ShowECG: 'http://dataserver.hihol.com/PublicMethods/ECG/ShowECG.ashx',
      SetClientManage: 'http://dataserver.hihol.com/Client/SetClientManage.ashx',
      DCPost: 'http://dataserver.hihol.com/Equipment/DCPost.ashx',
      Client: {
        ChangeClientPassword: 'http://dataserver.hihol.com/Client/Login/ChangeClientPassword.ashx',
        ClientLogin: 'http://dataserver.hihol.com/Client/Login/ClientLogin.ashx',
        GetMyInfo: 'http://dataserver.hihol.com/Client/Login/GetMyInfo.ashx',
        ClientLoginOut: 'http://dataserver.hihol.com/Client/Login/ClientLoginOut.ashx',
        ClientGSM: 'http://dataserver.hihol.com/Client/Login/ClientGSM.ashx',
        GetClientHistory: 'http://dataserver.hihol.com/Client/Login/History/GetClientHistory.ashx',
        GetPhysicalExaminationList: 'http://dataserver.hihol.com/Client/Login/PhysicalExamination/GetPhysicalExaminationList.ashx',
        GetPhysicalExaminationInfo: 'http://dataserver.hihol.com/Client/Login/PhysicalExamination/GetPhysicalExaminationInfo.ashx',
        GetDataFormClientID: 'http://dataserver.hihol.com/Client/Login/Equipment/GetDataFormClientID.ashx',
        SearchDiagnose: 'http://dataserver.hihol.com/Client/Login/Diagnose/SearchDiagnose.ashx',
        GetDiagnoseInfo: 'http://dataserver.hihol.com/Client/Login/Diagnose/GetDiagnoseInfo.ashx',
        SearchConsultation: 'http://dataserver.hihol.com/Client/Login/Consultation/SearchConsultation.ashx',
        GetConsultationInfo: 'http://dataserver.hihol.com/Client/Login/Consultation/GetConsultationInfo.ashx',
        SearchArrange: 'http://dataserver.hihol.com/Client/Login/Arrange/SearchArrange.ashx',
        GetArrangeInfo: 'http://dataserver.hihol.com/Client/Login/Arrange/GetArrangeInfo.ashx',
        ClientMessageList: 'http://dataserver.hihol.com/Client/Login/Message/ClientMessageList.ashx',
        ClientSendMessage: 'http://dataserver.hihol.com/Client/Login/Message/ClientSendMessage.ashx',
        UnreadMessage: 'http://dataserver.hihol.com/Client/Login/Message/UnreadMessage.ashx',
        ReceiveClient34: 'http://dataserver.hihol.com/ReceiveData/ReceiveClient34.ashx',
        GetDCList: 'http://dataserver.hihol.com/Equipment/GetDCList.ashx',
        DCPost: 'http://dataserver.hihol.com/Equipment/DCPost.ashx'
      },
    }
    ,loadsec: 5*1000
    ,dateFormat: {
      day: 'yyyy/MM/dd'
      ,sec: 'yyyy/MM/dd HH:mm:ss'
    }
    ,baseUrl: 'http://local.fzh.com/src/views/'
    ,clientSess: 'clientapp'
    ,rememberPc: 'rememberPc'
    ,rememberClient: 'rememberClient'
    ,pageSize: 10
    ,unreadInterval: 10000
  });
});
