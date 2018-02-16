// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

import * as $ from "jquery";
import * as sodium from 'libsodium-wrappers';

let sodium_promise = sodium.ready;

var claKeys, userKeys;

sodium_promise.then(function() {
  claKeys = sodium.crypto_box_keypair();
  userKeys = sodium.crypto_box_keypair();
});

const HEX = 16;
const PRIME = ((2 ** 128) - 157);


function generateRandNum() {
  return Math.floor(Math.random() * 10);
}

function encryptRecord(kId, record) {

  const kRecord = sodium.crypto_secretbox_keygen();
  
  const nonceRecord = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const nonceKey = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const cRecord = sodium.crypto_secretbox_easy(JSON.stringify(record), nonceRecord, kRecord);
  // todo: change key to kId
  const encryptedRecordKey = sodium.crypto_secretbox_easy(JSON.stringify(kRecord), nonceKey, sodium.crypto_secretbox_keygen());

  return {record: cRecord + "$" + nonceRecord, key: encryptedRecordKey + "$" + nonceKey};

}

function deriveFromRid(rid) {

  const ridLen = rid.length;
  const slope = parseInt(rid.substr(0, ridLen / 2), HEX);
  const kId = rid.substr(ridLen / 2, ridLen);

  return {slope, kId};
}

function encryptSecretValue(y) {
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES); 
  const cY = sodium.crypto_box_easy(JSON.stringify(y), nonce, claKeys.publicKey, userKeys.privateKey) + '$' + nonce;

  return cY;
}

function generateDataValues(rid, userId) {

  // TODO: put rid into prg
  // derive slope & kId from rid
  const derived = deriveFromRid(rid);
  const record = {
    perpName: "harvey weinstein",
    perpEmail: "harvey@weinstein.com",
  };

  const intRid = parseInt(rid, HEX);
  
  let plainTextData = {
    rid: intRid,
    slope: derived.slope,
    kId: derived.kId,
    record: record,
    x: userId, // fix this. should be hash of some user-based value
    y: (derived.slope * userId) + intRid
  }

  return plainTextData;
}

function symmetricDecrypt(key, cipherText) {
  const split = cipherText.split('$');
  const cT = split[0];
  const nonce = split[1];

  return sodium.crypto_secretbox_open_easy(cT, nonce, key);
}


// UNMASKING
function decryptRecords(data, rid) {

  const decryptedRecords = [];
  const derived = deriveFromRid(rid);

  for (let i = 0; i < data.length; i++) {
    const encryptedRecordKey = data[i].encryptedRecordKey;
    const encryptedRecord = data[i].encryptedRecord;

    const decryptedRecordKey = symmetricDecrypt(derived.kId, encryptedRecordKey);    
    const decryptedRecord = symmetricDecrypt(decryptedRecordKey, encryptedRecord);

    decryptedRecords.push(decryptedRecord);
  }
  return decryptedRecords;
}


// decrypt Y values
function decryptSecrets(data) {
  for (var i = 0; i < data.length; i++) {
    var split = data[i].y.split("$");
    var cY = split[0];
    var nonce = split[1]; 

    data[i].y = sodium.crypto_box_open_easy(cY, nonce, claKeys.publicKey, data[i].userPubKey);
  }
}


function unmaskData(data) {
  let coordA;
  let coordB;

  if (data[0].x < data[1].x) {
    coordA = data[0];
    coordB = data[1];
  } else {
    coordA = data[1];
    coordB = data[0];
  }

  decryptSecrets([coordA, coordB]);

  const slope = getSlope(coordA, coordB);
  const rid = getIntercept(coordA, slope);
  const strRid = rid.toString(HEX);
  // TODO: fix rid

  return {
    decryptedRecords: decryptRecords(data, strRid),
    slope,
    strRid,
  };
}

function getSlope(c1, c2) {
  return (c2.y - c1.y) / (c2.x - c1.x);
 }

function getIntercept(c1, slope) {
  const x = c1.x;
  const y = c1.y;
  const prod = slope * x;

  return y - prod;
}

export interface EncryptedData {
    // readonly rid: number;
    readonly hashedRid: string;
    readonly encryptedRecord: string;
    readonly encryptedRecordKey: string;
    readonly userPubKey: string;
    readonly cY: string;
    readonly cX: number; // FOR NOW. will need to hash this later 
}

export interface PlainTextData {
  readonly rid: number,
  readonly slope: number,
  readonly kId: string, 
  readonly record: Object,
  readonly x: number,
  readonly y: number
}

export class CryptoService {
  
  public encryptData(plainText: PlainTextData): EncryptedData {
    // encrypt record and key
    const encryptedRecord = encryptRecord(plainText.kId, plainText.record);
    const cY = encryptSecretValue(plainText.y);
  
    return {
      hashedRid: sodium.crypto_hash(plainText.rid.toString()), 
      encryptedRecord: encryptedRecord.record,
      encryptedRecordKey: encryptedRecord.key,
      userPubKey: userKeys.publicKey,
      cY: cY,
      cX: plainText.x
    };
  }  

  // TODO: insert proper type instead of object
  public createDataSubmission(perpId: string): Promise<{}> {
    let rid = 0;
    
    var dataPromise = new Promise(function(resolve, reject) {
      $.post("http://localhost:8080/postPerpId", perpId, (data, status) => {
        if (status === 'success') {
          // let rid = data.rid;
          let plainTextData = generateDataValues(data.rid, generateRandNum());
          resolve(plainTextData);
        } else {
          reject(Error('Post request failed'));
        }
      });  
    });

    return dataPromise;
  }

  public decryptData(submissions) {
    $.get("http://localhost:8080/getEncryptedData", (data, status) => {
      if (status !== 'success') {
        
      }
    });
    // for (let i = 0; i < submissions.length; i++) {
    //   $.post("http://localhost:8080/postData", submissions[i], (data, status) => {
    //     if (Object.keys(data[0]).length >= 2) {

    //       const unmasked = unmaskData(data);
    //       console.log("unmasked", unmasked);
    //     }
    //   });
    // }
  }
}
