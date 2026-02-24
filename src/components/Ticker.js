export class Ticker {
  constructor(options = {}) {
    this.container = options.container;
    this.items = options.items || [];
    this.speed = options.speed || 50;
    this.direction = options.direction || 'left';
    this.pauseOnHover = options.pauseOnHover !== false;
    this.itemsData = [];
    
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = '';
    const tickerWrap = this.createTickerWrap();
    this.tickerTrack = tickerWrap.querySelector('.ticker-track');
    
    this.items.forEach(item => {
      const tickerItem = this.createTickerItem(item);
      this.tickerTrack.appendChild(tickerItem);
    });

    const items = Array.from(this.tickerTrack.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      this.tickerTrack.appendChild(clone);
    });

    this.container.appendChild(tickerWrap);
    this.startAnimation();

    if (this.pauseOnHover) {
      tickerWrap.addEventListener('mouseenter', () => this.pause());
      tickerWrap.addEventListener('mouseleave', () => this.resume());
    }
  }

  createTickerWrap() {
    const wrap = document.createElement('div');
    wrap.className = 'ticker-wrap';
    
    const track = document.createElement('div');
    track.className = 'ticker-track';
    
    wrap.appendChild(track);
    return wrap;
  }

  createTickerItem(item) {
    const el = document.createElement('div');
    el.className = `ticker-item ticker-${item.type || 'default'}`;
    
    if (item.color) {
      el.style.setProperty('--ticker-color', item.color);
    }
    if (item.bgColor) {
      el.style.setProperty('--ticker-bg', item.bgColor);
    }
    if (item.accentColor) {
      el.style.setProperty('--ticker-accent', item.accentColor);
    }

    let content = item.content;
    
    switch (item.type) {
      case 'price':
        content = `<span class="ticker-icon">📊</span> ${item.symbol} <span class="ticker-price">${item.price}</span> <span class="ticker-change ${item.change >= 0 ? 'positive' : 'negative'}">${item.change >= 0 ? '+' : ''}${item.change}%</span>`;
        break;
      case 'quote':
        content = `<span class="ticker-icon">💬</span> <span class="ticker-quote">"${item.content}"</span>`;
        break;
      case 'alert':
        content = `<span class="ticker-icon">🔔</span> <span class="ticker-alert">${item.content}</span>`;
        break;
      case 'stat':
        content = `<span class="ticker-icon">📈</span> <span class="ticker-stat-label">${item.label}:</span> <span class="ticker-stat-value">${item.value}</span>`;
        break;
      case 'news':
        content = `<span class="ticker-icon">📰</span> <span class="ticker-news">${item.content}</span>`;
        break;
      case 'status':
        content = `<span class="ticker-icon">✓</span> <span class="ticker-status">${item.content}</span>`;
        break;
    }

    el.innerHTML = content;
    return el;
  }

  startAnimation() {
    this.position = 0;
    this.isPaused = false;
    this.animationId = null;
    this.animate();
  }

  animate() {
    if (this.isPaused) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }

    const trackWidth = this.tickerTrack.scrollWidth;
    const containerWidth = this.container.offsetWidth;

    this.position -= this.speed / 10;

    if (Math.abs(this.position) >= trackWidth / 2) {
      this.position = 0;
    }

    this.tickerTrack.style.transform = `translateX(${this.position}px)`;
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  updateItems(newItems) {
    this.items = newItems;
    this.tickerTrack.innerHTML = '';
    this.items.forEach(item => {
      const tickerItem = this.createTickerItem(item);
      this.tickerTrack.appendChild(tickerItem);
    });
    
    const items = Array.from(this.tickerTrack.children);
    items.forEach(item => {
      const clone = item.cloneNode(true);
      this.tickerTrack.appendChild(clone);
    });
  }
}
