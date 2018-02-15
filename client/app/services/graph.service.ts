// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

import * as $ from "jquery";
import * as sjcl from "sjcl";

function createXInputs(n) {
  let xInputs = [];
  for (let i = 0; i <= n; i++) {
    xInputs.push(i);
  }
  return xInputs;
}

function generateChartData(xInputs, f, m, b) {

  let chartData = [];
  for (let i = 0; i < xInputs.length; i++) {
    let y = f(i, m, b);
    chartData.push({x: i, y});
  }
  return chartData;

}

// TODO: include chart.js
function createChart(xInputs, chartData) {
  const ctx = document.getElementById("myChart").getContext("2d");

  let data = {
  labels: xInputs,
      datasets: [{
          borderColor: "rgba(75, 192, 192, 1)",
          data: chartData,
          fill: false,
      }],
  };

  return new Chart(ctx, {
  type: "line",
  data,
  options: {
      scales: {
      xAxes: [{
          gridLines: {
          color: "white",
          },
      }],
      yAxes: [{
          color: "#FFF",
          ticks: {
              beginAtZero: true,
          },
      }],
      },
    },
  });
}


// hashed perp ID, encrypted record, hashed userId, secret
function insertTableRow(perpId, record, x, y) {
  let table = document.getElementById("dataTable");

  let row = table.insertRow(0);
  let perpCell = row.insertCell(0);
  let xCell = row.insertCell(1);
  let yCell = row.insertCell(2);
  let recordCell = row.insertCell(3);

  perpCell.innerHTML = perpId;
  xCell.innerHTML = x;
  yCell.innerHTML = y;
  recordCell.innerHTML = record.ct;
}

function displayLineString(slope, rid) {
  let lineString = "y = " + slope + "x + " + rid;
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
    let f = new Function("x", "m", "b", "return (m * x) + b;");

    let xInputs = createXInputs(decryptedData.coordB.x);
    let chartData = generateChartData(xInputs, f, decryptedData.slope, decryptedData.rid);
    createChart(xInputs, chartData);
    displayLineString(decryptedData.slope, decryptedData.rid);
  }
}
