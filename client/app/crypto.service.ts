// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

var $ = require('jquery');
var sjcl = require('sjcl');

const HEX = 16;
const PRIME = ((2^128) - 157);


function generateRandNum() {
  return Math.floor(Math.random() * 10);
}

var record = {
  perpName: 'harvey weinstein',
  perpEmail: 'harvey@weinstein.com'
}

function encryptRecord(kId, record) {
  var kRecord = sjcl.random.randomWords(8);
  var c_record = JSON.parse(sjcl.encrypt(kRecord, JSON.stringify(record), {mode: 'gcm'}));
  var encryptedRecordKey = sjcl.encrypt(kId, kRecord, {mode: 'gcm'});
  return {record: c_record, key: encryptedRecordKey};
}

function hashData(data) {
    var bitArray = sjcl.hash.sha256.hash(data);  
    return sjcl.codec.hex.fromBits(bitArray); 
  }

function createDataSubmission(rid, userId) {
  // TODO: put rid into prg
  // derive slope & kId from rid
  var slope = parseInt(rid.substr(0,32), HEX);         
  var kId = rid.substr(32, 64);

  // encrypt record and key
  var encryptedRecord = encryptRecord(kId, record);

  // TODO: base x off of session ID
  var x = parseInt(hashData(userId), HEX);
  console.log('x', x);

  // derive secret
  var int_rid = parseInt(rid, HEX);
  var prod = (slope*x);
  var y = ((slope * x) + int_rid) % PRIME;
  console.log('original y', y,'prod',prod, y-prod);
  console.log('original rid: ',rid, 'int rid: ', parseInt(rid, HEX), 'original slope: ', slope);
  console.log('original kId', kId);

  var submission = {
      x: x,
      y: y,
      encryptedRecordKey: encryptedRecord.key,
      encryptedRecord: encryptedRecord.record,
      hashedPerpId: hashData(rid)
  };
  console.log('submission', submission)
  return submission;
}


// UNMASKING

function unmaskData(data) {
  var coordA, coordB;

  if (data[0].x < data[1].x) {
    coordA = data[0];
    coordB = data[1];
  } else {
    coordA = data[1];
    coordB = data[0];              
  }

    // TODO: decrypt secrets using CLA's private key
  // data[0].y = sjcl.decrypt(pair.sec, data[0].y);
  // data[0].y = sjcl.decrypt(pair.sec, data[0].y);

  var slope = getSlope(coordA, coordB);
  var rid = getIntercept(coordA, slope);

  console.log('rid', rid, 'slope', slope);
  
}

function getSlope(c1, c2) {
  return (c2.y - c1.y) / (c2.x - c1.x);
 }
 function getIntercept(c1, slope) {
  var x = c1.x;
  var y = c1.y;
  var prod = slope*x;
  console.log('prod',y-prod);

  return y - prod;
}


// all of crypto functions
export class CryptoService {
  public run() {
    for (var i = 0; i < 2; i++) {
      $.post('http://localhost:8080/postPerpId', {
        'pid':'https://www.facebook.com/weinsteinharvey/?ref=br_rs'
      }, function(data, status) {
        var submission = createDataSubmission(data.rid, generateRandNum());
        $.post('http://localhost:8080/postData', submission, function (data, status) {
          if (Object.keys(data[0]).length >= 2) {
              unmaskData(data);
          }
        });
      });
    // public run() {
    //     let record = {
    //         perpName: "harvey weinstein",
    //         perpEmail: "harvey@weinstein.com",
    //     };

    //     for (let i = 0; i < 2; i++) {
    //         $.post("http://localhost:8080/postPerpId", {
    //             pid: "https://www.facebook.com/weinsteinharvey/?ref=br_rs",
    //           }, function(data, status) {
    //               // output from PRF

    //             var rid = data.rid;

    //             // TODO: put rid into prg
    //             // derive slope & kId from rid
    //             var slope = parseInt(rid.substr(0,32), HEX);         
    //             var kId = rid.substr(32, 64);

    //             // encrypt record and key
    //             var kRecord = sjcl.random.randomWords(8);
    //             var c_record = JSON.parse(sjcl.encrypt(kRecord, JSON.stringify(record), {mode: 'gcm'}));
    //             var encryptedRecordKey = sjcl.encrypt(kId, kRecord, {mode: 'gcm'});

    //             // TODO: base x off of session ID
    //             var x = generateRandNum();

    //             // derive secret
    //             var y = ((slope * x) + parseInt(rid, HEX)) % PRIME;


    //             console.log('original rid: ',rid, 'int rid: ', parseInt(rid, HEX), 'original slope: ', slope);
    //             console.log('original kId', kId);
    //         });
    //     }
    // }
  }
}

