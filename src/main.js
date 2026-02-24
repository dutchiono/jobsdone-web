import { Ticker } from './components/Ticker.js';
import { tickerItems } from './data/tickerItems.js';

document.addEventListener('DOMContentLoaded', () => {
  const ticker = new Ticker({
    container: document.getElementById('ticker-container'),
    items: tickerItems,
    speed: 8,
    pauseOnHover: true
  });
});
