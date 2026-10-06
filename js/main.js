// =========================================================
// 1. Thème clair / sombre
// Ajoute ou enlève data-theme="dark" sur <html>.
// Le CSS change alors toutes les couleurs (voir les variables).
// Le choix est gardé dans le navigateur (localStorage).
// =========================================================
const themeButton = document.getElementById("theme-toggle");
const html = document.documentElement;

function updateThemeButton() {
  themeButton.textContent = html.dataset.theme === "dark" ? "☀" : "☾";
}

themeButton.addEventListener("click", () => {
  if (html.dataset.theme === "dark") {
    delete html.dataset.theme;
  } else {
    html.dataset.theme = "dark";
  }
  updateThemeButton();
  try { localStorage.setItem("theme", html.dataset.theme || "light"); } catch (e) {}
});

updateThemeButton();


// =========================================================
// 2. Langue FR / EN
// Le français est écrit dans le HTML, l'anglais dans data-en="...".
// Au premier clic, on garde le français dans data-fr pour pouvoir revenir.
// =========================================================
const langButton = document.getElementById("lang-toggle");
let lang = "fr";

function setLanguage(newLang) {
  lang = newLang;
  html.lang = lang;
  langButton.textContent = lang === "fr" ? "EN" : "FR";

  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!el.dataset.fr) el.dataset.fr = el.innerHTML;
    el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.fr;
  });

  typeIndex = 0; // repart au premier mot dans la nouvelle langue
  try { localStorage.setItem("lang", lang); } catch (e) {}
}

langButton.addEventListener("click", () => {
  setLanguage(lang === "fr" ? "en" : "fr");
});


// =========================================================
// 3. Texte qui s'écrit dans le hero
// =========================================================
const words = {
  fr: ["support TI", "dev web", "IA & données", "cybersécurité", "réseau"],
  en: ["IT support", "web dev", "AI & data", "cybersecurity", "networking"],
};
const typed = document.getElementById("typed");
let typeIndex = 0;

function typeWord() {
  const word = words[lang][typeIndex];
  let i = 0;

  // On écrit le mot lettre par lettre...
  const writing = setInterval(() => {
    typed.textContent = word.slice(0, ++i);
    if (i === word.length) {
      clearInterval(writing);
      // ...on attend un peu, puis on passe au mot suivant
      setTimeout(() => {
        typeIndex = (typeIndex + 1) % words[lang].length;
        typeWord();
      }, 1800);
    }
  }, 80);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion) typeWord();


// =========================================================
// 4. Filtres des projets (Tous / Web / IA)
// =========================================================
const filterButtons = document.querySelectorAll(".filter");
const frames = document.querySelectorAll(".frame");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    button.classList.add("is-active");

    const filter = button.dataset.filter;
    frames.forEach((frame) => {
      const show = filter === "all" || frame.dataset.category === filter;
      frame.classList.toggle("is-hidden", !show);
    });
  });
});


// =========================================================
// 5. Apparition des sections au scroll
// =========================================================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));


// =========================================================
// 6. Vidéos des projets : lecture au survol
// (fonctionne dès que tu remplaces une image par une <video>)
// =========================================================
frames.forEach((frame) => {
  const video = frame.querySelector("video");
  if (!video) return;
  frame.addEventListener("mouseenter", () => video.play());
  frame.addEventListener("mouseleave", () => video.pause());
});


// =========================================================
// 7. Agrandir une photo iPhone au clic
// =========================================================
const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.innerHTML = "<img alt=''>";
document.body.appendChild(lightbox);

document.querySelectorAll(".shot img").forEach((img) => {
  img.addEventListener("click", () => {
    lightbox.querySelector("img").src = img.src;
    lightbox.querySelector("img").alt = img.alt;
    lightbox.classList.add("open");
  });
});

lightbox.addEventListener("click", () => lightbox.classList.remove("open"));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") lightbox.classList.remove("open");
});


// Langue gardée de la dernière visite
try { if (localStorage.getItem("lang") === "en") setLanguage("en"); } catch (e) {}
