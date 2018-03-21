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
  const sodium: any = _uninitalizedSodiumDoNotUse;
  return new CryptoService(sodium);
}

/*
 * A class wrapper around asyncCryptoServiceFactory
 *
 * At time of writing, this is only useful in angular components.
 * It is instanced once, to provide a single CryptoService instance
 * for all controllers.
 *
 * The @Injectable() decorator is for angular's dependency injection
 * https://angular.io/guide/architecture-services
 */
@Injectable()
export class AsyncCryptoService {
  public cryptoPromise: Promise<CryptoService>;

  constructor() {
    this.cryptoPromise = asyncCryptoServiceFactory();
  }
}
