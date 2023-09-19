import React, { useState} from "react";
// import {Chart} from 'chart.js';
import $ from 'jquery'
const ChartComp = ({ 
  data = () => {},
  type = 'column',
  title = '',
  subtitles = '',
  height = 380,
  Typerun = 1
}) => { /* type="bar|line|area|bubble|pie" */
  

  const [options,setoptions] = useState({
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

  const RenderDataChart = async () => {
      await setoptions(
          {
              backgroundColor: "#fff",
              title: {
                text: title,
                fontSize:22,
                fontColor: '#80b98d',
                fontWeight:'lighter',
                fontFamily:'arial',
                padding:10,
                verticalAlign:'top'
              },
              subtitles:[
                {
                  text: subtitles
                }
              ],
              // dataPointWidth: 5,
              height:height,
              zoomEnabled: true,
              zoomType: "xy",
              animationEnabled: true,
              animationDuration: 2000,
              // toolTip:{
              //   enabled: true   //enable here
              // },
              axisX:{// show all labels name
                interval: 1
              },
              data: [
                {
                    type: type,
                    dataPoints: data,
                    indexLabel: "{label} - {y}%",
                    toolTipContent: "<b>{label}</b>: {y}%",
                    legendText: "{label}",
                }
              ]
            }
      )
      $(".canvasjs-chart-credit").remove();
  }

return (
    <div id="chart">
    {/* <Chart 
        options={options} 
    /> */}
  </div>
)
};

export const ChartTemp2 = React.memo(ChartComp);