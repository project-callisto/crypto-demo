import { CryptoService, EncryptedData, PlainTextData } from "./../../client/app/services/crypto.service";

describe("Crypto service", (): void => {
  const crypto: CryptoService = new CryptoService();

  it("[ SPEC ] has a public submission api, that takes in strings", () => {
    const data: EncryptedData = crypto.encryptRID("a")
    expect(data).toBeDefined();
  });

  it("[ SPEC ] has a public decryption api", (): void => {
    expect(crypto.decryptData).toBeDefined();
  });

  it("[ REGRESSION ] returns an object with an RID from the public submission api", (): void => {
    const data: EncryptedData = crypto.encryptRID("a")
    expect(data.hashedRid).toBeTruthy();
  });

  it("[ REGRESSION ] returns RID for perpIDs starting with A-Z", (): void => {
    let perpID: number = 65;
    const maxPerpID: number = 90;

    while (perpID <= maxPerpID) {
      const data: EncryptedData = crypto.encryptRID(String.fromCharCode(perpID))
      expect(data.hashedRid).toBeTruthy();
      perpID++;
    }

  });

});
