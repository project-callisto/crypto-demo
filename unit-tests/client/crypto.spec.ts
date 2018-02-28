import { CryptoService, EncryptedData, PlainTextData } from "../../client/app/services/crypto.service";

describe("Crypto service", function () {
  const crypto = new CryptoService();

  it("has a public submission api", function () {
    expect(crypto.createDataSubmission).toBeDefined();
  });

  it("has a public decryption api", function () {
    expect(crypto.decryptData).toBeDefined();
  });

  it("takes string input on the submission api", function () {
    setTimeout(() => {
      crypto.createDataSubmission("perpId", "user").then(
        (plainText: PlainTextData) => {
          const encryptedData: EncryptedData = this.crypto.encryptData(plainText);
          expect(encryptedData).toBeTruthy();
        },
      );
    }, 10000);
  });

  it("has an RID", function () {
    setTimeout(() => {
      crypto.createDataSubmission("perpId", "user").then(
        (plainText: PlainTextData) => {
          const encryptedData: EncryptedData = this.crypto.encryptData(plainText);
          expect(encryptedData.hashedRid).toBeTruthy();
        },
      );
    }, 10000);
  });

  it("returns RID for perpIDs starting with A-Z", function () {
    let perpID: number = 65;
    const maxPerpID: number = 90;

    while (perpID <= maxPerpID) {
      setTimeout(() => {
        crypto.createDataSubmission(String.fromCharCode(perpID), 'Alice').then(
          (plainText: PlainTextData) => {
            const encryptedData: EncryptedData = this.crypto.encryptData(plainText);
            expect(encryptedData.hashedRid).toBeTruthy('Using perpID "' + String.fromCharCode(perpID) + '"');
          },
        );
      }, 10000);
      perpID++;
    }

  });

});
