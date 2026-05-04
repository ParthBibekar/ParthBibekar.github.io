(function () {
  const STORAGE_KEY = "theme";
  const THEME_LIGHT = "light";
  const THEME_DARK = "dark";

  function getTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === THEME_LIGHT || stored === THEME_DARK) {
        return stored;
      }
    } catch (e) {
      // localStorage not available
    }
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return THEME_LIGHT;
    }
    return THEME_DARK;
  }

  function setTheme(theme) {
    const isLight = theme === THEME_LIGHT;
    document.body.classList.toggle("light-mode", isLight);

    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", String(isLight));
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // localStorage not available
    }
  }

  function toggleTheme() {
    const current = document.body.classList.contains("light-mode")
      ? THEME_LIGHT
      : THEME_DARK;
    setTheme(current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT);
  }

  function init() {
    setTheme(getTheme());

    const btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", toggleTheme);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
