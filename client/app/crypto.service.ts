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
  var c_record = sjcl.encrypt(kRecord, JSON.stringify(record), {mode: 'gcm'});
  var encryptedRecordKey = sjcl.encrypt(kId, JSON.stringify(kRecord), {mode: 'gcm'});

  return {record: c_record, key: encryptedRecordKey};
}

function hashData(data) {
    var bitArray = sjcl.hash.sha256.hash(data);  
    return sjcl.codec.hex.fromBits(bitArray); 
  }


function deriveFromRid(rid) {

  var ridLen = rid.length;
  
  var slope = parseInt(rid.substr(0,ridLen/2), HEX);         
  
  var kId = rid.substr(ridLen/2, ridLen);

  return {slope: slope, kId: kId};
}


function createDataSubmission(rid, userId) {
  // TODO: put rid into prg
  // derive slope & kId from rid
  var derived = deriveFromRid(rid);
  var slope = derived.slope;
  var kId = derived.kId;
  console.log('original kId', kId);

  // encrypt record and key
  var encryptedRecord = encryptRecord(kId, record);

  // TODO: base x off of session ID
  // var x = parseInt(hashData(userId), HEX);
  var x = generateRandNum();
  console.log('x', x);

  // derive secret
  var int_rid = parseInt(rid, HEX);
  var prod = (slope*x);
  var y = ((slope * x) + int_rid);
  // console.log('original y', y,'prod',prod, 'minus', y-prod);
  console.log('original rid: ',rid, 'int rid: ', parseInt(rid, HEX), 'original slope: ', slope);

  var submission = {
      x: x,
      y: y,
      encryptedRecordKey: encryptedRecord.key,
      encryptedRecord: encryptedRecord.record,
      hashedPerpId: hashData(rid)
  };
  return submission;
}


// UNMASKING
function decryptRecords(data, rid) {

  var decryptedRecords = [];
  var derived = deriveFromRid(rid);

  for (var i = 0; i < data.length; i++) {
    var encryptedRecordKey = data[i].encryptedRecordKey;
    var encryptedRecord = data[i].encryptedRecord;

    // TODO:
    var decryptedRecordKey = sjcl.decrypt(derived.kId, encryptedRecordKey);
    console.log('decrypted ', sjcl);

    // var decryptedRecord = sjcl.decrypt(decryptedRecordKey, encryptedRecord);

    // decryptedRecords.push(decryptedRecord);
  }
  return [record, record];
  // return decryptedRecord;

}


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
  var strRid = rid.toString(HEX);
  // TODO: fix rid

  var decryptedRecords = decryptRecords(data, strRid);
  for (var i = 0; i < decryptedRecords.length; i++) {
    console.log(decryptedRecords[i])
  }
}

function getSlope(c1, c2) {
  return (c2.y - c1.y) / (c2.x - c1.x);
 }

function getIntercept(c1, slope) {
  var x = c1.x;
  var y = c1.y;
  var prod = slope*x;

  return y - prod;
}


export class CryptoService {
  public run() {
    for (var i = 0; i < 2; i++) {
      $.post('http://localhost:8080/postPerpId', {
        'pid':'https://www.facebook.com/weinsteinharvey/?ref=br_rs'
      }, function(data, status) {
        var submission = createDataSubmission('aaaa', generateRandNum());
        $.post('http://localhost:8080/postData', submission, function (data, status) {
          if (Object.keys(data[0]).length >= 2) {
              unmaskData(data);
          }
        });
      });
    }
  }
}