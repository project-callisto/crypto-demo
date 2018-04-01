import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { asyncCryptoServiceFactory } from "./async-crypto.service";
import { CryptoService, ICoord, IDecryptedData, IEncryptedData, IPlainTextData } from "./crypto.service";

abstract class ClientDataServiceBackend {

  protected cryptoEvent: Subject<void> = new Subject<void>();
  protected cryptoEncrypted: IEncryptedData;
  protected cryptoPlainText: IPlainTextData;
  protected cryptoDecrypted: IDecryptedData;
  protected cryptoCoords: ICoord[] = [];

  protected processUserInput(perp: string, user: string): void {
    asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
      const plainTextData: IPlainTextData = crypto.submitData(perp, user);
      this.updateCoords(plainTextData);
      this.updateCoords(crypto.submitData(perp + perp, user + "Alice")); // unmatched
      this.updateCoords(crypto.submitData("1234" + perp, user + "Bob")); // unmatched
      this.updateCoords(crypto.submitData(perp, user + user)); // matched!
      this.cryptoPlainText = plainTextData;
      this.cryptoDecrypted = crypto.decryptData();
      this.cryptoEncrypted = crypto.getDataSubmissions()[0];
      this.cryptoEvent.next();
    });
  }

  private updateCoords(plainTextData: IPlainTextData): void {
    this.cryptoCoords.push({
      x: plainTextData.U,
      y: plainTextData.sU,
      pi: plainTextData.pi,
    });
  }
}

@Injectable()
export class ClientDataService extends ClientDataServiceBackend {

  public readonly cryptoEvent$: Observable<void> = this.cryptoEvent.asObservable();
  public readonly cryptoEncrypted: IEncryptedData = this.cryptoEncrypted;
  public readonly cryptoPlainText: IPlainTextData = this.cryptoPlainText;
  public readonly cryptoDecrypted: IDecryptedData = this.cryptoDecrypted;
  public readonly cryptoCoords: ICoord[] = this.cryptoCoords;

  public submitUserInput(perp: string, user: string): void {
    this.processUserInput(perp, user);
  }

}

@Injectable()
export class SeededClientDataService extends ClientDataService {
  constructor() {
    super();
    this.submitUserInput("aodubadawd", "_______000!");
  }
}
