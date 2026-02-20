const ThemeManager = {
  STORAGE_KEY: 'clutch-theme',
  DARK_THEME: 'dark',
  LIGHT_THEME: 'light',
  currentTheme: 'dark',

  init() {
    this.loadTheme();
    this.setupToggleButton();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);
    const theme = savedTheme || this.DARK_THEME;
    this.applyTheme(theme);
  },

  applyTheme(theme) {
    this.currentTheme = theme;
    const html = document.documentElement;

    if (theme === this.LIGHT_THEME) {
      html.classList.add('theme-light');
    } else {
      html.classList.remove('theme-light');
    }

    localStorage.setItem(this.STORAGE_KEY, theme);
    this.updateMonacoTheme(theme);
    this.updateToggleButton(theme);
  },

  updateMonacoTheme(theme) {
    if (window.monaco) {
      const monacoTheme = theme === this.LIGHT_THEME ? 'vs' : 'vs-dark';
      monaco.editor.setTheme(monacoTheme);
    } else {
      window.monacoTheme = theme;
    }
  },

  updateToggleButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.innerHTML = theme === this.LIGHT_THEME 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.title = theme === this.LIGHT_THEME ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }
  },

  toggle() {
    const newTheme = this.currentTheme === this.DARK_THEME 
      ? this.LIGHT_THEME 
      : this.DARK_THEME;
    this.applyTheme(newTheme);
  },

  setupToggleButton() {
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => this.toggle());
    }
  }
};

// Apply theme immediately to prevent flash
(function() {
  const savedTheme = localStorage.getItem('clutch-theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.add('theme-light');
  }
})();

window.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
});

window.ThemeManager = ThemeManager;
