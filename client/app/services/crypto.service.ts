// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import * as $ from "jquery";
import * as sodium from 'libsodium-wrappers';


/*
 *  GLOBAL CONSTANTS
 */
const HEX = 16;
const PRIME = ((2 ** 128) - 157); // TODO: use big num library
const CT = 0;
const NONCE = 1;


/*  SODIUM INTIALIZATION  */
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
  readonly cX: number;
  readonly kId: string; // FOR NOW. will need to hash this later 
}

export interface PlainTextData {
readonly rid: number,
readonly slope: number,
readonly kId: string, 
readonly record: Object,
readonly recordKey: string,
readonly x: number,
readonly y: number
}


/*
 *  HELPER FUNCTIONS
 */


/* 
 * ENCRYPTION
 */

 // TODO: split this to make it more readable
function symmetricEncrypt(key, msg) {

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  const cT = sodium.crypto_secretbox_easy(msg, nonce, key);

  const encrypted = sodium.to_base64(cT) + '$' + sodium.to_base64(nonce);
  return encrypted;
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
  var nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES); 
  var cY = sodium.crypto_box_easy(y.toString(), nonce, claKeys.publicKey, userKeys.privateKey);

  const encrypted = sodium.to_base64(cY) + '$' + sodium.to_base64(nonce);
  
  return encrypted;
}

function generateDataValues(rid, userId) {

  // TODO: put rid into prg
  // derive slope & kId from rid
  const derived = deriveFromRid(rid);

  // TODO: hook user name and email back to front-end
  // make issue on github
  const record = {
    perpId: "harvey weinstein",
    userName: 'Alice Bob',
    userEmail: 'user@email.com'
  };

  const intRid = parseInt(rid, HEX);
  
  let plainTextData = {
    rid: intRid,
    slope: derived.slope,
    recordKey: sodium.to_base64(sodium.crypto_secretbox_keygen()),
    // todo:
    // kId: derived.kId,
    kId: sodium.to_base64(sodium.crypto_secretbox_keygen()),
    record: record,
    x: userId, // fix this. should be hash of some user-based value
    y: (derived.slope * userId) + intRid
  }
  return plainTextData;
}

/*
 *  DECRYPTION
 */

// Key is Uint8Array,
// CipherText: string in base64 encoding
function symmetricDecrypt(key, cipherText) {

  const split = cipherText.split('$');

  // Uint8Arrays
  const cT = sodium.from_base64(split[0]);
  const nonce = sodium.from_base64(split[1]);

  const decrypted = sodium.crypto_secretbox_open_easy(cT, nonce, key);

  console.log('decrypted', sodium.to_string(decrypted))

  return decrypted;
}


function decryptRecords(data, rid) {

  const decryptedRecords = [];
  // TODO:
  // const derived = deriveFromRid(rid);

  for (let i = 0; i < data.length; i++) {
    const encryptedRecordKey = data[i].encryptedRecordKey;
    const encryptedRecord = data[i].encryptedRecord;

    // key, ciphertext
    const decryptedRecordKey = symmetricDecrypt(sodium.from_base64(data[i].kId), encryptedRecordKey);    
    const decryptedRecord = symmetricDecrypt(decryptedRecordKey, encryptedRecord);

    decryptedRecords.push(decryptedRecord);
  }
  return decryptedRecords;
}


// decrypt Y values
function decryptSecrets(data) {
  for (var i = 0; i < data.length; i++) {
    const split = data[i].cY.split('$');

    var cY = sodium.from_base64(split[0]);
    var nonce = sodium.from_base64(split[1]);

    var userPK = sodium.from_base64(data[i].userPubKey);
  
    var y = sodium.crypto_box_open_easy(cY, nonce, userKeys.publicKey, claKeys.privateKey);

    console.log('secret', y);
    data[i].y = y;
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

  decryptSecrets([coordA, coordB]);

  // const slope = getSlope(coordA, coordB);

  // const rid = getIntercept(coordA, slope);
  // const strRid = rid.toString(HEX);
  // TODO: fix rid
  decryptRecords(data, 'meow');

  // return {
  //   decryptedRecords: decryptRecords(data, strRid),
  //   slope,
  //   strRid,
  // };

  return {
    decryptedRecords: 'asdfasdfasdf',
    slope: 10,
    strRid: 'lollolollolololol'
  }
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
    // symmetric
    const encryptedRecord = symmetricEncrypt(sodium.from_base64(plainText.recordKey), JSON.stringify(plainText.record));
    const encryptedRecordKey = symmetricEncrypt(sodium.from_base64(plainText.kId), sodium.to_base64(plainText.recordKey))
    // const encryptedRecord = encryptRecord(plainText.kId, plainText.record);
    // asymmetric
    const cY = encryptSecretValue(plainText.y);
    
    // TODO:
    const nonces = {}
  
    return {
      hashedRid: sodium.to_base64(sodium.crypto_hash(plainText.rid.toString())), 
      encryptedRecord: encryptedRecord,
      encryptedRecordKey: encryptedRecordKey,
      userPubKey: sodium.to_base64(userKeys.publicKey),
      cY: cY,
      nonces: JSON.stringify(nonces),
      cX: plainText.x,
      kId: plainText.kId // TODO: change this when we decide what userID
    };
  }  
  
  // TODO: insert proper type instead of object
  public createDataSubmission(perpId: string): Promise<{}> {

    // TODO: return post itself
    var dataPromise = new Promise(function(resolve, reject) {
      $.post("http://localhost:8080/postPerpId", perpId, (data, status) => {
        if (status === 'success') {
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