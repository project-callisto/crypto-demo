// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import { Injectable } from "@angular/core";
import bigInt = require("big-integer");
import * as $ from "jquery";
import sjcl = require("sjcl");
import * as encoding from "text-encoding";

/**
 * Data Objects
 */
export interface IKeyPair {
  keyType: string;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

export interface IEncryptedData {
  readonly pi: string;
  readonly c: string;
  readonly eRecord: string;
}

export interface IPlainTextData {
  readonly pHat: string;
  readonly U: bigInt.BigInteger; // x-coordinate
  readonly s: bigInt.BigInteger; // y-coordinate
  readonly sU: bigInt.BigInteger; // secret value without mod
  readonly a: bigInt.BigInteger; // slope
  readonly k: Uint8Array;
  readonly kStr: string;
  readonly pi: string;
  readonly recordKey: Uint8Array;
  readonly record: IRecord;
}

export interface IMessage {
  readonly U: bigInt.BigInteger;
  readonly s: bigInt.BigInteger;
  readonly eRecordKey: string;
}

export interface ICoord {
  readonly x: bigInt.BigInteger;
  readonly y: bigInt.BigInteger;
  readonly pi: string;
}

export interface IDecryptedData {
  readonly decryptedRecords: object;
  readonly slope: bigInt.BigInteger;
  readonly intercept: bigInt.BigInteger;
  readonly k: Uint8Array;
}

export interface IRecord {
  readonly perpId: string;
  readonly userName: string;
}

/**
 * CRYPTO SERVICE
 */
@Injectable()
export class CryptoService {

  /**
   * Key-Pair Generation
   * @param {IKeyPair} ocKeys - Callisto Options Counselor public-private key pair (Uint8Array[32])
   * @param {IKeyPair} userKeys - User public-private key pair (Uint8Array[32]) for message authentication
   */
  private ocKeys: IKeyPair;
  private userKeys: IKeyPair;
  private plainText: IPlainTextData = null;

  /**
   * CONSTANTS
   * @param {Array<IEncryptedData>} dataSubmissions - storage for user inputted and generated data
   * @param {number} HEX - constant for conversions to hexadecimal
   */
  private dataSubmissions: IEncryptedData[] = [];
  private HEX: number = 16;
  // tslint:disable-next-line
  private PRIME: bigInt.BigInteger = bigInt('115792089237316195423570985008687907853269984665640564039457584007913129639936').plus(bigInt(297));

  constructor(
    // the libsodium library, with the sodium.ready promise already resolved
    private sodium: any,
  ) {
    this.ocKeys = this.sodium.crypto_box_keypair();
    this.userKeys = this.sodium.crypto_box_keypair();
  }

  /**
   * Main function for encrypting values
   * @param {IPlainTextData} plainText - all plaintext values needed to be encrypted
   * @returns {IEncryptedData} object containing all encrypted values to be stored
   */

  public encryptData(plainText: IPlainTextData): IEncryptedData {

    const eRecord: string = this.symmetricEncrypt(plainText.recordKey, JSON.stringify(plainText.record));
    const eRecordKey: string = this.symmetricEncrypt(plainText.k, this.sodium.to_base64(plainText.recordKey));
    const msg: IMessage = {
      U: plainText.U,
      s: plainText.s,
      eRecordKey,
    };

    return {
      pi: plainText.pi,
      c: this.asymmetricEncrypt(msg),
      eRecord,
    };
  }

  // /**
  //  * Returns all coordinates for displaying on graph
  //  * @returns {Array<ICoord>}
  //  */
  // public getCoords(): ICoord[] {
  //   const coords: ICoord[] = [];
  //   const messages: IMessage[] = this.asymmetricDecrypt(this.dataSubmissions);

  //   for (const i in messages) {
  //     coords.push(this.createCoord(messages[i], this.dataSubmissions[i].pi));
  //   }
  //   return coords;
  // }

  public getDataSubmissions(): IEncryptedData[] {
    return this.dataSubmissions;
  }

  /**
   * Function for taking user inputs and returning values to be encrypted
   * @param {string} perpId - inputted perpetrator name
   * @param {string} userName - inputted user name
   * @returns {IPlainTextData} promise resolving a IPlainTextData object
   */
  public submitData(perpId: string, userName: string): IPlainTextData {
    if (perpId === "" || userName === "") {
      return undefined;
    }
    // tslint:disable-next-line
    const kDemo: string = "MjQ2LDIyLDE2NiwyMzUsODEsMTgzLDIzMSwyMTgsMTE2LDUzLDEzNCwyNyw0Miw1OSwxMDQsMTkyLDExOCwxMCwzNCwyMj";
    const pHat: Uint8Array = (this.sodium.crypto_hash(perpId + kDemo)).slice(0, 32);
    // tslint:disable-next-line
    const a: bigInt.BigInteger = bigInt(this.bytesToString(this.sodium.crypto_kdf_derive_from_key(32, 1, "derivation", pHat)));
    const k: Uint8Array = this.sodium.crypto_kdf_derive_from_key(32, 2, "derivation", pHat);
    const pi: string = this.sodium.to_base64(this.sodium.crypto_kdf_derive_from_key(32, 3, "derivation", pHat));
    const U: bigInt.BigInteger = bigInt(this.sodium.to_hex(this.sodium.crypto_hash(userName).slice(0, 32)), this.HEX);
    const kStr: string = this.bytesToString(k);

    const pT: IPlainTextData = {
      pHat: this.sodium.to_base64(pHat),
      U,
      s: (a.times(U).plus(bigInt(kStr))).mod(this.PRIME),
      sU: (a.times(U).plus(bigInt(kStr))),
      a,
      k,
      kStr,
      pi,
      recordKey: this.sodium.crypto_secretbox_keygen(),
      record: { perpId, userName },
    };

    const encryptedData: IEncryptedData = this.encryptData(pT);
    this.postData(encryptedData);

    return pT;
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
    const data: IEncryptedData[] = this.getMatchedData();
    const messages: IMessage[] = this.asymmetricDecrypt(data);

    let coordA: ICoord = this.createCoord(messages[0], this.dataSubmissions[0].pi);
    let coordB: ICoord = this.createCoord(messages[1], this.dataSubmissions[1].pi);

    if (coordA.x.geq(coordB.x)) {
      const temp: ICoord = coordA;
      coordA = coordB;
      coordB = temp;
    }

    const slope: bigInt.BigInteger = this.deriveSlope(coordA, coordB);
    const intercept: bigInt.BigInteger = this.getIntercept(coordA, slope);

    const k: Uint8Array = this.stringToBytes(intercept.toString());
    const decryptedRecords: IRecord[] = this.decryptRecords(messages, [data[0].eRecord, data[1].eRecord], k);

    return {
      decryptedRecords,
      slope,
      intercept,
      k,
    };
  }

  /**
   * Converts a Uint8Array to a string representation of its integer value
   * @param {Uint8Array} k - 32 byte key
   * @returns {string}
   */
  public bytesToString(k: Uint8Array): string {
    let result: bigInt.BigInteger = bigInt(0);

    for (let i: number = k.length - 1; i >= 0; i--) {
      result = result.or(bigInt(k[i]).shiftLeft((i * 8)));
    }

    return result.toString();
  }

  /**
   * Converts a string representing an integer to a Uint8Array
   * @param {string} intercept
   * @returns {Uint8Array} 32-byte key
   */
  public stringToBytes(intercept: string): Uint8Array {
    let value: bigInt.BigInteger = bigInt(intercept);
    const result: number[] = [];

    for (let i: number = 0; i < 32; i++) {
      result.push(parseInt(value.and(255).toString(), 10));
      value = value.shiftRight(8);
    }

    return Uint8Array.from(result);
  }

  /**
   * Searches for and returns entries with the same RID
   * @returns {Array<IEncryptedData} matched entries
   */
  private getMatchedData(): IEncryptedData[] {
    for (let i: number = 1; i < this.dataSubmissions.length; i++) {
      if (this.dataSubmissions[0].pi === this.dataSubmissions[i].pi) {
        return [this.dataSubmissions[0], this.dataSubmissions[i]];
      }
    }
  }

  /**
   * Creates a Coord object based on inputs
   * @param {IEncryptedData} data - Encrypted data object containing an x value
   * @param {bigInt.BigInteger} y
   * @returns {ICoord} coordinate used for computations
   */
  private createCoord(msg: IMessage, pi: string): ICoord {
    return {
      x: bigInt(msg.U),
      y: bigInt(msg.s),
      pi,
    };
  }

  /**
   * Encrypts y using public-key encryption with the OC's public key
   * @param {bigInt.BigInteger} y - value derived from mx + RID
   * @returns {string} the encrypted value in base 64 encoding
   */
  private asymmetricEncrypt(message: IMessage): string {

    const nonce: Uint8Array = this.sodium.randombytes_buf(this.sodium.crypto_box_NONCEBYTES);
    const cY: Uint8Array = this.sodium.crypto_box_easy(
      JSON.stringify(message), nonce, this.ocKeys.publicKey, this.userKeys.privateKey);
    const encrypted: string = this.sodium.to_base64(cY) + "$" + this.sodium.to_base64(nonce);

    return encrypted;
  }

  /**
   * Symmetric encryption using given key
   * @param {Uint8Array} key - 32 byte key
   * @param {string} msg
   * @returns {string} ciphertext concatenated with a nonce, both in base 64 encoding
   */
  private symmetricEncrypt(key: Uint8Array, msg: string): string {
    const nonce: Uint8Array = this.sodium.randombytes_buf(this.sodium.crypto_box_NONCEBYTES);
    const cT: Uint8Array = this.sodium.crypto_secretbox_easy(msg, nonce, key);
    const encrypted: string = this.sodium.to_base64(cT) + "$" + this.sodium.to_base64(nonce);

    return encrypted;
  }

  /**
   * Handles record decryption based on RID
   * @param {Array<IEncryptedData>} data - matched encrypted data
   * @param {string} rid - randomized perpetrator ID
   * @returns {Array<IRecord>} array of decrypted records
   */
  private decryptRecords(data: IMessage[], eRecords: string[], k: Uint8Array): IRecord[] {

    const decryptedRecords: IRecord[] = [];

    for (const i in data) {
      const recordKey: Uint8Array = this.symmetricDecrypt(k, data[i].eRecordKey);
      const decryptedRecord: Uint8Array = this.symmetricDecrypt(this.sodium.from_base64(recordKey), eRecords[i]);
      const dStr: string = new encoding.TextDecoder("utf-8").decode(decryptedRecord);
      decryptedRecords.push(JSON.parse(dStr));
    }

    return decryptedRecords;
  }

  /**
   * Symmetric decryption
   * @param {string} key - base 64 encoding
   * @param {string} cipherText - base 64 encoding
   * @returns {Uint8Array} decrypted value
   */
  private symmetricDecrypt(key: Uint8Array, cipherText: string): Uint8Array {
    const split: string[] = cipherText.split("$");

    if (key.length !== this.sodium.crypto_box_SECRETKEYBYTES) {
      return undefined;
    }

    // Uint8Arrays
    const cT: Uint8Array = this.sodium.from_base64(split[0]);
    const nonce: Uint8Array = this.sodium.from_base64(split[1]);
    const decrypted: Uint8Array = this.sodium.crypto_secretbox_open_easy(cT, nonce, key);

    return decrypted;
  }

  /**
   * Decrypts y value, which has been assymetrically encrypted
   * @param {Array<IEncryptedData>} data - array of matched IEncryptedData values
   * @returns {Array<bigInt.BigInteger>} corresponding y values for data submissions
   */
  private asymmetricDecrypt(data: IEncryptedData[]): IMessage[] {
    const messages: IMessage[] = [];
    for (const i in data) {
      const split: string[] = data[i].c.split("$");
      const c: Uint8Array = this.sodium.from_base64(split[0]);
      const nonce: Uint8Array = this.sodium.from_base64(split[1]);

      const msg: Uint8Array = this.sodium.crypto_box_open_easy(
        c, nonce, this.userKeys.publicKey, this.ocKeys.privateKey);

      const msgObj: IMessage = JSON.parse(new encoding.TextDecoder("utf-8").decode(msg));
      messages.push(msgObj);
    }
    return messages;
  }

  // private modSubtract(x: bigInt.BigInteger, y: bigInt.BigInteger) {

  //   if (x.lt(y)) {
  //     x.add(this.PRIME);
  //   }
  //   return x.minus(y).mod(this.PRIME);
  // }

  /**
   * Computes a slope based on the slope formula
   * @param {Coord} c1 - 1st coordinate
   * @param {Coord} c2 - 2nd coordinate
   * @returns {bigInt.BigInteger} slope value
   */
  private deriveSlope(c1: ICoord, c2: ICoord): bigInt.BigInteger {
    const top: bigInt.BigInteger = this.realMod(c2.y.minus(c1.y));
    const bottom: bigInt.BigInteger = this.realMod(c2.x.minus(c1.x));

    return top.multiply(bottom.modInv(this.PRIME)).mod(this.PRIME);
  }

  /**
   * Computes RID, which is the y-intercept
   * @param {Coord} c1 - a given coordinate
   * @param {bigInt.BigInteger} slope
   */
  private getIntercept(c1: ICoord, slope: bigInt.BigInteger): bigInt.BigInteger {
    const x: bigInt.BigInteger = c1.x;
    const y: bigInt.BigInteger = c1.y;
    const mult: bigInt.BigInteger = (slope.times(x));

    return this.realMod(y.minus(mult));
  }

  /**
   * Get real mod of value, instead of bigInt's mod() which returns the remainder.
   * Necessary for negative values.
   * @param {bigInt} val Input value
   * @returns {bigInt.BigInteger} Value with real mod applied
   */
  private realMod(val: bigInt.BigInteger): bigInt.BigInteger {
    return val.mod(this.PRIME).add(this.PRIME).mod(this.PRIME);
  }
}
