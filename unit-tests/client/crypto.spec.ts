import * as faker from "faker";
import * as _sodium from "libsodium-wrappers";
import {
  CryptoService,
  IDecryptedData,
  IEncryptedData,
  IPlainTextData,
} from "../../client/app/services/crypto.service";

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

  it("[SPEC] has a public submission api", () => {
    cryptoPromise().then((crypto: CryptoService): void => {
      expect(crypto.submitAndEncrypt).toBeDefined();
    });
  });

  it("[SPEC] has a public decryption api", () => {
    // expect(crypto.decryptData).toBeDefined();
  });

  it("[REGRESSION] returns non-zero slopes", () => {
    // generateMultiplePerpInput();
    // const decryptedData: IDecryptedData = crypto.decryptData();
    // expect(decryptedData.slope.toJSNumber()).not.toEqual(0);
  });

  it("takes string input on the submission api", () => {
    // const pT = crypto.createDataSubmission("perpId", "user");
    // console.log('t',pT);
    //   (plainText: IPlainTextData) => {
    //     const encryptedData: IEncryptedData = this.crypto.encryptData(plainText);
    //     expect(encryptedData).toBeTruthy();
    //   },
    // );

  });

  it("has an RID", () => {
    // setTimeout(() => {
    //   crypto.createDataSubmission("perpId", "user").then(
    //     (plainText: IPlainTextData) => {
    //       const encryptedData: IEncryptedData = this.crypto.encryptData(plainText);
    //       expect(encryptedData.hashedRid).toBeTruthy();
    //     },
    //   );
    // }, 10000);
  });

  it("returns RID for perpIDs starting with A-Z", () => {
    // let perpID: number = 65;
    // const maxPerpID: number = 90;

    // while (perpID <= maxPerpID) {
    //   setTimeout(() => {
    //     crypto.createDataSubmission(String.fromCharCode(perpID), "Alice").then(
    //       (plainText: IPlainTextData) => {
    //         const encryptedData: IEncryptedData = this.crypto.encryptData(plainText);
    //         expect(encryptedData.hashedRid).toBeTruthy('Using perpID "' + String.fromCharCode(perpID) + '"');
    //       },
    //     );
    //   }, 10000);
    //   perpID++;
    // }

  });

  async function cryptoPromise(): Promise<CryptoService> {
    await _sodium.ready;
    return new CryptoService(_sodium);
  }

  // function generateMultiplePerpInput(): void {
  //   const userName: string = faker.name.findName();
  //   const perpInput: string = faker.name.findName();
  //   crypto.submitAndEncrypt(perpInput, userName); // match
  //   crypto.submitAndEncrypt(perpInput, userName + "a"); // unmatched
  //   crypto.submitAndEncrypt(perpInput + "1", userName + "b"); // unmatched
  //   crypto.submitAndEncrypt(perpInput + "2", userName + "c"); // unmatched
  // }

});
