// =========================================================
// 1. Langue FR / EN
// Le français est écrit dans le HTML, l'anglais dans data-en="...".
// Au premier changement, on garde le français dans data-fr pour pouvoir revenir.
// =========================================================
const html = document.documentElement;
const langButton = document.getElementById("lang-toggle");
const themeButton = document.getElementById("theme-toggle");
let lang = "fr";

function setLanguage(newLang) {
  lang = newLang;
  html.lang = lang;
  langButton.textContent = lang === "fr" ? "EN" : "FR";
  langButton.setAttribute("aria-label", lang === "fr" ? "Switch to English" : "Passer en français");

  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!el.dataset.fr) el.dataset.fr = el.innerHTML;
    el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.fr;
  });

  updateThemeButton(); // le bouton de thème a aussi un texte à traduire
  try { localStorage.setItem("lang", lang); } catch (e) {}
}

langButton.addEventListener("click", () => {
  setLanguage(lang === "fr" ? "en" : "fr");
});


// =========================================================
// 2. Thème clair / sombre
// Par défaut, le site suit le réglage de l'ordinateur.
// Le bouton force "light" ou "dark" avec data-theme sur <html>,
// et le choix est gardé dans le navigateur (localStorage).
// =========================================================
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

function isDark() {
  if (html.dataset.theme) return html.dataset.theme === "dark";
  return systemDark.matches;
}

function updateThemeButton() {
  const labels = {
    fr: { dark: "Sombre", light: "Clair" },
    en: { dark: "Dark", light: "Light" },
  };
  // Le bouton affiche le thème vers lequel on va passer
  themeButton.textContent = isDark() ? labels[lang].light : labels[lang].dark;
}

themeButton.addEventListener("click", () => {
  html.dataset.theme = isDark() ? "light" : "dark";
  updateThemeButton();
  try { localStorage.setItem("theme", html.dataset.theme); } catch (e) {}
});

systemDark.addEventListener("change", updateThemeButton);
updateThemeButton();


// =========================================================
// 3. Capture qui apparaît au survol d'un projet
// Elle se place dans l'espace vide entre le texte et les liens,
// et suit le curseur seulement de haut en bas (pour ne rien cacher).
// Seulement avec une souris et un grand écran : sinon, la capture
// est déjà affichée dans la ligne grâce au CSS.
// =========================================================
const preview = document.querySelector(".preview");
const bigScreenWithMouse = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1101px)");

document.querySelectorAll(".project").forEach((project) => {
  const desc = project.querySelector(".project__desc");
  const links = project.querySelector(".project__links");

  project.addEventListener("mouseenter", () => {
    if (!bigScreenWithMouse.matches) return;
    preview.src = project.dataset.img;
    preview.classList.add("is-visible");
  });
  project.addEventListener("mouseleave", () => {
    preview.classList.remove("is-visible");
  });
  project.addEventListener("mousemove", (e) => {
    // Milieu de l'espace vide entre la description et les liens
    const x = (desc.getBoundingClientRect().right + links.getBoundingClientRect().left) / 2;
    preview.style.left = x + "px";
    preview.style.top = e.clientY + "px";
  });
});


// Langue gardée de la dernière visite
try { if (localStorage.getItem("lang") === "en") setLanguage("en"); } catch (e) {}
