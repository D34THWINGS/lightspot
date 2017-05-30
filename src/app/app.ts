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

if (process.env.NODE_ENV === 'production') {
  // Handle blur from window
  window.addEventListener('blur', () => {
    window.close();
  });
}

// Handle click in empty space
document.addEventListener('click', (e: MouseEvent) => {
  if (e.target === document.body) {
    window.close();
  }
});

platformBrowserDynamic().bootstrapModule(AppModule);
