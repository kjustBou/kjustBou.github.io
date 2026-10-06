// =========================================================
// Thème clair / sombre
// Ajoute ou enlève data-theme="dark" sur <html>.
// Le CSS change alors toutes les couleurs (voir les variables).
// =========================================================
const themeButton = document.getElementById("theme-toggle");

function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === "dark";

  if (isDark) {
    delete html.dataset.theme;
    themeButton.textContent = "☾";
  } else {
    html.dataset.theme = "dark";
    themeButton.textContent = "☀";
  }
}

themeButton.addEventListener("click", toggleTheme);
