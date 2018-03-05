import { CryptoService, IEncryptedData, IPlainTextData } from "../../client/app/services/crypto.service";

describe("Crypto service", () => {
  const crypto: CryptoService = new CryptoService();

  it("has a public submission api", () => {
    expect(crypto.createDataSubmission).toBeDefined();
  });

  it("has a public decryption api", () => {
    expect(crypto.decryptData).toBeDefined();
  });

  it("takes string input on the submission api", () => {
    setTimeout(() => {
      crypto.createDataSubmission("perpId", "user").then(
        (plainText: IPlainTextData) => {
          const encryptedData: IEncryptedData = this.crypto.encryptData(plainText);
          expect(encryptedData).toBeTruthy();
        },
      );
    }, 10000);
  });

  it("has an RID", () => {
    setTimeout(() => {
      crypto.createDataSubmission("perpId", "user").then(
        (plainText: IPlainTextData) => {
          const encryptedData: IEncryptedData = this.crypto.encryptData(plainText);
          expect(encryptedData.hashedRid).toBeTruthy();
        },
      );
    }, 10000);
  });

  it("returns RID for perpIDs starting with A-Z", () => {
    let perpID: number = 65;
    const maxPerpID: number = 90;

    while (perpID <= maxPerpID) {
      setTimeout(() => {
        crypto.createDataSubmission(String.fromCharCode(perpID), "Alice").then(
          (plainText: IPlainTextData) => {
            const encryptedData: IEncryptedData = this.crypto.encryptData(plainText);
            expect(encryptedData.hashedRid).toBeTruthy('Using perpID "' + String.fromCharCode(perpID) + '"');
          },
        );
      }, 10000);
      perpID++;
    }

  });

});
