import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule }              from './app.module';
import '../index.css';

// Handle focus back to window
window.addEventListener('focus', () => {
  const searchInput = document.querySelector('.search-input') as HTMLElement;
  if (searchInput) {
    searchInput.focus();
  }
});

// Handle click in empty space
document.addEventListener('click', (e) => {
  if (e.target === document.body) {
    const searchInput = document.querySelector('.search-input') as HTMLElement;
    if (searchInput) {
      searchInput.focus();
    }
  }
});

platformBrowserDynamic().bootstrapModule(AppModule);
