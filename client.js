

$(document).ready(function() {
    // TODO: need to generate this based on rid
    const slope = generateStaticSlope();
    var count = 0;
    $("#submitBtn").click(function(){
        var userId = count;
        count += 1;

      $.post('http://localhost:8080/postPID', {
        'userId': userId,
        'pid':'https://www.facebook.com/weinsteinharvey/?ref=br_rs'
      }, function(data, status) {
        const int_rid = parseInt(data.rid);

        const record = {name: 'name', incident: "asdfasdf"};

        const c_record = encryptRecord(record);
        const x = createXCoord(userId);
        const kId = sjcl.random.randomWords(8);


        const y = (slope * x) + (int_rid % ((2^128)-17));
   

        $.post('http://localhost:8080/postData', {
          record: c_record,
          y: y,
          x: x
        }, function(data, status) {
          // todo: change this
          if (Object.keys(data[0]).length >= 2) {

            var c1, c2;

            if (data[0].x < data[1].x) {
              c1 = data[0];
              c2 = data[1];
            } else {
              c1 = data[1];
              c2 = data[0];              
            }

            const ctx = document.getElementById('myChart').getContext('2d');
            const rid = getIntercept(c1, c2);
            const c0 = {x: 0, y: rid};
            createChart(ctx, c0, c1, c2);


            

          }
        });
      });
    });
  });






function getIntercept(c1, c2) {
    var slope = (c2.y - c1.y) / (c2.x - c1.x);
    // console.log('a',a)
    var rid = c1.y - (slope * c1.x);
    console.log('slope', slope,'rid', rid)
    return rid;
}


function createChart(ctx, c0, c1, c2) {

    var data = {
    labels: [0, c1.x, c2.x],
        datasets: [{
            borderColor: "rgba(75, 192, 192, 1)",
            data: [c0,c1,c2],
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


function encryptRecord(record) {
  const kRecord = sjcl.random.randomWords(8);
  return sjcl.encrypt(kRecord, JSON.stringify(record), {mode: 'gcm'});
}

function createXCoord(userId) {
  var bitArray = sjcl.hash.sha256.hash(userId);  
  var x = sjcl.codec.hex.fromBits(bitArray); 
  // TODO: check this
  return parseInt(x);
}


function generateStaticSlope() {

  return Math.floor(Math.random() * 256);

}
