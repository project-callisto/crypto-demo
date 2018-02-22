// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import * as Chart from "chart.js";


export class GraphService {

  private createXInputs(n: number) {
    var xInputs = [];
    for (var i = 0; i <= n; i++) {
      xInputs.push(i)
    }
    return xInputs;
  }
  

  private generateChartData(xInputs, f, m, b) {

    var chartData = [];
    for (var i = 0; i < xInputs.length; i++) {
      var y = f(i, m, b);
      chartData.push({x: i, y: y});
    }
    return chartData;
  }
  
  public generateGraph(x: number, slope: number, rid: number) {


    const f = new Function('x', 'm', 'b', 'return (m * x) + b;');
    const xInputs = this.createXInputs(x);
    const chartData = this.generateChartData(xInputs, f, slope, rid);

    const ctx = document.getElementById('secretsChart');

    var data = {
      labels: xInputs,
      datasets: [{
        borderColor: "rgba(75, 192, 192, 1)",
        data: chartData,
        fill: false
      }]
    };

    return new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
          scales: {
          xAxes: [{
              gridLines: {
              color: 'white'
              }
          }],
          yAxes: [{
              color: '#FFF',
              ticks: {
                  beginAtZero:true
              }
          }]
        }
      }
    });
  }
}
