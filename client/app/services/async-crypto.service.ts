import { Injectable } from "@angular/core";
import * as _uninitalizedSodiumDoNotUse from "libsodium-wrappers";
import { CryptoService } from "./crypto.service";

// use this one in unit tests
export async function asyncCryptoServiceFactory(): Promise<CryptoService> {
  await _uninitalizedSodiumDoNotUse.ready;
  return new CryptoService(_uninitalizedSodiumDoNotUse);
}

// use this one in views
@Injectable()
export class AsyncCryptoService {
  public cryptoPromise: Promise<CryptoService>;

  constructor() {
    this.cryptoPromise = (async (): Promise<CryptoService> => {
      await _uninitalizedSodiumDoNotUse.ready;
      return new CryptoService(_uninitalizedSodiumDoNotUse);
    })();
  }
}
