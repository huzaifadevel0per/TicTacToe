(function () {
  const KEY = 'bp3:theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  let stored = null;

  try {
    stored = localStorage.getItem(KEY);
  } catch (error) {
    stored = null;
  }

  function current() {
    return stored || (media.matches ? 'dark' : 'light');
  }

  function paint(theme) {
    const dark = theme === 'dark';
    root.dataset.theme = theme;

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', dark ? '#08101c' : '#f7f6f3');
    }

    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      const label = dark ? 'Switch to light theme' : 'Switch to dark theme';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(dark));
    });
  }

  paint(current());

  function init() {
    paint(current());

    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        stored = current() === 'dark' ? 'light' : 'dark';

        try {
          localStorage.setItem(KEY, stored);
        } catch (error) {
          // Storage blocked: the theme still applies for this page.
        }

        paint(stored);
      });
    });

    media.addEventListener('change', function () {
      if (!stored) {
        paint(current());
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
