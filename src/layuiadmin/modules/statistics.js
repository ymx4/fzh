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
            x: 'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: []
          },
          series: [{
            // data: [],
            // type: 'bar',
            // itemStyle: {
            //   normal: {
            //     color: function(params) {
            //       // build a color map as your need.
            //       var colorList = [
            //         '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
            //          '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
            //          '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
            //       ];
            //       return colorList[params.dataIndex]
            //     }
            //   }
            // }
            name: '贫困人口',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
          }]
        };
        $.each(data.data, function(i, item){
          colorline.legend.data.push(item.POVERTY_NAME);
          colorline.series[0].data.push({name: item.POVERTY_NAME, value: item.COUNT_NUMBER});
        });
        renderLine(0, colorline);
      }
    });
  });

  // 生化
  layui.use(['echarts'], function(){
    echarts = layui.echarts;

    var renderProject = function (year) {
      common.req({
        url: layui.setter.api.Project
        ,data: {
          UNIT_ID: common.user.UNIT_ID
          ,CHILDREN_UNIT: 0
          ,PROJUCT_NAME: '血总胆固醇,血高密度胆固醇,血甘油三酯,血低密度胆固醇,白细胞,亚硝酸盐,尿胆原,胆红素,尿潜血,尿蛋白,酸碱度,尿比重,维生素C,尿酮体,葡萄糖,血糖'
          ,YEAR: year
        }
        ,success: function(data){
          if (data.data.length <= 0) {
            return;
          }
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
              data: [],
              axisLabel: {  
                interval: 0,
                rotate: 40
              }
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name:'正常数量',
              data: [],
              type: 'bar'
            },{
              name:'偏高数量',
              data: [],
              type: 'bar'
            },{
              name:'偏低数量',
              data: [],
              type: 'bar'
            }]
          };
          $.each(data.data, function(i, item){
            colorline.xAxis.data.push(item.PORJUCT_NAME);
            colorline.series[0].data.push(item.ZC);
            colorline.series[1].data.push(item.PG);
            colorline.series[2].data.push(item.PD);
          });
          renderLine(0, colorline);
        }
      });
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

  // 签约
  layui.use(['echarts'], function(){
    echarts = layui.echarts;

    var echcolorline = []
    ,elemColorline = $('#chat-qyys').children('div')
    ,renderLine = function(index, colorline){
      echcolorline[index] = echarts.init(elemColorline[index], layui.echartsTheme);
      echcolorline[index].setOption(colorline);
      window.onresize = echcolorline[index].resize;
    };
    if(!elemColorline[0]) return;

    common.req({
      url: layui.setter.api.Qyys
      ,data: {
        UNIT_ID: common.user.UNIT_ID
        ,CHILDREN_UNIT: 0
      }
      ,success: function(data){
        colorline = {
          title: {
            text: '签约统计',
            x: 'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: ['未签约', '已签约']
          },
          series: [{
            name: '签约统计',
            type: 'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
          }]
        };
        colorline.series[0].data.push({name: '未签约', value: data.data.WQYSL});
        colorline.series[0].data.push({name: '已签约', value: data.data.QYSL});
        renderLine(0, colorline);
      }
    });
  });

  // 重点人群统计
  layui.use(['echarts'], function(){
    echarts = layui.echarts;

    var renderZdrq = function () {
      common.req({
        url: layui.setter.api.Zdrq
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
              text: '重点人群统计',
            },
            tooltip : {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              data: [],
              axisLabel: {  
                interval: 0,
                rotate: 40
              }
            },
            yAxis: {
              type: 'value'
            },
            series: [{
              name: '数量',
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
            colorline.xAxis.data.push(item.ZDMC);
            colorline.series[0].data.push(item.RQSL);
          });
          renderLine(0, colorline);
        }
      });
    }

    var echcolorline = []
    ,elemColorline = $('#chat-zdrq').children('div')
    ,renderLine = function(index, colorline){
      echcolorline[index] = echarts.init(elemColorline[index], layui.echartsTheme);
      echcolorline[index].setOption(colorline);
      window.onresize = echcolorline[index].resize;
    };
    if(!elemColorline[0]) return;
    renderZdrq();
  });

  exports('statistics')

});