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
  readonly c: string; // ciphertext
}

export interface IPlainTextData {
  readonly pHat: string; // randomized perp id
  readonly U: bigInt.BigInteger; // x-coordinate
  readonly s: bigInt.BigInteger; // y-coordinate
  readonly a: bigInt.BigInteger; // slope
  readonly k: Uint8Array;
  readonly kStr: string;
  readonly pi: string;
  readonly record: IRecord;
}

export interface IMessage {
  readonly U: bigInt.BigInteger;
  readonly s: bigInt.BigInteger;
  readonly eRecord: string;
}

export interface ICoord {
  readonly x: bigInt.BigInteger;
  readonly y: bigInt.BigInteger;
}

export interface IDecryptedData {
  readonly decryptedRecords: object;
  readonly slope: bigInt.BigInteger;
  readonly coords: ICoord[];
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
  private PRIME: string = "340282366920938463463374607431768211297";

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

  public encryptData(plainText: IPlainTextData): string {

    const eRecord: string = this.symmetricEncrypt(plainText.k, JSON.stringify(plainText.record));
    const msg: IMessage = {
      U: plainText.U, // TODO: hash?!
      s: plainText.s,
      eRecord,
    };
    const c: string = this.asymmetricEncrypt(msg);

    return c;
  }

  /**
   * Returns all coordinates for displaying on graph
   * @returns {Array<ICoord>}
   */
  public getCoords(): ICoord[] {
    const coords: ICoord[] = [];
    const messages: IMessage[] = this.asymmetricDecrypt(this.dataSubmissions);

    for (const i in messages) {
      coords.push(this.createCoord(messages[i]));
    }
    return coords;
  }

  public getDataSubmissions(): IEncryptedData[] {
    return this.dataSubmissions;
  }

  private bytesToString(k: Uint8Array): string {
    let numStr: string = "";

    for (const i in k) {
      let str: string = k[i].toString();

      if (str.length === 2) {
        str = "0" + str;
      } else if (str.length === 1) {
        str = "00" + str;
      }
      numStr += str;
    }
    return numStr;
  }

  /**
   * Function for taking user inputs and returning values to be encrypted
   * @param {string} perpId - inputted perpetrator name
   * @param {string} userName - inputted user name
   * @returns {IPlainTextData} promise resolving a IPlainTextData object
   */
  public submitData(perpId: string, userName: string): void {

    const kDemo: string = "MjQ2LDIyLDE2NiwyMzUsODEsMTgzLDIzMSwyMTgsMTE2LDUzLDEzNCwyNyw0Miw1OSwxMDQsMTkyLDExOCwxMCwzNCwyMj";
    const pHat: string = this.sodium.to_base64(this.sodium.crypto_hash(perpId + kDemo));

    // const salt = this.sodium.randombytes_buf(16);

    // console.log(this.sodium.crypto_pwhash(16, pHat, salt,
    //   this.sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    //   this.sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    //   this.sodium.crypto_pwhash_ALG_DEFAULT))
    const derivedPromise: Promise<any> = this.hkdf(pHat, pHat, "salt", 9); // TODO: pick a better salt
    const crypto: CryptoService = this;

    derivedPromise.then(function(values) {
      const a: bigInt.BigInteger = bigInt(values[0]);
      const k: Uint8Array = crypto.sodium.crypto_hash(values[1].toString()).slice(32); // TODO: EXTREMELY INSECURE HACK!!! MUST CHANGE LATER
      const pi: string = crypto.sodium.to_base64(values[2].toString());
      const U: bigInt.BigInteger = bigInt(crypto.sodium.to_hex(crypto.sodium.crypto_hash(userName)), 16).mod(crypto.PRIME);
      const kStr: string = crypto.bytesToString(k);

      const pT: IPlainTextData = {
        pHat,
        U,
        s: (a.times(U).plus(bigInt(kStr))).mod(crypto.PRIME),
        a,
        k,
        kStr,
        pi,
        record: {perpId, userName},
      };
      // TODO: this is a hack
      if (crypto.plainText === null) {
        crypto.plainText = pT;
      }

      const encryptedData = crypto.encryptData(pT);
      crypto.postData({c: encryptedData, pi});
    });
  }

  // for display purposes
  public getPlainText(): IPlainTextData {
    return this.plainText;
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

    let coordA: ICoord = this.createCoord(messages[0]);
    let coordB: ICoord = this.createCoord(messages[1]);

    if (coordA.x.geq(coordB.x)) {
      const temp: ICoord = coordA;
      coordA = coordB;
      coordB = temp;
    }

    const slope: bigInt.BigInteger = this.deriveSlope(coordA, coordB);
    // console.log("dSlope: ", slope.toString());
    const intercept: string = this.getIntercept(coordA, slope).toString();

    const k: Uint8Array = this.stringToBytes(this.plainText.kStr);
    const decryptedRecords: IRecord[] = this.decryptRecords(messages, k);

    return {
      decryptedRecords,
      slope,
      coords: this.getCoords(),
    };
  }

  private stringToBytes(intercept) {
    console.log(intercept);
    const diff = 96 - intercept.length;
    for (let i = 0; i < diff; i++) {
      intercept = "0" + intercept;
    }

    const arr = [];
    for (let i = 0; i < 96; i += 3) {
      arr.push(intercept.slice(i, i + 3));
    }
    return Uint8Array.from(arr);
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
  private createCoord(msg: IMessage): ICoord {
    return {
      x: bigInt(msg.U),
      y: bigInt(msg.s),
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
  private decryptRecords(data: IMessage[], k: Uint8Array): IRecord[] {

    const decryptedRecords: IRecord[] = [];

    for (const i in data) {
      const decryptedRecord = this.symmetricDecrypt(k, data[i].eRecord);
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
    const messages = [];
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

  /**
   * Computes a slope based on the slope formula
   * @param {Coord} c1 - 1st coordinate
   * @param {Coord} c2 - 2nd coordinate
   * @returns {bigInt.BigInteger} slope value
   */
  private deriveSlope(c1: ICoord, c2: ICoord): bigInt.BigInteger {
    const top: bigInt.BigInteger = c2.y.minus(c1.y);
    const bottom: bigInt.BigInteger = c2.x.minus(c1.x);

    return top.multiply(bottom.modInv(this.PRIME)).mod(this.PRIME);

    // return top.multiply(modInv(bottom, PRIME)).mod(PRIME)".
  }

  /**
   * Computes RID, which is the y-intercept
   * @param {Coord} c1 - a given coordinate
   * @param {bigInt.BigInteger} slope
   */
  private getIntercept(c1: ICoord, slope: bigInt.BigInteger): bigInt.BigInteger {
    const x: bigInt.BigInteger = c1.x;
    const y: bigInt.BigInteger = c1.y;
    console.log("i", slope.times(x).toString(), y.toString());
    // y = mx + b

    return (y.minus(slope.times(x))).modInv(this.PRIME);
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

    const mac = new sjcl.misc.hmac(salt, sjcl.hash.sha256);
    mac.update(ikm);

    // compute the PRK
    const prk = mac.digest();

    // hash length is 32 because only sjcl.hash.sha256 is used at this moment
    const hashLength = 32;
    const num_blocks = Math.ceil(length / hashLength);
    let prev = sjcl.codec.hex.toBits("");
    let output = "";

    for (let i = 0; i < num_blocks; i++) {
      const hmac = new sjcl.misc.hmac(prk, sjcl.hash.sha256);

      const input = sjcl.bitArray.concat(
        sjcl.bitArray.concat(prev, info),
        sjcl.codec.utf8String.toBits((String.fromCharCode(i + 1))),
      );

      hmac.update(input);

      prev = hmac.digest();
      output += sjcl.codec.hex.fromBits(prev);
    }

    const truncated = sjcl.bitArray.clamp(sjcl.codec.hex.toBits(output), length * 8);

    return Promise.resolve(truncated);
  }
}
