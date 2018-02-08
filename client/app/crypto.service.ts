// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

var $ = require('jquery');
var sjcl = require('sjcl');

const HEX = 16;
const PRIME = 157;


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

    console.log(userId);
        // TODO: put rid into prg
        // derive slope & kId from rid
        var slope = parseInt(rid.substr(0,32), HEX);         
        var kId = rid.substr(32, 64);

        // encrypt record and key
        var encryptedRecord = encryptRecord(kId, record);

        // TODO: base x off of session ID
        var x = parseInt(hashData(userId), HEX);

        // derive secret
        var int_rid = parseInt(rid, HEX);
        var y = ((slope * x) + int_rid);

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


// function handleRid(userId) {

// }÷÷÷
// 

// all of crypto functions
export class CryptoService {
    run() {
        for (var i = 0; i < 2; i++) {
            $.post('http://localhost:8080/postPerpId', {
                'pid':'https://www.facebook.com/weinsteinharvey/?ref=br_rs'
              }, function(data, status) {
                var submission = createDataSubmission(data.rid, generateRandNum());
                $.post('http://localhost:8080/postData', submission, function (data, status) {
                    
                });
            });
        }
    }
}

