import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


console.log('process.env.NODE_ENV')
console.log(process.env.NODE_ENV)
console.log('process.env.NODE_ENV')

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
