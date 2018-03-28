import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { asyncCryptoServiceFactory } from "./async-crypto.service";
import { CryptoService, ICoord, IDecryptedData, IEncryptedData, IPlainTextData } from "./crypto.service";

class ClientDataServiceBackend {

  public cryptoPlainTextSource: Subject<IPlainTextData> = new Subject<IPlainTextData>();
  public cryptoEncryptedSource: Subject<IEncryptedData> = new Subject<IEncryptedData>();
  public cryptoDecryptedSource: Subject<IDecryptedData> = new Subject<IDecryptedData>();
  public coords: ICoord[] = [];

  public processUserInput(perp: string, user: string): void {
    asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
      const pT: IPlainTextData = crypto.submitData(perp, user);
      this.updateCoords(pT);
      this.cryptoPlainTextSource.next(pT);
      this.updateCoords(crypto.submitData(perp + perp, user + "Alice"));
      this.updateCoords(crypto.submitData("1234" + perp, user + "Bob"));
      this.updateCoords(crypto.submitData(perp, user + user));
      this.cryptoEncryptedSource.next(crypto.getDataSubmissions()[0]);
      this.cryptoDecryptedSource.next(crypto.decryptData());
    });
  }

  private updateCoords(pT: IPlainTextData): void {
    let coord = {
      x: pT.U,
      y: pT.sU,
      pi: pT.pi,
    };
    this.coords.push(coord);
  }
}

@Injectable()
class ClientDataServiceApi extends ClientDataServiceBackend {

  public cryptoPlainText$: Observable<IPlainTextData> = this.cryptoPlainTextSource.asObservable();
  public cryptoEncrypted$: Observable<IEncryptedData> = this.cryptoEncryptedSource.asObservable();
  public cryptoDecrypted$: Observable<IDecryptedData> = this.cryptoDecryptedSource.asObservable();

  public submitUserInput(perp: string, user: string): void {
    this.processUserInput(perp, user);
  }

}

export { ClientDataServiceApi as ClientDataService };
