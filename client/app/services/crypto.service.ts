// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import { Injectable } from "@angular/core";
import * as bigInt from "big-integer";
import * as $ from "jquery";
import * as sodium from "libsodium-wrappers";
import encoding from "text-encoding";
/*
 *  GLOBAL CONSTANTS
 */
const HEX = 16;
const PRIME = ((2 ** 128) - 157); // TODO: use big num library


/*  SODIUM INTIALIZATION  */
const sodium_promise = sodium.ready;


/*
 *  KEY-PAIR GENERATION
 */
let claKeys, userKeys;

sodium_promise.then(function() {
  claKeys = sodium.crypto_box_keypair();
  userKeys = sodium.crypto_box_keypair();
});


/*
 *  DATA OBJECTS
 */
export interface EncryptedData {
  readonly hashedRid: string;
  readonly encryptedRecord: string;
  readonly encryptedRecordKey: string;
  readonly userPubKey: string;
  readonly cY: string;
  readonly cX: string;
  readonly kId: string; // FOR NOW. will need to hash this later
}

export interface PlainTextData {
  readonly rid: number;
  readonly slope: number;
  readonly kId: string;
  readonly record: Object;
  readonly recordKey: string;
  readonly hashedX: number;
  readonly y: number;
}


/*
 *  HELPER FUNCTIONS
 */


/*
 * ENCRYPTION
 */

 // TODO: split this to make it more readable
 // Returns base64
function symmetricEncrypt(key, msg) {

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const cT = sodium.crypto_secretbox_easy(msg, nonce, key);

  const encrypted = sodium.to_base64(cT) + "$" + sodium.to_base64(nonce);
  return encrypted;
}

function generateRandNum() {
  return Math.floor(Math.random() * 10);
}

function deriveFromRid(hexRid) {

  const ridLen = hexRid.length;

  const slope = bigInt(hexRid.substr(0, ridLen / 2), HEX);

  // hashing it to make it conform to key size: 32 bytes
  const kId = sodium.crypto_generichash(sodium.crypto_generichash_BYTES, hexRid.substr(ridLen / 2, ridLen));

  return {slope, kId};
}

// Y is a bigInt number
function encryptSecretValue(y) {

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const cY = sodium.crypto_box_easy(y.toString(), nonce, claKeys.publicKey, userKeys.privateKey);

  const encrypted = sodium.to_base64(cY) + "$" + sodium.to_base64(nonce);

  // string base 64
  return encrypted;
}

function generateDataValues(rid, userId) {

  const hexRid = sodium.to_hex(sodium.from_base64(rid));

  // var prgRid = sodium.crypto_hash_sha256(hexRid);

  // TODO: put rid into prg
  // derive slope & kId from rid
  // hex string
  const derived = deriveFromRid(hexRid);
  const hashedUserId = bigInt(sodium.to_hex(sodium.crypto_hash(userId.toString())), HEX);
  const intRid = bigInt(hexRid, HEX);

  // bigInt
  const y = derived.slope.times(hashedUserId).plus(intRid);

  // TODO: hook user name and email back to front-end
  // make issue on github
  const record = {
    perpId: "harvey weinstein",
    userName: "Alice Bob",
    userEmail: "user@email.com",
  };

  const Krecord = sodium.to_base64(sodium.crypto_secretbox_keygen());

  const plainTextData = {
    rid: intRid,
    slope: derived.slope,
    recordKey: Krecord,
    kId: sodium.to_base64(derived.kId),
    record,
    hashedX: hashedUserId, // bigInt fix this. should be hash of some user-based value
    y, // bigInt
  };
  return plainTextData;
}

/*
 *  DECRYPTION
 */

// Key is Uint8Array,
// CipherText: string in base64 encoding
function symmetricDecrypt(key, cipherText) {
  const split = cipherText.split("$");

  // Uint8Arrays
  const cT = sodium.from_base64(split[0]);
  const nonce = sodium.from_base64(split[1]);

  // cT
  key = sodium.from_base64(key);
  const decrypted = sodium.crypto_secretbox_open_easy(cT, nonce, key);

  return decrypted;
}


function decryptRecords(data, rid) {

  const decryptedRecords = [];
  const derived = deriveFromRid(rid.toString(HEX));

  for (let i = 0; i < data.length; i++) {
    const encryptedRecord = data[i].encryptedRecord;

    // key, ciphertext
    // const decryptedRecordKey = sodium.from_base64(data[i].encryptedRecordKey);
    const decryptedRecordKey = symmetricDecrypt(data[i].kId, data[i].encryptedRecordKey);
    // console.log('record key', sodium.to_string(decryptedRecordKey));
    const decryptedRecord = symmetricDecrypt(decryptedRecordKey, encryptedRecord);
    const dStr = new encoding.TextDecoder("utf-8").decode(decryptedRecord);
    decryptedRecords.push(JSON.parse(dStr));
  }
  return decryptedRecords;
}


// decrypt Y values
function decryptSecretValues(data) {
  for (let i = 0; i < data.length; i++) {
    const split = data[i].cY.split("$");

    // All values are now Uint8Array
    const cY = sodium.from_base64(split[0]);

    const nonce = sodium.from_base64(split[1]);

    const userPK = sodium.from_base64(data[i].userPubKey);

    // Uint8Array
    const y = sodium.crypto_box_open_easy(cY, nonce, userKeys.publicKey, claKeys.privateKey);

    // Convert back to bigInt
    const yStr = new encoding.TextDecoder("utf-8").decode(y);
    data[i].y = bigInt(yStr);
  }
}

function decryptSubmissions(data) {
  let coordA;
  let coordB;

  data[0].x = bigInt(data[0].cX);
  data[1].x = bigInt(data[1].cX);


  if (data[0].x.leq(data[1].x)) {
    coordA = data[0];
    coordB = data[1];
  } else {
    coordA = data[1];
    coordB = data[0];
  }


  //
  decryptSecretValues([coordA, coordB]);
  // populates data with y decrypted

  // slope is correct
  const slope = deriveSlope(coordA, coordB);
  const strRid = getIntercept(coordA, slope);

  // TODO: fix rid
  const record = decryptRecords(data, strRid.toString(HEX));


  return {
    decryptedRecords: {},
    slope,
    strRid,
  };

  // return {
  //   decryptedRecords: "asdfasdfasdf",
  //   slope: 10,
  //   strRid: "lollolollolololol",
  // };
}

function deriveSlope(c1, c2) {
  const top = c2.y.minus(c1.y);
  const bottom = c2.x.minus(c1.x);

  return top.divide(bottom);

}

// plug in value for x within line formula to get y-intercept aka rid
function getIntercept(c1, slope) {
  const x = c1.x;
  const y = c1.y;

  return y.minus(slope.times(x));
}



/*
 *  CRYPTO SERVICE
 */
@Injectable()
export class CryptoService {

  /*
   * access with this.jquery to get different versions of the jquery library
   * on the client (which uses basic jquery) vs the server (which uses jquery with jsdom)
   * this version of the function is the client side variant
   */
  public get jquery() { return $; }

  /*
   *  ENCRYPTION
   */
  public encryptData(plainText: PlainTextData): EncryptedData {
    // encrypt record and key
    // symmetric
    const encryptedRecord = symmetricEncrypt(sodium.from_base64(plainText.recordKey), JSON.stringify(plainText.record));
    const encryptedRecordKey = symmetricEncrypt(sodium.from_base64(plainText.kId), plainText.recordKey);
    // asymmetric

    // string, base64 encoding
    const cY = encryptSecretValue(plainText.y);

    return {
      hashedRid: sodium.to_base64(sodium.crypto_hash(plainText.rid.toString())),
      encryptedRecord,
      encryptedRecordKey,
      userPubKey: sodium.to_base64(userKeys.publicKey),
      cY,
      cX: plainText.hashedX.toString(),
      kId: plainText.kId, // TODO: change this when we decide what userID
    };
  }

  // TODO: insert proper type instead of object
  public createDataSubmission(perpId: string): Promise<PlainTextData> {
    const cryptoService = this;
    // TODO: return post itself
    const dataPromise = new Promise<PlainTextData>(function(resolve, reject) {
      cryptoService.jquery.post("/postPerpId", perpId, (data, status) => {
        if (status === "success") {
          const plainTextData = generateDataValues(data.rid, generateRandNum());
          resolve(plainTextData);
        } else {
          reject(Error("Post request failed"));
        }
      });
    });

    return dataPromise;
  }

  /*
   * DECRYPTION
   */
  public decryptData() {
    this.jquery.get("/getEncryptedData", (data, status) => {
      if (status !== "success") {
        console.log("Error retrieving data");
        return;
      }
      const decrypted = decryptSubmissions(data);
      // const dStr = new TextDecoder("utf-8").decode(decrypted);
      // console.log('decrypted', decrypted.toString());
    });
    }
  }
