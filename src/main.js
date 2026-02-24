import { Ticker } from './components/Ticker.js';
import { tickerItems } from './data/tickerItems.js';
import { FloatingMenu } from './components/FloatingMenu.js';
import { floatingMenuItems } from './data/floatingMenuItems.js';

document.addEventListener('DOMContentLoaded', () => {
  const ticker = new Ticker({
    container: document.getElementById('ticker-container'),
    items: tickerItems,
    speed: 8,
    pauseOnHover: true
  });

  const floatingMenu = new FloatingMenu({
    container: document.body,
    items: floatingMenuItems,
    position: 'bottom-center',
    autoHide: false
  });
});
