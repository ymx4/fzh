layui.define(['common'], function(exports){
  var $ = layui.$
  ,common = layui.common;

  //区块轮播切换
  layui.use(['carousel'], function(){
    var $ = layui.$
    ,carousel = layui.carousel
    ,element = layui.element
    ,device = layui.device();

    //轮播切换
    $('.layadmin-carousel').each(function(){
      var othis = $(this);
      carousel.render({
        elem: this
        ,width: '100%'
        ,arrow: 'none'
        ,interval: othis.data('interval')
        ,autoplay: othis.data('autoplay') === true
        ,trigger: (device.ios || device.android) ? 'click' : 'hover'
        ,anim: othis.data('anim')
      });
    });
    
    element.render('progress');
    
  });

  // 贫困户
  layui.use(['echarts'], function(){
    echarts = layui.echarts;

    var echcolorline = []
    ,elemColorline = $('#chat-poverty').children('div')
    ,renderLine = function(index, colorline){
      echcolorline[index] = echarts.init(elemColorline[index], layui.echartsTheme);
      echcolorline[index].setOption(colorline);
      window.onresize = echcolorline[index].resize;
    };
    if(!elemColorline[0]) return;

    common.req({
      url: layui.setter.api.Poverty
      ,data: {
        UNIT_ID: common.user.UNIT_ID
        ,CHILDREN_UNIT: 0
      }
      ,success: function(data){
        if (data.data.length <= 0) {
          return;
        }
        colorline = {
          title: {
            text: '贫困人口情况统计',
          },
          tooltip : {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [],
            type: 'bar',
            itemStyle: {
              normal: {
                color: function(params) {
                  // build a color map as your need.
                  var colorList = [
                    '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                     '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                     '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                  ];
                  return colorList[params.dataIndex]
                }
              }
            }
          }]
        };
        $.each(data.data, function(i, item){
          colorline.xAxis.data.push(item.POVERTY_NAME);
          colorline.series[0].data.push(item.COUNT_NUMBER);
        });
        renderLine(0, colorline);
      }
    });
  });

  // 生化
  layui.use(['echarts'], function(){
    echarts = layui.echarts;

    var renderProject = function (year) {
      // common.req({
      //   url: layui.setter.api.Project
      //   ,data: {
      //     UNIT_ID: common.user.UNIT_ID
      //     ,CHILDREN_UNIT: 0
      //     ,PROJUCT_NAME: '血总胆固醇,血高密度胆固醇,血甘油三酯,血低密度胆固醇,白细胞,亚硝酸盐,尿胆原,胆红素,尿潜血,尿蛋白,酸碱度,尿比重,维生素C,尿酮体,葡萄糖,血糖'
      //     ,YEAR: year
      //   }
      //   ,success: function(data){
      //     if (data.data.length <= 0) {
      //       return;
      //     }
          colorline = {
            title: {
              text: '生化数据指标统计',
            },
            tooltip : {
              trigger: 'axis'
            },
            legend: {
                data:['正常数量','偏高数量','偏低数量']
            },
            xAxis: {
              type: 'category',
              data: ['血总胆固醇','血高密度胆固醇','血甘油三酯']
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name:'正常数量',
              data: [21,13,22],
              type: 'bar'
            },{
              name:'偏高数量',
              data: [45,45,45],
              type: 'bar'
            },{
              name:'偏低数量',
              data: [1,3,4],
              type: 'bar'
            }]
          };
    //       $.each(data.data, function(i, item){
    //         colorline.xAxis.data.push(item.POVERTY_NAME);
    //         colorline.series[0].data.push(item.COUNT_NUMBER);
    //       });
          renderLine(0, colorline);
    //     }
    //   });
    }

    var year = new Date().getFullYear();
    // $('#chatProjectButton').html('<button class="layui-btn layui-btn-sm layui-btn-normal">' + year + '</button>\
    //   <button class="layui-btn layui-btn-sm">' + (year - 1) + '</button>');
    $('#chatProjectButton button').click(function() {
      if ($(this).hasClass('layui-btn-normal')) {
        return;
      }
      renderProject($(this).text());
      $(this).siblings().removeClass('layui-btn-normal');
      $(this).addClass('layui-btn-normal')
    });

    var echcolorline = []
    ,elemColorline = $('#chat-project').children('div')
    ,renderLine = function(index, colorline){
      echcolorline[index] = echarts.init(elemColorline[index], layui.echartsTheme);
      echcolorline[index].setOption(colorline);
      window.onresize = echcolorline[index].resize;
    };
    if(!elemColorline[0]) return;
    renderProject(year);
  });

  exports('statistics')

});