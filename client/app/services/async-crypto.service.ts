import { Injectable } from "@angular/core";
import * as _uninitalizedSodiumDoNotUse from "libsodium-wrappers";
import { CryptoService } from "./crypto.service";

/*
 * A libsodium readying wrapper around CryptoService
 *
 * Primarily useful in tests, where you want every spec to have its
 * own instance of CryptoService
 */
export async function asyncCryptoServiceFactory(): Promise<CryptoService> {
  await _uninitalizedSodiumDoNotUse.ready;
  return new CryptoService(_uninitalizedSodiumDoNotUse);
}

/*
 * A class wrapper around asyncCryptoServiceFactory
 *
 * At time of writing, this is only useful in angular components.
 * It is instanced once, to provide a single CryptoService instance
 * for all controllers.
 */
@Injectable()
export class AsyncCryptoService {
  public cryptoPromise: Promise<CryptoService>;

  constructor() {
    this.cryptoPromise = asyncCryptoServiceFactory();
  }
}
