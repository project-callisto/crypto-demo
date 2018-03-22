// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import { Injectable } from "@angular/core";
import bigInt = require("big-integer");
import * as $ from "jquery";
import * as encoding from "text-encoding";
import sjcl = require('sjcl');

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
  readonly c: string; // ciphertext
}

export interface IPlainTextData {
  readonly U: bigInt.BigInteger; // x-coordinate
  readonly s: bigInt.BigInteger; // y-coordinate
  readonly a: bigInt.BigInteger; // slope
  readonly k: string;
  readonly pi: string;
  readonly record: IRecord;
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

  /**
   * CONSTANTS
   * @param {Array<IEncryptedData>} dataSubmissions - storage for user inputted and generated data
   * @param {number} HEX - constant for conversions to hexadecimal
   */
  private dataSubmissions: IEncryptedData[] = [];
  private HEX: number = 16;
  private PRIME: string = "340282366920938463463374607431768211297";

  constructor(
    // the libsodium library, with the sodium.ready promise already resolved
    private sodium: any,
  ) {
    this.ocKeys = this.sodium.crypto_box_keypair();
    this.userKeys = this.sodium.crypto_box_keypair();
  }

  
  // public deriveValues(perpId) {

  //   prom.then 
  //   return prom;
  // }

  /**
   * Main function for encrypting values
   * @param {IPlainTextData} plainText - all plaintext values needed to be encrypted
   * @returns {IEncryptedData} object containing all encrypted values to be stored
   */

  public encryptData(plainText: IPlainTextData): void {
    console.log('sod',this.sodium);
    console.log('pt',this.sodium.from_base64(plainText.k));

    const eRecord: string = this.symmetricEncrypt(this.sodium.from_base64(plainText.k), JSON.stringify(plainText.record));
    // console.log('errr', eRecord)
    return {};

  }
  //   const encryptedRecord: string = this.symmetricEncrypt(this.sodium.from_base64(plainText.recordKey),
  //     JSON.stringify(plainText.record));
  //   const encryptedRecordKey: string = this.symmetricEncrypt(this.sodium.from_base64(plainText.kId),
  //     plainText.recordKey);

  //   // base64 encoding
  //   const cY: string = this.encryptSecretValue(plainText.y);

  //   return {
  //     hashedRid: this.sodium.to_base64(this.sodium.crypto_hash(plainText.rid.toString())),
  //     encryptedRecord,
  //     encryptedRecordKey,
  //     userPubKey: this.sodium.to_base64(this.userKeys.publicKey),
  //     cY,
  //     cX: plainText.hashedX.toString(),
  //     kId: plainText.kId,
  //   };
  // }

  /**
   * Submits inputted information to be processed and encrypted
   * @param perpInput - inputted perpetrator name
   * @param userName - inputted user name
   * @returns {IEncryptedData}
   */
  public submitAndEncrypt(perpInput: string, userName: string): IEncryptedData {
    const plainText: IPlainTextData = this.createDataSubmission(perpInput);
   
    console.log('t',plainText);
    
    // const encryptedData: IEncryptedData = this.encryptData(plainText);
    // this.postData(encryptedData);
    // return encryptedData;
    return {};
  }

  /**
   * Returns all coordinates for displaying on graph
   * @returns {Array<ICoord>}
   */
  public retrieveCoords(): ICoord[] {
    const coords: ICoord[] = [];
    const yValues: bigInt.BigInteger[] = this.decryptSecretValues(this.dataSubmissions);

    for (let i: number = 0; i < this.dataSubmissions.length; i++) {
      coords.push(this.createCoord(this.dataSubmissions[i], yValues[i]));
    }

    return coords;

  }

  /**
   * Function for taking user inputs and returning values to be encrypted
   * @param {string} perpId - inputted perpetrator name
   * @param {string} userName - inputted user name
   * @returns {IPlainTextData} promise resolving a IPlainTextData object
   */
  public randomizePerpInput(perpId: string): void {
    
    const kDemo: string = "MjQ2LDIyLDE2NiwyMzUsODEsMTgzLDIzMSwyMTgsMTE2LDUzLDEzNCwyNyw0Miw1OSwxMDQsMTkyLDExOCwxMCwzNCwyMj";
    const p_hat = this.sodium.to_base64(this.sodium.crypto_hash(perpId + kDemo));

    const derivedPromise = this.hkdf(p_hat, p_hat, 'salt', 9);

    const sodium = this.sodium;
    const crypto = this;

    derivedPromise.then(function(values) {
      const a = bigInt(values[0]);
      const k = sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(values[1].toString()));
      const pi = sodium.to_base64(values[2].toString());
      const U = bigInt(sodium.to_hex(sodium.crypto_hash('[TODO]')), 16);

      console.log('k', k)
      const pT: IPlainTextData = {
        U,
        s: a.times(U).mod(17),
        a,
        k,
        pi,
        record: {perpId, userName: '[TODO]'}
      }
      console.log('pt', pT);
      // crypto.encryptData(pT);
    });
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
    if (data.length < 2) {
      return { decryptedRecords: [], slope: bigInt(0), rid: "0", coords: [] };
    }

    const yValues: bigInt.BigInteger[] = this.decryptSecretValues(data);

    let coordA: ICoord = this.createCoord(data[0], yValues[0]);
    let coordB: ICoord = this.createCoord(data[1], yValues[1]);

    if (coordA.x.geq(coordB.x)) {
      const temp: ICoord = coordA;
      coordA = coordB;
      coordB = temp;
    }

    const slope: bigInt.BigInteger = this.deriveSlope(coordA, coordB);
    const rid: bigInt.BigInteger = this.getIntercept(coordA, slope);

    return {
      decryptedRecords: this.decryptRecords(data, rid.toString(this.HEX)),
      slope,
      rid: rid.toString(),
      coords: [coordA, coordB],
    };
  }

  // /**
  //  * Randomizing perp Id
  //  *
  //  * @param {string} perpId - inputted perpetrator name
  //  * @returns {string} randomized perp id
  //  */
  // private randomizePerpId(perpId: string): string {

  // }

  /**
   * Searches for and returns entries with the same RID
   * @returns {Array<IEncryptedData} matched entries
   */
  private getMatchedData(): IEncryptedData[] {
    for (let i: number = 1; i < this.dataSubmissions.length; i++) {
      if (this.dataSubmissions[0].hashedRid === this.dataSubmissions[i].hashedRid) {
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
  private createCoord(data: IEncryptedData, y: bigInt.BigInteger): ICoord {
    return {
      x: bigInt(data.cX),
      y,
    };
  }

  /**
   * Takes RID partitions the first 256 bits for the slope and the second 256 bits for kId
   * @param {string} hexRid - RID in hex string form
   * @returns {IRidComponents} slope (bigInt.BigInteger), kId (Uint8Array[32])
   */
  private deriveFromRid(hexRid: string): IRIDComponents {

    const ridLen: number = hexRid.length;
    const slope: bigInt.BigInteger = bigInt(hexRid.substr(0, ridLen / 2), this.HEX);

    const kId: Uint8Array = this.sodium.crypto_generichash(this.sodium.crypto_generichash_BYTES,
      hexRid.substr(ridLen / 2, ridLen));
    return { slope, kId };
  }

  /**
   * Encrypts y using public-key encryption with the OC's public key
   * @param {bigInt.BigInteger} y - value derived from mx + RID
   * @returns {string} the encrypted value in base 64 encoding
   */
  private encryptSecretValue(y: bigInt.BigInteger): string {

    const nonce: Uint8Array = this.sodium.randombytes_buf(this.sodium.crypto_box_NONCEBYTES);
    const cY: Uint8Array = this.sodium.crypto_box_easy(
      y.toString(), nonce, this.ocKeys.publicKey, this.userKeys.privateKey);
    const encrypted: string = this.sodium.to_base64(cY) + "$" + this.sodium.to_base64(nonce);

    return encrypted;
  }

  // /**
  //  * Generates and formats all values needed to for linear secret sharing
  //  * @param {string} rid - randomized perpetrator ID in base 64 encoding
  //  * @param {IRecord} record - object containing the perpetrator ID and user name
  //  * @returns {IPlainTextData} all values needed to be encrypted
  //  */
  // private generateDataValues(p_hat: string, record: IRecord): IPlainTextData {
  
  
  // }

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
  private decryptRecords(data: IEncryptedData[], rid: string): IRecord[] {

    const decryptedRecords: IRecord[] = [];
    const derived: IRIDComponents = this.deriveFromRid(rid);

    for (const i in data) {
      const encryptedRecord: string = data[i].encryptedRecord;
      const decryptedRecordKey: Uint8Array = this.symmetricDecrypt(this.sodium.from_base64(data[i].kId),
        data[i].encryptedRecordKey);

      const decryptedRecord: Uint8Array = this.symmetricDecrypt(this.sodium.from_base64(decryptedRecordKey),
        encryptedRecord);
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
  private decryptSecretValues(data: IEncryptedData[]): bigInt.BigInteger[] {
    const yValues: bigInt.BigInteger[] = [];
    for (const i in data) {
      const split: string[] = data[i].cY.split("$");

      // All values are UInt8Array
      const cY: Uint8Array = this.sodium.from_base64(split[0]);
      const nonce: Uint8Array = this.sodium.from_base64(split[1]);
      const userPK: Uint8Array = this.sodium.from_base64(data[i].userPubKey);
      const y: Uint8Array = this.sodium.crypto_box_open_easy(
        cY, nonce, this.userKeys.publicKey, this.ocKeys.privateKey);

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

    return top.multiply(bottom.modInv(this.PRIME));
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






 
  /**
   * hkdf - The HMAC-based Key Derivation Function
   * http://mozilla.github.io/fxa-js-client/files/client_lib_hkdf.js.html
   *
   * @param {bitArray} ikm Initial keying material
   * @param {bitArray} info Key derivation data
   * @param {bitArray} salt Salt
   * @param {integer} length Length of the derived key in bytes
   * @return promise object- It will resolve with `output` data
   */
  private hkdf(ikm, info, salt, length) {

    var mac = new sjcl.misc.hmac(salt, sjcl.hash.sha256);
    mac.update(ikm);

    // compute the PRK
    var prk = mac.digest();

    // hash length is 32 because only sjcl.hash.sha256 is used at this moment
    var hashLength = 32;
    var num_blocks = Math.ceil(length / hashLength);
    var prev = sjcl.codec.hex.toBits('');
    var output = '';

    for (var i = 0; i < num_blocks; i++) {
      var hmac = new sjcl.misc.hmac(prk, sjcl.hash.sha256);

      var input = sjcl.bitArray.concat(
        sjcl.bitArray.concat(prev, info),
        sjcl.codec.utf8String.toBits((String.fromCharCode(i + 1)))
      );

      hmac.update(input);

      prev = hmac.digest();
      output += sjcl.codec.hex.fromBits(prev);
    }

    var truncated = sjcl.bitArray.clamp(sjcl.codec.hex.toBits(output), length * 8);

    return Promise.resolve(truncated);
  }
}
