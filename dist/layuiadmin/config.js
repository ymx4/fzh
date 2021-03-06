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
      GetAreaList: 'http://holtest.fres.cn/PublicMethods/AreaCode/GetAreaList.ashx',
      GetAreaText: 'http://holtest.fres.cn/PublicMethods/AreaCode/GetAreaText.ashx',
      SearchICD: 'http://holtest.fres.cn/PublicMethods/ICD10/SearchICD.ashx',
      GetOftenICD: 'http://holtest.fres.cn/PublicMethods/ICD10/GetOftenICD.ashx',
      UserLogin: 'http://holtest.fres.cn/User/UserLogin.ashx',
      UserLogOut: 'http://holtest.fres.cn/User/UserLogOut.ashx',
      GetUserList: 'http://holtest.fres.cn/User/GetUserList.ashx',
      GetUserInfo: 'http://holtest.fres.cn/User/GetUserInfo.ashx',
      ModifyUserInfo: 'http://holtest.fres.cn/User/ModifyUserInfo.ashx',
      GetLoginUser: 'http://holtest.fres.cn/User/GetLoginUser.ashx',
      DeleteUser: 'http://holtest.fres.cn/User/DeleteUser.ashx',
      ChangeUserPassword: 'http://holtest.fres.cn/User/ChangeUserPassword.ashx',
      GetConfigDetail: 'http://holtest.fres.cn/Config/GetConfigDetail.ashx',
      GetConfigInfo: 'http://holtest.fres.cn/Config/GetConfigInfo.ashx',
      GetHospitalUnit: 'http://holtest.fres.cn/Hospital/GetHospitalUnit.ashx',
      ModificationHospitalUnit: 'http://holtest.fres.cn/Hospital/ModificationHospitalUnit.ashx',
      DeleteHospitalUnit: 'http://holtest.fres.cn/Hospital/DeleteHospitalUnit.ashx',
      GetDataFormClientID: 'http://holtest.fres.cn/Equipment/GetDataFormClientID.ashx',
      GetEquipmentType: 'http://holtest.fres.cn/Equipment/GetEquipmentType.ashx',
      GetEquipmentList: 'http://holtest.fres.cn/Equipment/GetEquipmentList.ashx',
      GetEquipmentInfo: 'http://holtest.fres.cn/Equipment/GetEquipmentInfo.ashx',
      RegisterEquipment: 'http://holtest.fres.cn/Equipment/RegisterEquipment.ashx',
      ModifyEquipment: 'http://holtest.fres.cn/Equipment/ModifyEquipment.ashx',
      DeleteEquipment: 'http://holtest.fres.cn/Equipment/DeleteEquipment.ashx',
      GetEquipmentData: 'http://holtest.fres.cn/Equipment/GetEquipmentData.ashx',
      ModifyClientInfo: 'http://holtest.fres.cn/Client/ModifyClientInfo.ashx',
      GetClientInfo: 'http://holtest.fres.cn/Client/GetClientInfo.ashx',
      SearchClient: 'http://holtest.fres.cn/Client/SearchClient.ashx',
      DeleteClient: 'http://holtest.fres.cn/Client/DeleteClient.ashx',
      UpFile: 'http://holtest.fres.cn/PublicMethods/UpLoad/UpFile.ashx',
      ReadFile: 'http://holtest.fres.cn/PublicMethods/UpLoad/ReadFile.ashx',
      ModifyClientHistory: 'http://holtest.fres.cn/Client/History/ModifyClientHistory.ashx',
      DeleteClientHistory: 'http://holtest.fres.cn/Client/History/DeleteClientHistory.ashx',
      GetClientHistory: 'http://holtest.fres.cn/Client/History/GetClientHistory.ashx',
      GetPhysicalExaminationList: 'http://holtest.fres.cn/PhysicalExamination/GetPhysicalExaminationList.ashx',
      GetPhysicalExaminationInfo: 'http://holtest.fres.cn/PhysicalExamination/GetPhysicalExaminationInfo.ashx',
      NewPhysicalExamination: 'http://holtest.fres.cn/PhysicalExamination/NewPhysicalExamination.ashx',
      DeletePhysicalExamination: 'http://holtest.fres.cn/PhysicalExamination/DeletePhysicalExamination.ashx',
      SavePhysicalExaminationData: 'http://holtest.fres.cn/PhysicalExamination/SavePhysicalExaminationData.ashx',
    }
    ,loadsec: 5*1000
    ,dateFormat: {
      day: 'yyyy/MM/dd'
      ,sec: 'yyyy/MM/dd HH:mm:ss'
    }
    ,baseUrl: '/src/views/'
  });
});
