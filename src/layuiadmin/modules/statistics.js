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
    ,renderColorline = function(index, colorline){
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
            x: 'center',
            text: '贫困人口情况统计',
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
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}'
                }
              }
            }
          }]
        };
        $.each(data.data, function(i, item){
          colorline.xAxis.data.push(item.POVERTY_NAME);
          colorline.series[0].data.push(item.COUNT_NUMBER);
        });
        renderColorline(0, colorline);
      }
    });
  });

  // 彩虹柱形图
  layui.use(['echarts'], function(){
    var $ = layui.$
    ,echarts = layui.echarts;

    var echcolorline = [], colorline = [
      {
        title: {
          x: 'center',
          text: 'ECharts例子个数统计',
          subtext: 'Rainbow bar example'
        },
        tooltip: {
          trigger: 'item'
        },
        // calculable: true,
        grid: {
          borderWidth: 0,
          y: 80,
          y2: 60
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: 'ECharts例子个数统计',
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
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{b}\n{c}'
                }
              }
            },
            data: [12,21,10,4,12,5,6,5,25,23,7]
          }
        ]
      }
    ]
    ,elemColorline = $('#LAY-index-pagetwo').children('div')
    ,renderColorline = function(index){
      echcolorline[index] = echarts.init(elemColorline[index], layui.echartsTheme);
      echcolorline[index].setOption(colorline[index]);
      window.onresize = echcolorline[index].resize;
    };
    if(!elemColorline[0]) return;
    renderColorline(0);
  });

  exports('statistics')

});