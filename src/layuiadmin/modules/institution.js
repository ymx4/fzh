layui.define(['table', 'form', 'common', 'admin'], function(exports){
  var $ = layui.$
  ,table = layui.table
  ,form = layui.form
  ,admin = layui.admin
  ,common = layui.common
  ,router = layui.router();

  var init = {
    list: function() {
      //机构管理
      common.xyRender({
        elem: '#xy-institution-manage'
        ,url: layui.setter.api.GetHospitalUnit
        ,where: {
          "HOSPITAL_ID": common.user.UNIT_ID,
          "GET_TYPE": 1
        }
        ,cols: [[
          {type: 'numbers', title: '序号'}
          ,{field: 'UNIT_NAME', title: '单位名称',templet: function(d){
            var indent = 10;
            var n = d.LEVEL_NUMBER;
            return '<span style="margin-left:' + (indent * n) + 'px;">' + d.UNIT_NAME + '</span>';
          }}
          ,{field: 'AREA_FULL_NAME', title: '所属区域'}
          ,{field: 'UNIT_TYPE_NAME', title: '单位类型'}
          ,{field: 'UNIT_LEVEL_NAME', title: '单位级别'}
          ,{field: 'UNIT_STATUS_NAME', title: '单位状态'}
          ,{title: '操作', align:'center', fixed: 'right', toolbar: '#table-institution'}
        ]]
      });
      
      //监听工具条
      table.on('tool(xy-institution-manage)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
          layer.confirm('确定要删除吗', function(index){
            common.req({
              url: layui.setter.api.DeleteHospitalUnit
              ,data: {HOSPITAL_ID: obj.data.ID}
              ,success: function(data){
                obj.del();
                layer.close(index);
              }
            });
          });
        }
      });
    }
    ,edit: function() {
      if (router.search.id) {
        common.req({
          url: layui.setter.api.GetHospitalUnit
          ,data: {
            HOSPITAL_ID: router.search.id
            ,GET_TYPE: 0
          }
          ,success: $.proxy(function(data){
            form.val('xy-institution-form', data.data);
            $('select[name="UNIT_LEVEL"]').attr('data-val', data.data.UNIT_LEVEL);
            $('select[name="UNIT_TYPE"]').attr('data-val', data.data.UNIT_TYPE);
            $('select[name="UNIT_STATUS"]').attr('data-val', data.data.UNIT_STATUS);
            common.initConfig();
            common.initArea({default: data.data.AREA_ID, elem: '#ins_ares_container'});
          }, this)
        });
      } else {
        common.initConfig();
        common.initArea();
      }

      form.on('submit(xy-institution-submit)', function(data){
        delete data.field.PARENT_UNIT_NAME;
        common.req({
          url: layui.setter.api.ModificationHospitalUnit
          ,formerror: true
          ,data: data.field
          ,success: function(data){
            layer.msg('操作成功', function() {
              // common.saveSuccess('institution/list.html');
            });
          }
        });
        return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
      });
    }
    ,pact: function() {
      layui.use(['layedit'], function(){
        var $ = layui.$
        ,layedit = layui.layedit;

        var editIndex = layedit.build('PACT', {
          tool: [
            'strong' //加粗
            ,'italic' //斜体
            ,'underline' //下划线
            ,'del' //删除线
            
            // ,'|' //分割线
            
            ,'left' //左对齐
            ,'center' //居中对齐
            ,'right' //右对齐
            ,'link' //超链接
            ,'unlink' //清除链接
            ,'face' //表情
            // ,'image' //插入图片
            // ,'help' //帮助
          ]
        });

        common.req({
          url: layui.setter.api.GetPact
          ,data: {}
          ,success: $.proxy(function(data){
            layedit.setContent(editIndex, data.data);
          }, this)
        });

        form.on('submit(xy-pact-submit)', function(data){
          common.req({
            url: layui.setter.api.ModificationPact
            ,formerror: true
            ,data: {
              PACT: layedit.getContent(editIndex)
            }
            ,success: function(data){
              layer.msg('操作成功', function() {
              });
            }
          });
          return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
        });
        
      });
    }
  }

  exports('institution', {init: init})
});