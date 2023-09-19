import React, { useState, useEffect, useRef } from "react";
import ApexCharts from 'apexcharts';
import $ from 'jquery'
import { RotateLoader } from "react-spinners";
const ChartComp = ({
  data = () => { }, /* List data, label cho column  */
  data1 = [], /* List data cho column 1 */
  data2 = [], /* List data cho column 2 */
  data3 = [], /* List data cho column 3 */
  name = 'Chart',/* Ghi chú khi hover vào cột dữ liệu  */
  name1 = '',/* Ghi chú khi hover vào cột dữ liệu 1 */
  name2 = '',/* Ghi chú khi hover vào cột dữ liệu 2 */
  name3 = '',/* Ghi chú khi hover vào cột dữ liệu 3 */
  type = 'column',
  height = 350,  /* chiều cao của chart */
  witdthres = 200,
  width = "auto",
  Typerun = 1,
  title = '', /* tên tiêu đề chart */
  textx = '',/* tiêu đề cột muốn đánh dấu : ví dụ tên nhân viên hay tên chi nhánh ..... */
  x = '', /* ví dụ tên nhân viên hay tên chi nhánh muốn được đánh dấu */
  colors = () => { },/* List màu */
  dataLable = () => { },/* List tên : ví dụ tên nhân viên hay tên chi nhánh ..... */
  id = "Chart1",/* id chart */
  idchart = "#" + id, /* id chart */
  fixval = '%', /* format giá trị hover show lên */
  positionfix = 'top',
  enabledfix = true,
  Keycheck = 0,
  legendShow = true, /* Ân hiện ghi chú của chart tròn */
  Color =  ['#008B8B', '#F08080', '#FFD700', '#2E8B57', '#00CED1', '#DC143C', '#FF4500', '#9ACD32','#FA4032', '#FFA812F', '#FAAF08', '#F2C057', '#FEF2E4', '#FD974F', '#C60000', '#805A3B'],
  dataLabelscolor = ['#000000'],
}) => { /* type="bar|line|area|bubble|pie" */
  // chạy sau khi tạo ra giao diện

  useEffect(async () => {
    if (Typerun > 1) {
      if (type === "donut" || type === "pie") {
        RenderDataChart();
      }
      else if (type === "row") {
        type = "bar";
        RenderDataChartRow();
      }
      else if (type ==='line')   
      {
        RenderDataChartLine();
      }
      else {
        RenderDataChartColumn();
      }
    }
  }, [Typerun])

  let datachart = [], datalable = [];
  Object.values(data).forEach(x => {
    datachart.push(x.y);
    datalable.push(x.label);
  })

  let Total = datachart.length;
  let Totalrun = 0
  const RenderDataChart = async () => {
    const options = {
      series: datachart,
      chart: {
         width: height, 
        type: 'pie',
      },
     /*  plotOptions: {
        pie: {
          size: height
        }
      }, */
      labels: datalable,
     colors:Color
       ,
      fill: {
        colors:Color
      } , 
     
      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        formatter(val, opts) {
          const name = opts.w.globals.labels[opts.seriesIndex]
          return name;
        },
        textAnchor: 'middle',
        distributed: false,
       /*  offsetX: -50,
        offsetY: -100, */
        style: {
            fontSize: '10px',
           /*  fontFamily: 'Helvetica, Arial, sans-serif', */
            colors: dataLabelscolor
        },
        dropShadow: {
          enabled: false,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: '#000',
          opacity: 0.35
      }, 
      },
       dropShadow: {
        enabled: false,
        enabledOnSeries: undefined,
        top: 0,
        left: 0,
        blur: 3,
        color: '#000',
        opacity: 0.35
    }, 
    legend: {
      show: legendShow,
      showForSingleSeries: false,
      showForNullSeries: true,
      showForZeroSeries: true,
      position: 'bottom',
      horizontalAlign: 'left', 
      floating: false,
      fontSize: '10px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      formatter: undefined,
      inverseOrder: false,
      width: undefined,
      height: undefined,
      tooltipHoverFormatter: undefined,
      customLegendItems: [],
      offsetX: 0,
      offsetY: 0,
      labels: {
          colors: undefined,
          useSeriesColors: false
      },
      markers: {
          width: 12,
          height: 12,
          strokeWidth: 0,
          strokeColor: '#fff',
          fillColors: undefined,
          radius: 12,
          customHTML: undefined,
          onClick: undefined,
          offsetX: 0,
          offsetY: 0
      },
      itemMargin: {
          horizontal: 5,
          vertical: 0
      },
      onItemClick: {
          toggleDataSeries: true
      },
      onItemHover: {
          highlightDataSeries: true
      },
  },
     /*  responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: witdthres
          },
         
        }
      }] */
     
    };

    $(idchart + " .apexcharts-canvas").remove();
    const chartsint = new ApexCharts(document.querySelector(idchart), options);
    chartsint.render();
  }

  const RenderDataChartColumn = async () => {
    const options = {
      series: [
        {
          name: name === 'B' ? 'Tỷ lệ' : name,
          data: datachart
        },
        {
          name: name1,
          data: data1
        },
        {
          name: name2,
          data: data2
        },
        {
          name: name3,
          data: data3
        }
      ],
      /*  đánh dấu một cột dữ liệu */
      annotations: {
        points: [{
          x: x,
          seriesIndex: 0,
          label: {
            borderColor: '#775DD0',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: textx,
          }
        }]
      },
      /*  sét loại và chiều cao của chart */
      chart: {
        height: height,
        type: type,
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: false,
          zoomedArea: {
            fill: {
              color: '#90CAF9',
              opacity: 0.4
            },
            stroke: {
              color: '#0D47A1',
              opacity: 0.4,
              width: 2
            }
          }
        }
        //offsetX: 100
      },

      /*  thuộc tính của chart */
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          dataLabels: {
            position: positionfix,
            style: {
              marginBottom: '350px'
            },
          },
        },
      },
      dataLabels: {
        enabled: Keycheck === 0 ? true : false,
        formatter: function (val) {
          if (Totalrun < Total) {
            Totalrun++
            return val + fixval;
          } else {
            return;
          }
        },
        offsetY: -25,
        style: {
          fontSize: '7px',
          colors: ["#304758"],

        }
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: colors
        },
        // padding: {
        //   left: 5, // or whatever value that works
        //   right: -500 // or whatever value that works
        // }
      },
      /* format x*/
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: datalable,
        tickPlacement: 'on'
      },
      /*  format y */
      yaxis: {
        text: title,
        labels: {
          formatter: function (value) {
            if (Keycheck !== 0) {
              /*   return value; */
              var p = value === undefined ? 0 : value.toFixed(0);
              var num = 0;
              if (p < 1000) return (p + "").replace(".", ",");
              return p.split("").reverse().reduce(function (acc, p, i, orig) {
                return p + (i && !(i % 3) ? "," : "") + acc;
              },
                "");
            }
            else {
              return value
            }
          }
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        },
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val, opts) {
                return val + fixval

              }
            }
          },
          {

            title: {
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }
              }
            }
          },
          {
            title: {
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }
              }
            }
          },
          {
            title: {
              enabled: true,
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }

              }
            }
          },
        ]
      },
    };

    $(idchart + " .apexcharts-canvas").remove();
    const chartsint = new ApexCharts(document.querySelector(idchart), options);
    chartsint.render();
  }

  const RenderDataChartLine = async () => {
    const options = {
      series: [
        {
          name: name === 'B' ? 'Tỷ lệ' : name,
          data: data
        },
        {
          name: name1,
          data: data1
        },
        {
          name: name2,
          data: data2
        },
        {
          name: name3,
          data: data3
        }
      ],
      /*  đánh dấu một cột dữ liệu */
      annotations: {
        points: [{
          x: x,
          seriesIndex: 0,
          label: {
            borderColor: '#775DD0',
            offsetY: 0,
            style: {
              color: '#fff',
              background: '#775DD0',
            },
            text: textx,
          }
        }]
      },
      /*  sét loại và chiều cao của chart */
      chart: {
        height: height,
        type: type,
      },
      /*  thuộc tính của chart */
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          dataLabels: {
            position: positionfix,
            style: {
              marginBottom: '350px'
            },
          },
        },
      },
      dataLabels: {
        enabled: Keycheck === 0 ? true : false,
        formatter: function (val) {
          return val + fixval;
        },
        offsetY: -20,
        style: {
          fontSize: '7px',
          colors: ["#304758"],

        }
      },
      stroke: {
        width: 2
      },

      grid: {
        row: {
          colors: colors
        }
      },
      /* format x*/
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: dataLable,
        tickPlacement: 'on'
      },
      /*  format y */
      yaxis: {
        text: title,
        labels: {
          formatter: function (value) {
            if (Keycheck !== 0) {
              /*   return value; */
              var p = value === undefined ? 0 : value.toFixed(0);
              var num = 0;
              if (p < 1000) return (p + "").replace(".", ",");
              return p.split("").reverse().reduce(function (acc, p, i, orig) {
                return p + (i && !(i % 3) ? "," : "") + acc;
              },
                "");
            }
            else {
              return value
            }
          }
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        },
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val, opts) {
                return val + fixval

              }
            }
          },
          {
           
            title: {
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }
              }
            }
          },
          {
            title: {
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }
              }
            }
          },
          {
            title: {
              enabled:true,
              formatter: function (val, opts) {
                if (name1 !== '') {
                  return val + fixval
                }
                else {
                  return ''
                }

              }
            }
          },
        ]
      },
    };

    $(idchart + " .apexcharts-canvas").remove();
    const chartsint = new ApexCharts(document.querySelector(idchart), options);
    chartsint.render();
  }











  let Name = []
  Object.values(data).forEach(x => {
    Name.push({ data: [x.y], name: x.label })
  })

  const RenderDataChartRow = async () => {
    var options = {
      series: Name,
      chart: {
      type: 'bar',
      height: 130,
      stacked: true,
      stackType: '100%',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: '#90CAF9',
            opacity: 0.4
          },
          stroke: {
            color: '#0D47A1',
            opacity: 0.4,
            width: 1  
          }
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#EE0000','#880000','#220000','#FFFF33','#CCFF33','#99FF33','#66FF33','#33FF33','#00FF33','#FFCC33','#CCCC33',
      '#99CC33','#66CC33','#33CC33','#00CC99','#FF9999','#CC9999',
      '#999999','#669999','#339999','#009999','#FF6699','#CC6699','#996699','#666699',
      '#336699','#006699','#FF3399','#CC3399','#993399','#663399','#333399','#0033CC','#FF00CC','#CC00CC','#9900CC','#6600CC']
    },
    xaxis: {
      categories: [""],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K"
        }
      }
    },
    fill: {
      opacity: 1
    
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'left',
      offsetX: 40
    }
    };

    $(idchart + " .apexcharts-canvas").remove();
    const chartsint = new ApexCharts(document.querySelector(idchart), options);
    chartsint.render();
  }

  return (
    //style={{overflowY:'scroll',overflowX:'scroll'}}
    <div id={id} >
    </div>
  )
};

export const ChartTemp = React.memo(ChartComp);