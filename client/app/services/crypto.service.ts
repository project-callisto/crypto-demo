// classes ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
import { Injectable } from "@angular/core";
import * as bigInt from "big-integer";
import * as $ from "jquery";
import * as sodium from "libsodium-wrappers";
import * as encoding from 'text-encoding';


  
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

  // TODO: type these as big ints
  export interface Coord {
    readonly x,
    readonly y
  }
  
  
  export interface DecryptedData {
    readonly decryptedRecords: Object;
    readonly slope: number;
    readonly strRid: string;
  }
  
  
  // TODO: move this into an init function within cryptoservice
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
 *  CRYPTO SERVICE
 */
@Injectable()
export class CryptoService {
/*
 *  PRIVATE VARS
 */
  private dataSubmissions = [];
  private HEX = 16;
  private PRIME = ((2 ** 128) - 157); // TODO: use big num library  


  /*
   *  ENCRYPTION
   */

  /* Used in both encryption and decryption to derive a slope and key for a unique RID 
     hexRid - hex string
  */
  private deriveFromRid(hexRid: string) {

    const ridLen = hexRid.length;
  
    const slope = bigInt(hexRid.substr(0, ridLen / 2), this.HEX);
  
    // hashing it to make it conform to key size: 32 bytes
    const kId = sodium.crypto_generichash(sodium.crypto_generichash_BYTES, hexRid.substr(ridLen / 2, ridLen));
  
    return {slope, kId};
  }


// Y is a bigInt number
private encryptSecretValue(y) {

  const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

  const cY = sodium.crypto_box_easy(y.toString(), nonce, claKeys.publicKey, userKeys.privateKey);

  const encrypted = sodium.to_base64(cY) + "$" + sodium.to_base64(nonce);

  // string base 64
  return encrypted;
}


  // rid: base64 string
  private generateDataValues(rid: string, userId: string, record: object) {
    const prgRid = sodium.to_hex(sodium.crypto_hash(sodium.from_base64(rid)));  
  
    const derived = this.deriveFromRid(prgRid);
    const hashedUserId = bigInt(sodium.to_hex(sodium.crypto_hash(userId)), this.HEX);
    const intRid = bigInt(prgRid, this.HEX);
  
    // bigInt
    const y = derived.slope.times(hashedUserId).plus(intRid);
    const Krecord = sodium.to_base64(sodium.crypto_secretbox_keygen());
  
    const plainTextData = {
      rid: intRid, // 
      slope: derived.slope, // 
      recordKey: Krecord, // string, base 64
      kId: sodium.to_base64(derived.kId),
      record, // object
      hashedX: hashedUserId, // bigInt 
      y, // bigInt
    };
    return plainTextData;
  }

  // Returns base64
  /* Key length = 32 bytes
    returns string, base 64 encoding
  */
  private symmetricEncrypt(key: Uint8Array, msg: string): string {
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);

    const cT = sodium.crypto_secretbox_easy(msg, nonce, key);

    const encrypted = sodium.to_base64(cT) + "$" + sodium.to_base64(nonce);
    return encrypted;
  }

  
  public encryptData(plainText: PlainTextData): EncryptedData {

    const encryptedRecord = this.symmetricEncrypt(sodium.from_base64(plainText.recordKey), JSON.stringify(plainText.record));
    const encryptedRecordKey = this.symmetricEncrypt(sodium.from_base64(plainText.kId), plainText.recordKey);

    // string, base64 encoding
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

  // TODO: insert proper type instead of object
  public createDataSubmission(perpId: string, userName: string): Promise<{}> {

    const record = {
      perpId: perpId,
      userName: userName,
    };
    const cryptoService = this;
    // TODO: return post itself
    const dataPromise = new Promise(function(resolve, reject) {
      $.post("/postPerpId", {'perpId':perpId}, (data, status) => {
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

   
  public postData(encryptedData: EncryptedData) {
    this.dataSubmissions.push(encryptedData);
  }




  /*
   * DECRYPTION
   */
  // TODO: types
  private getMatchedData(data) {
    for (var i = 1; i < data.length; i++) {
      if (data[0].hashedRid === data[i].hashedRid) {
        return [data[0], data[i]]
      }
    }
  }

  private createCoord(data, y): Coord {
    return {
      x: bigInt(data.cX),
      y
    }
  }

  public decryptData(): DecryptedData {
    let data = this.getMatchedData(this.dataSubmissions);
    if (data.length < 2) {
      return {decryptedRecords: [], slope: 0, strRid: ''};
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
    const strRid = this.getIntercept(coordA, slope);

    return {
      decryptedRecords: this.decryptRecords(data, strRid.toString(this.HEX)),
      slope,
      strRid,
    };
  }

  /* */
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
  

// Key is Uint8Array,
// CipherText: string in base64 encoding
private symmetricDecrypt(key, cipherText) {
  const split = cipherText.split("$");

  // Uint8Arrays
  const cT = sodium.from_base64(split[0]);
  const nonce = sodium.from_base64(split[1]);

  // cT
  key = sodium.from_base64(key);
  const decrypted = sodium.crypto_secretbox_open_easy(cT, nonce, key);

  return decrypted;
}



// decrypt Y values
private decryptSecretValues(data) {
  let yValues = [];
  for (let i = 0; i < 2; i++) {
    const split = data[i].cY.split("$");

    // All values are UInt8Array
    const cY = sodium.from_base64(split[0]);
    const nonce = sodium.from_base64(split[1]);
    const userPK = sodium.from_base64(data[i].userPubKey);
    const y = sodium.crypto_box_open_easy(cY, nonce, userKeys.publicKey, claKeys.privateKey);

    // Convert back to bigInt
    const yStr = new encoding.TextDecoder("utf-8").decode(y);
    yValues.push(bigInt(yStr));
  }
  return yValues;
}


private deriveSlope(c1, c2) {
  const top = c2.y.minus(c1.y);
  const bottom = c2.x.minus(c1.x);

  return top.divide(bottom);

}

// plug in value for x within line formula to get y-intercept aka rid
private getIntercept(c1, slope) {
  const x = c1.x;
  const y = c1.y;

  return y.minus(slope.times(x));
}

  
}
