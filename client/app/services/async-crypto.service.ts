import { Injectable } from "@angular/core";
import * as _uninitalizedSodiumDoNotUse from "libsodium-wrappers";
import { CryptoService } from "./crypto.service";

/*
 * A libsodium readying wrapper around CryptoService
 */
export async function asyncCryptoServiceFactory(): Promise<CryptoService> {
  await _uninitalizedSodiumDoNotUse.ready;
  const sodium: any = _uninitalizedSodiumDoNotUse;
  return new CryptoService(sodium);
}
