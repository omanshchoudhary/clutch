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
      const iconKey = theme === this.LIGHT_THEME ? "theme-light" : "theme-dark";
      btn.innerHTML = window.UIIcons?.render(iconKey) || "";
      const label = theme === this.LIGHT_THEME ? "Switch to Dark Mode" : "Switch to Light Mode";
      btn.title = label;
      btn.setAttribute("aria-label", label);
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
