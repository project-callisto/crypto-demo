// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes

import * as $ from "jquery";
import * as sodium from 'libsodium-wrappers';

const HEX = 16;
const PRIME = ((2 ** 128) - 157);
const CT = 0;
const NONCE = 1;

// Initialize sodium
let sodium_promise = sodium.ready;


/* 
 *  KEY-PAIR GENERATION
 */
var claKeys, userKeys;

sodium_promise.then(function() {
  claKeys = sodium.crypto_box_keypair();
  userKeys = sodium.crypto_box_keypair();
});


/* 
 *  DATA OBJECTS
 */
export interface EncryptedData {
  // readonly rid: number;
  readonly hashedRid: string;
  readonly encryptedRecord: string;
  readonly encryptedRecordKey: string;
  readonly userPubKey: string;
  readonly cY: string;
  readonly nonces: string;
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


/*
 *  HELPER FUNCTIONS
 */


/* 
 * ENCRYPTION
 */
function encryptRecord(kId, record) {

  const kRecord = sodium.crypto_secretbox_keygen();
  
  const nonceRecord = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const nonceKey = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const cRecord = sodium.crypto_secretbox_easy(JSON.stringify(record), nonceRecord, kRecord);
  // todo: change key to kId
  const encryptedRecordKey = sodium.crypto_secretbox_easy(JSON.stringify(kRecord), nonceKey, sodium.crypto_secretbox_keygen());

  return {record: [cRecord.toString(), nonceRecord.toString()], key: [encryptedRecordKey.toString(), nonceKey.toString()]};

}

function generateRandNum() {
  return Math.floor(Math.random() * 10);
}

function deriveFromRid(rid) {

  const ridLen = rid.length;
  const slope = parseInt(rid.substr(0, ridLen / 2), HEX);
  const kId = rid.substr(ridLen / 2, ridLen);

  return {slope, kId};
}

function encryptSecretValue(y) {
  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES); 
  // NOTE: Built in to_string function is not working
  // console.log('nonce', sodium.to_string(nonce))
  const cY = sodium.crypto_box_easy(JSON.stringify(y), nonce, claKeys.publicKey, userKeys.privateKey);

  return [cY.toString(), nonce];
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

/*
 *  DECRYPTION
 */
function symmetricDecrypt(key, cipherText) {
  const split = cipherText.split('$');
  const cT = split[0];
  const nonce = split[1];

  return sodium.crypto_secretbox_open_easy(cT, nonce, key);
}


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

    var cYBytes = sodium.from_string(data[i].cY);
    var userPubKeyBytes = sodium.from_string(data[i].userPubKey);
    // var nonceBytes = sodium.from_string(data[i].nonces.cY);

    // var nonceBytes = Object.values(data[i].nonces.cY);
  
    var nonce = new Uint8Array(data[i].nonces.cY);

    console.log('n',nonce)
    var y = sodium.crypto_box_open_easy(cYBytes, nonce, claKeys.publicKey, userPubKeyBytes);
    console.log('y', y);
  }
}


function decryptSubmissions(data) {
  let coordA;
  let coordB;

  if (data[0].x < data[1].x) {
    coordA = data[0];
    coordB = data[1];
  } else {
    coordA = data[1];
    coordB = data[0];
  }

  coordA.nonces = JSON.parse(coordA.nonces);
  coordB.nonces = JSON.parse(coordB.nonces);

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

  // return {
  //   decryptedRecords: 'asdfasdfasdf',
  //   slope: 10,
  //   strRid: 'lollolollolololol'
  // }
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



/*
 *  CRYPTO SERVICE
 */
export class CryptoService {

  /*
   *  ENCRYPTION
   */
  public encryptData(plainText: PlainTextData): EncryptedData {
    // encrypt record and key
    const encryptedRecord = encryptRecord(plainText.kId, plainText.record);
    const encryptedY = encryptSecretValue(plainText.y);
    
    const nonces = {
      cY: encryptedY[NONCE],
      encryptedRecord: encryptedRecord.record[NONCE],
      encryptedRecordKey: encryptedRecord.key[NONCE]
    }
  
    return {
      hashedRid: sodium.crypto_hash(plainText.rid.toString()).toString(), 
      encryptedRecord: encryptedRecord.record[CT],
      encryptedRecordKey: encryptedRecord.key[CT],
      userPubKey: userKeys.publicKey.toString(),
      cY: encryptedY[CT],
      nonces: JSON.stringify(nonces),
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
  
  /* 
   * DECRYPTION
   */
  public decryptData() {
    $.get("http://localhost:8080/getEncryptedData", (data, status) => {
      if (status !== 'success') {
        console.log("Error retrieving data");
        return;
      }
      const decrypted = decryptSubmissions(data);
    });
    }
  }