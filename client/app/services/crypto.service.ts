// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import { Injectable } from "@angular/core";
import bigInt = require("big-integer");
import * as $ from "jquery";
import * as sodium from "libsodium-wrappers";
import * as encoding from "text-encoding";

/**
 * Data Objects
 */

export interface IEncryptedData {
  readonly hashedRid: string;
  readonly encryptedRecord: string;
  readonly encryptedRecordKey: string;
  readonly userPubKey: string;
  readonly cY: string;
  readonly cX: string;
  readonly kId: string; // FOR NOW. will need to hash this later
}

export interface IPlainTextData {
  readonly rid: bigInt.BigInteger;
  readonly slope: bigInt.BigInteger;
  readonly kId: string;
  readonly record: IRecord;
  readonly recordKey: string;
  readonly hashedX: bigInt.BigInteger;
  readonly y: bigInt.BigInteger;
}

export interface ICoord {
  readonly x: bigInt.BigInteger;
  readonly y: bigInt.BigInteger;
}

export interface IDecryptedData {
  readonly decryptedRecords: object;
  readonly slope: bigInt.BigInteger;
  readonly rid: string;
  readonly coords: ICoord[];
}

export interface IRIDComponents {
  readonly slope: bigInt.BigInteger;
  readonly kId: Uint8Array;
}

export interface IRecord {
  readonly perpId: string;
  readonly userName: string;
}

/**
 * SODIUM INITIALIZATION
 */
const sodiumPromise = sodium.ready;

/**
 * Key-Pair Generation
 * @param {object} ocKeys - Callisto Options Counselor public-private key pair (Uint8Array[32])
 * @param {object} userKeys - User public-private key pair (Uint8Array[32]) for message authentication
 */
let ocKeys;
let userKeys;

sodiumPromise.then(() => {
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
   * @param {Array<IEncryptedData>} dataSubmissions - storage for user inputted and generated data
   * @param {number} HEX - constant for conversions to hexadecimal
   */
  private dataSubmissions: IEncryptedData[] = [];
  private HEX: number = 16;
  // private PRIME = ((2 ** 128) - 157); // TODO: use big num library

  /**
   * Main function for encrypting values
   * @param {IPlainTextData} plainText - all plaintext values needed to be encrypted
   * @returns {IEncryptedData} object containing all encrypted values to be stored
   */
  public encryptData(plainText: IPlainTextData): IEncryptedData {

    const encryptedRecord: string = this.symmetricEncrypt(sodium.from_base64(plainText.recordKey),
      JSON.stringify(plainText.record));
    const encryptedRecordKey: string = this.symmetricEncrypt(sodium.from_base64(plainText.kId), plainText.recordKey);

    // base64 encoding
    const cY: string = this.encryptSecretValue(plainText.y);

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
   * @returns {Promise<{}>} promise resolving a IPlainTextData object
   */
  public createDataSubmission(perpId: string, userName: string): Promise<{}> {

    const record: Record = {
      perpId,
      userName,
    };

    const cryptoService = this;
    const dataPromise = new Promise(function (resolve, reject) {
      $.post("/postPerpId", { perpId }, (data, status) => {
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
   * @param {IEncryptedData} encryptedData
   * @returns nothing
   */
  public postData(encryptedData: IEncryptedData): void {
    this.dataSubmissions.push(encryptedData);
  }

  /**
   * Main function for decryption
   * @returns {IDecryptedData}
   */
  public decryptData(): IDecryptedData {
    const data = this.getMatchedData();
    if (data.length < 2) {
      return { decryptedRecords: [], slope: bigInt(0), rid: "0", coords: [] };
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
      rid: rid.toString(),
      coords: [coordA, coordB],
    };
  }

  /**
   * Searches for and returns entries with the same RID
   * @returns {Array<IEncryptedData} matched entries
   */
  private getMatchedData(): IEncryptedData[] {
    for (let i = 1; i < this.dataSubmissions.length; i++) {
      if (this.dataSubmissions[0].hashedRid === this.dataSubmissions[i].hashedRid) {
        return [this.dataSubmissions[0], this.dataSubmissions[i]];
      }
    }
  }

  /**
   * Creates a Coord object based on inputs
   * @param {IEncryptedData} data - Encrypted data object containing an x value
   * @param {bigInt.BigInteger} y
   * @returns {Coord} coordinate used for computations
   */
  private createCoord(data: IEncryptedData, y: bigInt.BigInteger): Coord {
    return {
      x: bigInt(data.cX),
      y,
    };
  }

  /**
   * Takes RID partitions the first 128 bits for the slope and the second 128 bits for kId
   * @param {string} hexRid - RID in hex string form
   * @returns {IRidComponents} slope (bigInt.BigInteger), kId (Uint8Array[32])
   */
  private deriveFromRid(hexRid: string): IRIDComponents {

    const ridLen: number = hexRid.length;
    const slope: bigInt.BigInteger = bigInt(hexRid.substr(0, ridLen / 2), this.HEX);

    const kId = sodium.crypto_generichash(sodium.crypto_generichash_BYTES, hexRid.substr(ridLen / 2, ridLen));
    return { slope, kId };
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
   * @returns {IPlainTextData} all values needed to be encrypted
   */
  private generateDataValues(rid: string, userId: string, record: Record): IPlainTextData {
    const prgRid = sodium.to_hex(sodium.crypto_hash(sodium.from_base64(rid)));

    const derived = this.deriveFromRid(prgRid);
    const hashedUserId = bigInt(sodium.to_hex(sodium.crypto_hash(userId)), this.HEX);
    const bigIntRid: bigInt.BigInteger = bigInt(prgRid, this.HEX);

    return {
      rid: bigIntRid,
      slope: derived.slope,
      recordKey: sodium.to_base64(sodium.crypto_secretbox_keygen()), // base64 encoding
      kId: sodium.to_base64(derived.kId),
      record,
      hashedX: hashedUserId,
      y: derived.slope.times(hashedUserId).plus(bigIntRid),
    };
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
   * Handles record decryption based on RID
   * @param {Array<IEncryptedData>} data - matched encrypted data
   * @param {string} rid - randomized perpetrator ID
   * @returns {Array<Record>} array of decrypted records
   */
  /* TODO: Figure out type of rid*/
  private decryptRecords(data: IEncryptedData[], rid): IRecord[] {

    const decryptedRecords: Record[] = [];
    const derived = this.deriveFromRid(rid.toString(this.HEX));

    for (let i = 0; i < data.length; i++) {
      const encryptedRecord: string = data[i].encryptedRecord;
      // TODO: resolve type IO
      const decryptedRecordKey = this.symmetricDecrypt(data[i].kId, data[i].encryptedRecordKey);
      const decryptedRecord = this.symmetricDecrypt(decryptedRecordKey, encryptedRecord);
      const dStr: string = new encoding.TextDecoder("utf-8").decode(decryptedRecord);
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
  private symmetricDecrypt(key: string, cipherText: string): Uint8Array {
    const split: string[] = cipherText.split("$");

    // Uint8Arrays
    const cT: Uint8Array = sodium.from_base64(split[0]);
    const nonce: Uint8Array = sodium.from_base64(split[1]);
    const decrypted: Uint8Array = sodium.crypto_secretbox_open_easy(cT, nonce, sodium.from_base64(key));

    return decrypted;
  }

  /**
   * Decrypts y value, which has been assymetrically encrypted
   * @param {Array<IEncryptedData>} data - array of matched IEncryptedData values
   * @returns {Array<bigInt.BigInteger>} corresponding y values for data submissions
   */
  private decryptSecretValues(data: IEncryptedData[]): bigInt.BigInteger[] {
    const yValues: bigInt.BigInteger[] = [];
    for (let i: number = 0; i < 2; i++) {
      const split: string[] = data[i].cY.split("$");

      // All values are UInt8Array
      const cY: Uint8Array = sodium.from_base64(split[0]);
      const nonce: Uint8Array = sodium.from_base64(split[1]);
      const userPK: Uint8Array = sodium.from_base64(data[i].userPubKey);
      const y: Uint8Array = sodium.crypto_box_open_easy(cY, nonce, userKeys.publicKey, ocKeys.privateKey);

      // Convert back to bigInt
      const yStr: string = new encoding.TextDecoder("utf-8").decode(y);
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
  private deriveSlope(c1: ICoord, c2: ICoord): bigInt.BigInteger {
    const top: bigInt.BigInteger = c2.y.minus(c1.y);
    const bottom: bigInt.BigInteger = c2.x.minus(c1.x);

    return top.divide(bottom);
  }

  /**
   * Computes RID, which is the y-intercept
   * @param {Coord} c1 - a given coordinate
   * @param {bigInt.BigInteger} slope
   */
  private getIntercept(c1: ICoord, slope: bigInt.BigInteger): bigInt.BigInteger {
    const x: bigInt.BigInteger = c1.x;
    const y: bigInt.BigInteger = c1.y;

    return y.minus(slope.times(x));
  }
}
