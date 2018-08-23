layui.define(['form', 'upload'], function(exports){
  var $ = layui.$
  ,layer = layui.layer
  ,laytpl = layui.laytpl
  ,setter = layui.setter
  ,view = layui.view
  ,admin = layui.admin
  ,form = layui.form
  ,upload = layui.upload;

  var $body = $('body');
  
  //自定义验证
  form.verify({    
    pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ]
    
    //确认密码
    ,repass: function(value){
      if(value !== $('#NEW_PASSWORD').val()){
        return '两次密码输入不一致';
      }
    }
  });
  
  //设置密码
  form.on('submit(setmypass)', function(obj){
    $.ajax({
      url: layui.setter.api.ChangeUserPassword
      ,data: JSON.stringify(obj.field)
      ,type: 'post'
      ,dataType: 'json'
      ,success: function(data){
        if (data.status == 1) {
          //登入成功的提示与跳转
          layer.msg('修改密码成功');
        } else {
          layui.common.apierror(data, 'show');
        }
      }
    });
    return false;
  });
  
  //对外暴露的接口
  exports('set', {});
});