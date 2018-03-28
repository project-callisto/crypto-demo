import * as faker from "faker";
import "jasmine-expect-count";
import { asyncCryptoServiceFactory } from "../../client/app/services/async-crypto.service";
import {
  CryptoService,
  IDecryptedData,
  IEncryptedData,
  IPlainTextData,
} from "../../client/app/services/crypto.service";

import bigInt = require("big-integer");



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

function getRandom(max) {
  return Math.floor(Math.random() * Math.floor(max));

}

function createName() {
  var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
  var name = '';
    for (var i = 0; i < getRandom(128); i++) {
      var index = getRandom(alphabet.length);
      name += alphabet[index];
    }

    if (name === '') {
      name = 'XXXXXX'
    }
  return name;
}

describe("Crypto service", () => {
  it("[VALUES] Values match E2E", async () => {
    (jasmine as any).expectCount(1);
    await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
      var perp = 'XXXXXX';
      var user = 'Alice';
      let ptA = crypto.submitData('XXXXXX', 'Alice');
      crypto.submitData(perp + perp, user + "Alice");
      crypto.submitData("1234" + perp, user + "Bob");
      crypto.submitData(perp, user + user);

      let decrypted = crypto.decryptData();
      expect(decrypted.k).toEqual(ptA.k);
    });
  });

  it("[VALUES] stress test", async () => {
    const testNum = 1000;
    (jasmine as any).expectCount(testNum);
    for (var i = 0; i < testNum; i++) {
      await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
        var perpName = createName();
        var userName = createName();
        console.log(i, perpName, userName);

        let ptA = crypto.submitData(perpName, userName);
        let ptB = crypto.submitData(perpName, userName + userName);
        
        let decrypted = crypto.decryptData();
        expect(decrypted.k).toEqual(ptA.k);
      });
    }
  });



  it("[VALUES] correct user values between two users with matching pis", async () => {
    (jasmine as any).expectCount(7);
    await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
        const pTAlice = crypto.submitData("XXXXXXX", "Alice");
        const pTBob = crypto.submitData("XXXXXXX", "Bob");

        expect(pTAlice.pHat).toEqual(pTBob.pHat);
        expect(pTAlice.U === pTBob.U).toEqual(false);
        expect(pTAlice.s === pTBob.s).toEqual(false);
        expect(pTAlice.a).toEqual(pTBob.a);
        expect(pTAlice.k).toEqual(pTBob.k);
        expect(pTAlice.pi).toEqual(pTBob.pi);
        expect(pTAlice.recordKey === pTBob.recordKey).toEqual(false);
    });
  });

  it("[VALUES] correct key value from encryption to decryption", async () => {
    (jasmine as any).expectCount(1);
    await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
        let ptAlice = crypto.submitData("XXXXXXX", "Alice");
        let ptBob = crypto.submitData("XXXXXXX", "Bob");
        let decrypted = crypto.decryptData();

        expect(decrypted.k).toEqual(ptAlice.k);
    });
  });

  // same slope from encryption to decryption

  it("[SPEC] has a public submission api", async () => {
    (jasmine as any).expectCount(1);
    await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
      expect(crypto.submitData).toBeDefined();
    });
  });

  it("[SPEC] has a public decryption api", async () => {
    (jasmine as any).expectCount(1);
    await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
      expect(crypto.decryptData).toBeDefined();
    });
  });

  // it("[SPEC] takes string input on the submission api", async () => {
  //   (jasmine as any).expectCount(1);
  //   await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
  //     const encryptedData: IEncryptedData = crypto.submitAndEncrypt("XXXXXXX", "Alice");
  //     expect(encryptedData).toBeTruthy();
  //   });
  // });

  // it("[SPEC] has an RID", async () => {
  //   (jasmine as any).expectCount(1);
  //   await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
  //     const encryptedData: IEncryptedData = crypto.submitAndEncrypt("XXXXXXX", "Alice");
  //     expect(encryptedData.hashedRid).toBeTruthy();
  //   });
  // });

  // it("[REGRESSION] returns RID for perpIDs starting with A-Z", async () => {
  //   let perpID: number = 65;
  //   const maxPerpID: number = 90;
  //   (jasmine as any).expectCount(maxPerpID - perpID + 1);
  //   await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
  //     while (perpID <= maxPerpID) {
  //       const encryptedData: IEncryptedData = crypto.submitAndEncrypt(String.fromCharCode(perpID), "Alice");
  //       expect(encryptedData.hashedRid).toBeTruthy('Using perpID "' + String.fromCharCode(perpID) + '"');
  //       perpID++;
  //     }
  //   });
  // });

  // it("[REGRESSION] returns non-zero slopes", async () => {
  //   (jasmine as any).expectCount(1);
  //   await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
  //     const userName: string = faker.name.findName();
  //     const perpInput: string = faker.name.findName();
  //     crypto.submitAndEncrypt(perpInput, userName); // self
  //     crypto.submitAndEncrypt(perpInput + "1", userName + "b"); // unmatched
  //     crypto.submitAndEncrypt(perpInput + "2", userName + "c"); // unmatched
  //     crypto.submitAndEncrypt(perpInput, userName + "a"); // match
  //     const decryptedData: IDecryptedData = crypto.decryptData();
  //     expect(decryptedData.slope.toJSNumber()).not.toEqual(0);
  //   });
  // });

  // it("[REGRESSION] returns non-zero slopes for perpIDs starting A-Z", async () => {
  //   let perpID: number = 65;
  //   const maxPerpID: number = 90;
  //   (jasmine as any).expectCount(maxPerpID - perpID + 1);
  //   await asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
  //     while (perpID <= maxPerpID) {
  //       const userName: string = faker.name.findName();
  //       const perpInput: string = String.fromCharCode(perpID) + faker.name.findName();
  //       crypto.submitAndEncrypt(perpInput, userName); // self
  //       crypto.submitAndEncrypt(perpInput + "1", userName + "b"); // unmatched
  //       crypto.submitAndEncrypt(perpInput + "2", userName + "c"); // unmatched
  //       crypto.submitAndEncrypt(perpInput, userName + "a"); // match
  //       const decryptedData: IDecryptedData = crypto.decryptData();
  //       expect(decryptedData.slope.toJSNumber()).not.toEqual(0);
  //       perpID++;
  //     }
  //   });
  // });

});
