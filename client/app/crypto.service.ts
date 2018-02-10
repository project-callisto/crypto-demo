// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

import * as $ from "jquery";
import * as sjcl from "sjcl";

const HEX = 16;
const PRIME = ((2 ** 128) - 157);


function generateRandNum() {
  return Math.floor(Math.random() * 10);
}

function encryptRecord(kId, record) {
  const kRecord = sjcl.random.randomWords(8);
  const cRecord = sjcl.encrypt(JSON.stringify(kRecord), JSON.stringify(record), {mode: "gcm"});
  const encryptedRecordKey = sjcl.encrypt(kId, JSON.stringify(kRecord), {mode: "gcm"});

  return {record: cRecord, key: encryptedRecordKey};
}

function hashData(data) {
  const bitArray = sjcl.hash.sha256.hash(data);
  return sjcl.codec.hex.fromBits(bitArray);
}


function deriveFromRid(rid) {

  const ridLen = rid.length;

  const slope = parseInt(rid.substr(0, ridLen / 2), HEX);

  const kId = rid.substr(ridLen / 2, ridLen);

  return {slope, kId};
}


function createDataSubmission(rid, userId) {
  // TODO: put rid into prg
  // derive slope & kId from rid
  const derived = deriveFromRid(rid);
  const slope = derived.slope;
  const kId = derived.kId;
  const record = {
    perpName: "harvey weinstein",
    perpEmail: "harvey@weinstein.com",
  };

  // encrypt record and key
  const encryptedRecord = encryptRecord(kId, record);

  // TODO: base x off of session ID
  // var x = parseInt(hashData(userId), HEX);
  const x = generateRandNum();

  // derive secret
  const intRID = parseInt(rid, HEX);
  const prod = (slope * x);
  const y = ((slope * x) + intRID);

  return {
      x,
      y,
      encryptedRecordKey: encryptedRecord.key,
      encryptedRecord: encryptedRecord.record,
      hashedPerpId: hashData(rid),
      rid: intRID,
  };
}


// UNMASKING
function decryptRecords(data, rid) {

  const decryptedRecords = [];
  const derived = deriveFromRid(rid);

  for (let i = 0; i < data.length; i++) {
    const encryptedRecordKey = data[i].encryptedRecordKey;
    const encryptedRecord = data[i].encryptedRecord;

    // TODO:
    const decryptedRecordKey = sjcl.decrypt(derived.kId, encryptedRecordKey);
    const decryptedRecord = sjcl.decrypt(decryptedRecordKey, encryptedRecord);

    decryptedRecords.push(decryptedRecord);
  }

  return decryptedRecords;

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

    // TODO: decrypt secrets using CLA's private key
  // data[0].y = sjcl.decrypt(pair.sec, data[0].y);
  // data[0].y = sjcl.decrypt(pair.sec, data[0].y);

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

export class CryptoService {

  public encryptData(perpId: string): object {
    return createDataSubmission(perpId, generateRandNum());
  }

  public decryptData(submissions) {
    for (let i = 0; i < submissions.lengt; i++) {
      $.post("http://localhost:8080/postData", submissions[i], (data, status) => {
        if (Object.keys(data[0]).length >= 2) {
          const unmasked = unmaskData(data);
          console.log("unmasked", unmasked);
        }
      });
    }
  }

}
