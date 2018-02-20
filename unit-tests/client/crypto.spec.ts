import { CryptoService, EncryptedData } from "../../client/app/services/crypto.service";

describe("Crypto services tests", function () {
  const crypto = new CryptoService();

  it("has an encryptData method", function () {
    expect(crypto.encryptData).toBeDefined();
  });

  it("has an decryptData method", function () {
    expect(crypto.decryptData).toBeDefined();
  });

  it("can encrypt data", function () {
    const data: EncryptedData = crypto.encryptData("a");
    expect(data.encryptedRecordKey).toBeTruthy();
  });

  it("has an RID", function () {
    const data: EncryptedData = crypto.encryptData("a");
    expect(data.rid).toBeTruthy();
  });

  it("returns RID for perpIDs starting with A-Z", function () {
    let perpID: number = 65;
    const maxPerpID: number = 90;

    while (perpID <= maxPerpID) {
      const data: EncryptedData = crypto.encryptData(String.fromCharCode(perpID));
      expect(data.rid).toBeTruthy('Using perpID "' + String.fromCharCode(perpID) + '"');
      perpID++;
    }
  });
});
