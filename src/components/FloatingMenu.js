export class FloatingMenu {
  constructor(options = {}) {
    this.container = options.container;
    this.items = options.items || [];
    this.position = options.position || 'bottom-center';
    this.autoHide = options.autoHide !== false;
    this.hideDelay = options.hideDelay || 3000;
    this.showDelay = options.showDelay || 100;
    
    this.init();
  }

  init() {
    if (!this.container) return;

    const menu = this.createMenu();
    this.menu = menu;
    this.container.appendChild(menu);

    this.items.forEach((item, index) => {
      const menuItem = this.createMenuItem(item, index);
      this.menu.appendChild(menuItem);
    });

    if (this.autoHide) {
      this.setupAutoHide();
    }
  }

  createMenu() {
    const menu = document.createElement('div');
    menu.className = `floating-menu floating-menu-${this.position}`;
    return menu;
  }

  createMenuItem(item, index) {
    const menuItem = document.createElement('a');
    menuItem.className = 'floating-menu-item';
    menuItem.href = item.href || '#';
    if (item.target) {
      menuItem.target = item.target;
    }
    if (item.onClick) {
      menuItem.addEventListener('click', (e) => {
        e.preventDefault();
        item.onClick();
      });
    }

    const icon = document.createElement('span');
    icon.className = 'floating-menu-icon';
    icon.textContent = item.icon;

    const label = document.createElement('span');
    label.className = 'floating-menu-label';
    label.textContent = item.label;

    const badge = item.badge ? this.createBadge(item.badge) : null;

    menuItem.appendChild(icon);
    menuItem.appendChild(label);
    if (badge) menuItem.appendChild(badge);

    if (item.tooltip) {
      menuItem.setAttribute('title', item.tooltip);
      menuItem.dataset.tooltip = item.tooltip;
    }

    return menuItem;
  }

  createBadge(text) {
    const badge = document.createElement('span');
    badge.className = 'floating-menu-badge';
    badge.textContent = text;
    return badge;
  }

  setupAutoHide() {
    let hideTimeout;
    let showTimeout;

    const show = () => {
      clearTimeout(hideTimeout);
      clearTimeout(showTimeout);
      this.menu.classList.add('visible');
    };

    const hide = () => {
      showTimeout = clearTimeout(showTimeout);
      hideTimeout = setTimeout(() => {
        this.menu.classList.remove('visible');
      }, this.hideDelay);
    };

    this.menu.addEventListener('mouseenter', show);
    this.menu.addEventListener('mouseleave', hide);
    document.addEventListener('mousemove', (e) => {
      const rect = this.menu.getBoundingClientRect();
      const isNear = 
        e.clientX >= rect.left - 50 && 
        e.clientX <= rect.right + 50 && 
        e.clientY >= rect.top - 50 && 
        e.clientY <= rect.bottom + 50;
      
      if (isNear) {
        show();
      } else {
        hide();
      }
    });
  }

  updateItems(newItems) {
    this.items = newItems;
    this.menu.innerHTML = '';
    this.items.forEach((item, index) => {
      const menuItem = this.createMenuItem(item, index);
      this.menu.appendChild(menuItem);
    });
  }

  show() {
    this.menu.classList.add('visible');
  }

  hide() {
    this.menu.classList.remove('visible');
  }
}
