import { CryptoService, IEncryptedData, IPlainTextData } from "../../client/app/services/crypto.service";

setTimeout(function() {
  //wait for sodium to load
  describe("Crypto service", () => {

    const crypto: CryptoService = new CryptoService();

    const sampleEncrypted = {
      hashedRid: 'rid',
      encryptedRecord: 'record',
      encryptedRecordKey: 'key',
      userPubKey: 'pub',
      cY: 'y',
      cX: 'x',
      kId: 'kid'
    }

    
    it('Correct storage and retrieval', () =>  {
      crypto.postData(sampleEncrypted);
      crypto.submitAndEncrypt('hello','world');
    });

    
    it("has a public submission api", () => {
      expect(crypto.createDataSubmission).toBeDefined();
    });

    it("has a public decryption api", () => {
      expect(crypto.decryptData).toBeDefined();
    });

    it("takes string input on the submission api", () => {
        const pT = crypto.createDataSubmission("perpId", "user");
        console.log('t',pT);
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
  });
}, 3000);

