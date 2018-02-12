// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

import * as $ from 'jquery';
import * as sjcl from "sjcl";

function createXInputs(n) {
  var xInputs = [];
  for (var i = 0; i <= n; i++) {
    xInputs.push(i)
  }
  return xInputs;
}

function generateChartData(xInputs, f, m, b) {

  var chartData = [];
  for (var i = 0; i < xInputs.length; i++) {
    var y = f(i, m, b);
    chartData.push({x: i, y: y});
  }
  return chartData;

}

// TODO: include chart.js
function createChart(xInputs, chartData) {
  const ctx = document.getElementById('myChart').getContext('2d');

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


// hashed perp ID, encrypted record, hashed userId, secret
function insertTableRow(perpId, record, x, y) {
  var table = document.getElementById('dataTable');

  var row = table.insertRow(0);
  var perpCell = row.insertCell(0);
  var xCell = row.insertCell(1);
  var yCell = row.insertCell(2);
  var recordCell = row.insertCell(3);

  perpCell.innerHTML = perpId;
  xCell.innerHTML = x;
  yCell.innerHTML = y;
  recordCell.innerHTML = record.ct;
}

function displayLineString(slope, rid) {
  var lineString = 'y = ' + slope + 'x + ' + rid;
}

export class GraphService {

// {
//   decryptedRecords,
//   coordA,
//   coordB,
//   slope,
//   strRid
// }

  public generateGraph(decryptedData) {
    var f = new Function('x', 'm', 'b', 'return (m * x) + b;');

    var xInputs = createXInputs(decryptedData.coordB.x);
    var chartData = generateChartData(xInputs, f, decryptedData.slope, decryptedData.rid);
    createChart(xInputs, chartData);
    displayLineString(decryptedData.slope, decryptedData.rid);
  }

}
