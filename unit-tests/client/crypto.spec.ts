import { CryptoService, EncryptedData, PlainTextData } from "./../../client/app/services/crypto.service";

describe("Crypto service", (): void => {
  const crypto: CryptoService = new CryptoService();

  it("[ SPEC ] has a public submission api, that takes in strings", () => {
    return crypto.createDataSubmission("a").then((data) => {
      expect(data).toBeTruthy();
    });
  });

  it("[ SPEC ] has a public decryption api", (): void => {
    expect(crypto.decryptData).toBeDefined();
  });

  it("[ SPEC ] has an RID", (): void => {
    setTimeout(() => {
      crypto.createDataSubmission("a").then(
        (plainText: PlainTextData) => {
          const encryptedData: EncryptedData = this.crypto.encryptData(plainText);
          expect(encryptedData.hashedRid).toBeTruthy();
        },
      );
    }, 10000);
  });

  it("[ REGRESSION ] returns RID for perpIDs starting with A-Z", (): void => {
    let perpID: number = 65;
    const maxPerpID: number = 90;

    while (perpID <= maxPerpID) {
      setTimeout(() => {
        crypto.createDataSubmission(String.fromCharCode(perpID)).then(
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
