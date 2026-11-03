(function () {
  const STORAGE_KEY = "theme";
  const root = document.documentElement;

  function currentTheme() {
    return root.dataset.theme || "light";
  }

  function toggleTheme() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      // localStorage not available
    }
  }

  const btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", toggleTheme);
})();
