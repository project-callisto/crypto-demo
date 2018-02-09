// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

var $ = require('jquery');
var sjcl = require('sjcl');

const HEX = 16;
const PRIME = 157;


function generateRandNum() {
    return Math.floor(Math.random() * 10);
}

// all of crypto functions
export class CryptoService {
    public run() {
        let record = {
            perpName: "harvey weinstein",
            perpEmail: "harvey@weinstein.com",
        };

        for (let i = 0; i < 2; i++) {
            $.post("http://localhost:8080/postPerpId", {
                pid: "https://www.facebook.com/weinsteinharvey/?ref=br_rs",
              }, function(data, status) {
                  // output from PRF

                var rid = data.rid;

                // TODO: put rid into prg
                // derive slope & kId from rid
                var slope = parseInt(rid.substr(0,32), HEX);         
                var kId = rid.substr(32, 64);

                // encrypt record and key
                var kRecord = sjcl.random.randomWords(8);
                var c_record = JSON.parse(sjcl.encrypt(kRecord, JSON.stringify(record), {mode: 'gcm'}));
                var encryptedRecordKey = sjcl.encrypt(kId, kRecord, {mode: 'gcm'});

                // TODO: base x off of session ID
                var x = generateRandNum();

                // derive secret
                var y = ((slope * x) + parseInt(rid, HEX)) % PRIME;


                console.log('original rid: ',rid, 'int rid: ', parseInt(rid, HEX), 'original slope: ', slope);
                console.log('original kId', kId);
            });
        }
    }
}

