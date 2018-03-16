import * as faker from "faker";
import "jasmine-expect-count";
import * as _sodium from "libsodium-wrappers";
import {
  CryptoService,
  IDecryptedData,
  IEncryptedData,
  IPlainTextData,
} from "../../client/app/services/crypto.service";

/*
 * NAMING CONVENTIONS
 *
 * [SPEC]
 * these tests define the specifications for CryptoService
 * they should be kept simple, and except that values / attributes exist / are in a certain form
 *
 * [REGRESSION]
 * these tests gaurd against previously known bugs in CryptoService
 * they fail when the relevant bug is present in CryptoService
 */

describe("Crypto service", () => {

  const sampleEncrypted: IEncryptedData = {
    hashedRid: "rid",
    encryptedRecord: "record",
    encryptedRecordKey: "key",
    userPubKey: "pub",
    cY: "y",
    cX: "x",
    kId: "kid",
  };

  it("Correct storage and retrieval", () => {
    // setTimeout(() => {
    //   console.log('hello??')
    //   crypto.submitAndEncrypt('hello', 'world');
    //   crypto.submitAndEncrypt('hello', 'w0rld');
    //   const coords = crypto.retrieveCoords();

    //   console.log('c', coords);
    // }, 30000);
  });

  it("[SPEC] has a public submission api", async () => {
    (jasmine as any).expectCount(1);
    await cryptoPromise().then((crypto: CryptoService): void => {
      expect(crypto.submitAndEncrypt).toBeDefined();
    });
  });

  it("[SPEC] has a public decryption api", async () => {
    (jasmine as any).expectCount(1);
    await cryptoPromise().then((crypto: CryptoService): void => {
      expect(crypto.decryptData).toBeDefined();
    });
  });

  it("[SPEC] takes string input on the submission api", async () => {
    (jasmine as any).expectCount(1);
    await cryptoPromise().then((crypto: CryptoService): void => {
      const encryptedData: IEncryptedData = crypto.submitAndEncrypt("XXXXXXX", "Alice");
      expect(encryptedData).toBeTruthy();
    });
  });

  it("[SPEC] has an RID", async () => {
    (jasmine as any).expectCount(1);
    await cryptoPromise().then((crypto: CryptoService): void => {
      const encryptedData: IEncryptedData = crypto.submitAndEncrypt("XXXXXXX", "Alice");
      expect(encryptedData.hashedRid).toBeTruthy();
    });
  });

  it("[REGRESSION] returns non-zero slopes", async () => {
    (jasmine as any).expectCount(1);
    await cryptoPromise().then((crypto: CryptoService): void => {
      const userName: string = faker.name.findName();
      const perpInput: string = faker.name.findName();
      crypto.submitAndEncrypt(perpInput, userName); // self
      crypto.submitAndEncrypt(perpInput + "1", userName + "b"); // unmatched
      crypto.submitAndEncrypt(perpInput + "2", userName + "c"); // unmatched
      crypto.submitAndEncrypt(perpInput, userName + "a"); // match
      const decryptedData: IDecryptedData = crypto.decryptData();
      expect(decryptedData.slope.toJSNumber()).not.toEqual(0);
    });
  });

  it("[REGRESSION] returns RID for perpIDs starting with A-Z", async () => {
    let perpID: number = 65;
    const maxPerpID: number = 90;
    (jasmine as any).expectCount(maxPerpID - perpID + 1);
    await cryptoPromise().then((crypto: CryptoService): void => {
      while (perpID <= maxPerpID) {
        const encryptedData: IEncryptedData = crypto.submitAndEncrypt(String.fromCharCode(perpID), "Alice");
        expect(encryptedData.hashedRid).toBeTruthy('Using perpID "' + String.fromCharCode(perpID) + '"');
        perpID++;
      }
    });
  });

  async function cryptoPromise(): Promise<CryptoService> {
    await _sodium.ready;
    return new CryptoService(_sodium);
  }

});
