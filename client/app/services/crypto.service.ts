// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import { Injectable } from "@angular/core";
import * as $ from "jquery";
import * as sodium from "libsodium-wrappers";
import * as encoding from "text-encoding";
import bigInt = require('big-integer');


/** 
 * Data Objects
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
  readonly rid: bigInt.BigInteger;
  readonly slope: bigInt.BigInteger;
  readonly kId: string;
  readonly record: Record;
  readonly recordKey: string;
  readonly hashedX: bigInt.BigInteger;
  readonly y: bigInt.BigInteger;
}

export interface Coord {
  readonly x: bigInt.BigInteger,
  readonly y: bigInt.BigInteger
}

export interface DecryptedData {
  readonly decryptedRecords: Object;
  readonly slope: bigInt.BigInteger;
  readonly rid: bigInt.BigInteger;
}

export interface RIDComponents {
  readonly slope: bigInt.BigInteger;
  readonly kId: Uint8Array;
}

export interface Record {
  readonly perpId: string;
  readonly userName: string;
}

/** 
 * SODIUM INITIALIZATION
*/
const sodium_promise = sodium.ready;

/** 
 * Key-Pair Generation
 * @param {Object} ocKeys - Callisto Options Counselor public-private key pair (Uint8Array[32])
 * @param {Object} userKeys - User public-private key pair (Uint8Array[32]) for message authentication
*/
let ocKeys, userKeys;

sodium_promise.then(function() {
  ocKeys = sodium.crypto_box_keypair();
  userKeys = sodium.crypto_box_keypair();
});


/**
 * CRYPTO SERVICE
 */
@Injectable()
export class CryptoService {

  /**
   * CONSTANTS
   * @param {Array<EncryptedData>} dataSubmissions - storage for user inputted and generated data
   * @param {number} HEX - constant for conversions to hexadecimal
   */
  private dataSubmissions = [];
  private HEX = 16;
  // private PRIME = ((2 ** 128) - 157); // TODO: use big num library  


  /**
   * ENCRYPTION
   */

  /**
   * Takes RID partitions the first 128 bits for the slope and the second 128 bits for kId
   * @param {string} hexRid - RID in hex string form
   * @returns {RidComponents} slope (bigInt.BigInteger), kId (Uint8Array[32])
   */
  private deriveFromRid(hexRid: string): RIDComponents {

    const ridLen = hexRid.length;
    const slope = bigInt(hexRid.substr(0, ridLen / 2), this.HEX);
  
    const kId = sodium.crypto_generichash(sodium.crypto_generichash_BYTES, hexRid.substr(ridLen / 2, ridLen));
    return {slope, kId};
  }

  /**
   * Encrypts y using public-key encryption with the OC's public key
   * @param {bigInt.BigInteger} y - value derived from mx + RID
   * @returns {string} the encrypted value in base 64 encoding
   */
  private encryptSecretValue(y: bigInt.BigInteger): string {

    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const cY = sodium.crypto_box_easy(y.toString(), nonce, ocKeys.publicKey, userKeys.privateKey);
    const encrypted = sodium.to_base64(cY) + "$" + sodium.to_base64(nonce);

    return encrypted;
  }

  /**
   * Generates and formats all values needed to for linear secret sharing
   * @param {string} rid - randomized perpetrator ID in base 64 encoding
   * @param {string} userId - inputted user name
   * @param {Record} record - object containing the perpetrator ID and user name
   * @returns {PlainTextData} all values needed to be encrypted
   */
  private generateDataValues(rid: string, userId: string, record: Record): PlainTextData {
    const prgRid = sodium.to_hex(sodium.crypto_hash(sodium.from_base64(rid)));  

    const derived = this.deriveFromRid(prgRid);
    const hashedUserId = bigInt(sodium.to_hex(sodium.crypto_hash(userId)), this.HEX);
    const bigIntRid = bigInt(prgRid, this.HEX);

    const pt = {
      rid: bigIntRid, 
      slope: derived.slope,  
      recordKey: sodium.to_base64(sodium.crypto_secretbox_keygen()), // base64 encoding
      kId: sodium.to_base64(derived.kId),
      record, 
      hashedX: hashedUserId, 
      y: derived.slope.times(hashedUserId).plus(bigIntRid), 
    };

    return pt;
  }

  /**
   * Symmetric encryption using given key
   * @param {Uint8Array} key - 32 byte key
   * @param {string} msg
   * @returns {string} ciphertext concatenated with a nonce, both in base 64 encoding
   */
  private symmetricEncrypt(key: Uint8Array, msg: string): string {
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const cT = sodium.crypto_secretbox_easy(msg, nonce, key);
    const encrypted = sodium.to_base64(cT) + "$" + sodium.to_base64(nonce);

    return encrypted;
  }

  /**
   * Main function for encrypting values
   * @param {PlainTextData} plainText - all plaintext values needed to be encrypted
   * @returns {EncryptedData} object containing all encrypted values to be stored
   */
  public encryptData(plainText: PlainTextData): EncryptedData {

    const encryptedRecord = this.symmetricEncrypt(sodium.from_base64(plainText.recordKey), JSON.stringify(plainText.record));
    const encryptedRecordKey = this.symmetricEncrypt(sodium.from_base64(plainText.kId), plainText.recordKey);

    // base64 encoding
    const cY = this.encryptSecretValue(plainText.y);

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

  /**
   * Function for taking user inputs and returning values to be encrypted
   * @param {string} perpId - inputted perpetrator name
   * @param {string} userName - inputted user name
   * @returns {Promise<{}>} promise resolving a PlainTextData object
   */
  public createDataSubmission(perpId: string, userName: string): Promise<{}> {

    const record = {
      perpId,
      userName,
    };

    const cryptoService = this;
    const dataPromise = new Promise(function(resolve, reject) {
      $.post("/postPerpId", {perpId}, (data, status) => {
        if (status === "success") {

          const plainTextData = cryptoService.generateDataValues(data.rid, userName, record);
          resolve(plainTextData);
        
        } else {
          reject(Error("Post request failed"));
        }
      });
    });

    return dataPromise;
  }

  /** 
   * Stores encrypted data 
   * @param {EncryptedData} encryptedData 
   * @returns nothing 
   */ 
  public postData(encryptedData: EncryptedData): void {
    this.dataSubmissions.push(encryptedData);
  }


  /**
   * DECRYPTION
   */

  /**
   * Searches for and returns entries with the same RID 
   * @returns {Array<EncryptedData} matched entries
   */
  private getMatchedData(): Array<EncryptedData> {
    for (let i = 1; i < this.dataSubmissions.length; i++) {
      if (this.dataSubmissions[0].hashedRid === this.dataSubmissions[i].hashedRid) {
        return [this.dataSubmissions[0], this.dataSubmissions[i]];
      }
    }
  }

  /**
   * Creates a Coord object based on inputs
   * @param {EncryptedData} data - Encrypted data object containing an x value
   * @param {bigInt.BigInteger} y 
   * @returns {Coord} coordinate used for computations 
   */
  private createCoord(data: EncryptedData, y: bigInt.BigInteger): Coord {
    return {
      x: bigInt(data.cX),
      y
    }
  }

  /**
   * Main function for decryption
   * @returns {DecryptedData}
   */
  public decryptData(): DecryptedData {
    let data = this.getMatchedData();
    if (data.length < 2) {
      return {decryptedRecords: [], slope: bigInt(0), rid: bigInt(0)};
    }

    const yValues = this.decryptSecretValues(data);

    let coordA = this.createCoord(data[0], yValues[0]);
    let coordB = this.createCoord(data[1], yValues[1]);

    if (coordA.x.geq(coordB.x)) {
      const temp = coordA;
      coordA = coordB;
      coordB = temp;
    }

    const slope = this.deriveSlope(coordA, coordB);
    const rid = this.getIntercept(coordA, slope);

    return {
      decryptedRecords: this.decryptRecords(data, rid.toString(this.HEX)),
      slope,
      rid
    };
  }

  /**
   * Handles record decryption based on RID
   * @param {Array<EncryptedData>} data - matched encrypted data
   * @param {string} rid - randomized perpetrator ID
   * @returns {Array<Record>} array of decrypted records
   */
  /* TODO: Figure out type of rid*/
  private decryptRecords(data: Array<EncryptedData>, rid) {

    const decryptedRecords = [];
    const derived = this.deriveFromRid(rid.toString(this.HEX));
  
    for (let i = 0; i < data.length; i++) {
      const encryptedRecord = data[i].encryptedRecord;
      const decryptedRecordKey = this.symmetricDecrypt(data[i].kId, data[i].encryptedRecordKey);
      const decryptedRecord = this.symmetricDecrypt(decryptedRecordKey, encryptedRecord);
      const dStr = new encoding.TextDecoder("utf-8").decode(decryptedRecord);
      decryptedRecords.push(JSON.parse(dStr));
    }
    return decryptedRecords;
  }
    
  /**
   * Symmetric decryption
   * @param {string} key 
   * @param {string} cipherText - base 64 encoding
   * @returns {Uint8Array} decrypted value 
   */
  //TODO: figure out return statement
  private symmetricDecrypt(key: string, cipherText: string) {
    const split = cipherText.split("$");

    // Uint8Arrays
    const cT = sodium.from_base64(split[0]);
    const nonce = sodium.from_base64(split[1]);
    const decrypted = sodium.crypto_secretbox_open_easy(cT, nonce, sodium.from_base64(key));

    return decrypted;
  }

  /**
   * Decrypts y value, which has been assymetrically encrypted
   * @param {Array<EncryptedData>} data - array of matched EncryptedData values
   * @returns {Array<bigInt.BigInteger>} corresponding y values for data submissions 
   */
  private decryptSecretValues(data: Array<EncryptedData>): Array<bigInt.BigInteger> {
    let yValues = [];
    for (let i = 0; i < 2; i++) {
      const split = data[i].cY.split("$");

      // All values are UInt8Array
      const cY = sodium.from_base64(split[0]);
      const nonce = sodium.from_base64(split[1]);
      const userPK = sodium.from_base64(data[i].userPubKey);
      const y = sodium.crypto_box_open_easy(cY, nonce, userKeys.publicKey, ocKeys.privateKey);

      // Convert back to bigInt
      const yStr = new encoding.TextDecoder("utf-8").decode(y);
      yValues.push(bigInt(yStr));
    }
    return yValues;
  }

  /**
   * Computes a slope based on the slope formula
   * @param {Coord} c1 - 1st coordinate
   * @param {Coord} c2 - 2nd coordinate
   * @returns {bigInt.BigInteger} slope value
   */
  private deriveSlope(c1: Coord, c2: Coord): bigInt.BigInteger {
    const top = c2.y.minus(c1.y);
    const bottom = c2.x.minus(c1.x);

    return top.divide(bottom);
  }

  /**
   * Computes RID, which is the y-intercept
   * @param {Coord} c1 - a given coordinate
   * @param {bigInt.BigInteger} slope 
   */
  private getIntercept(c1: Coord, slope: bigInt.BigInteger) {
    const x = c1.x;
    const y = c1.y;

    return y.minus(slope.times(x));
  }  
}