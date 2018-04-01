import { Injectable } from "@angular/core";
import bigInt = require("big-integer");
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { asyncCryptoServiceFactory } from "./async-crypto.service";
import { CryptoService, IDecryptedData, IEncryptedData, IPlainTextData } from "./crypto.service";

export interface ICoordGraph {
  readonly x: number;
  readonly y: number;
  pi?: string;
  matching?: boolean;
}

abstract class ClientDataServiceBackend {

  protected cryptoEvent: Subject<void> = new Subject<void>();
  protected cryptoEncrypted: IEncryptedData;
  protected cryptoPlainText: IPlainTextData;
  protected cryptoDecrypted: IDecryptedData;
  protected coords: ICoordGraph[] = [];

  protected processUserInput(perp: string, user: string): void {
    asyncCryptoServiceFactory().then((crypto: CryptoService): void => {
      this.coords = [];
      const plainTextData: IPlainTextData = crypto.submitData(perp, user);
      this.transformAndAddCoord(plainTextData);
      this.transformAndAddCoord(crypto.submitData(perp + perp, user + "Alice")); // unmatched
      this.transformAndAddCoord(crypto.submitData("1234" + perp, user + "Bob")); // unmatched
      this.transformAndAddCoord(crypto.submitData(perp, user + user)); // matched!
      this.cryptoPlainText = plainTextData;
      this.cryptoDecrypted = crypto.decryptData();
      this.cryptoEncrypted = crypto.getDataSubmissions()[0];
      this.addInterceptCoord();
      this.cryptoEvent.next();
    });
  }

  private transformAndAddCoord(plainTextData: IPlainTextData): void {
    const seenPhis: string[] = [];
    let coord: ICoordGraph;
    coord = {
      x: plainTextData.U.toJSNumber(),
      y: plainTextData.sU.toJSNumber(),
      pi: plainTextData.pi,
    };
    if (seenPhis.includes(plainTextData.pi)) {
      coord.matching = true;
    } else {
      coord.matching = false;
    }
    this.coords.push(coord);
    seenPhis.push(plainTextData.pi);
  }

  private addInterceptCoord(): void {
    this.coords.push({
      x: 0,
      y: this.cryptoDecrypted.slope.toJSNumber(),
      matching: true,
    });
  }

}

@Injectable()
export class ClientDataService extends ClientDataServiceBackend {

  public readonly cryptoEvent$: Observable<void> = this.cryptoEvent.asObservable();
  public readonly cryptoEncrypted: IEncryptedData = this.cryptoEncrypted;
  public readonly cryptoPlainText: IPlainTextData = this.cryptoPlainText;
  public readonly cryptoDecrypted: IDecryptedData = this.cryptoDecrypted;
  public readonly coords: ICoordGraph[] = this.coords;

  public submitUserInput(perp: string, user: string): void {
    this.processUserInput(perp, user);
  }

}

@Injectable()
export class SeededClientDataService extends ClientDataService {
  constructor() {
    super();
    this.submitUserInput("zodubadawd", "?_______000!");
  }
}
