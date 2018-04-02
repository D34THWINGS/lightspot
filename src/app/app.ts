import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import '../index.css';
import { AppModule } from './app.module';

if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

// Handle focus back to window
window.addEventListener('focus', () => {
  const searchInput = document.querySelector('.search-input') as HTMLElement;
  if (searchInput) {
    searchInput.focus();
  }
});

platformBrowserDynamic().bootstrapModule(AppModule);
