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
  

  public generateGraph(x: number, chartData) {

    const xInputs = this.createXInputs(x);

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
