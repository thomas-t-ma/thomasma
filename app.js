/* =========================================================
   Thomas Ma portfolio
   =========================================================
   The page intentionally keeps all content/matched images fixed.
   EXTRA_PHOTOS below are appended to the Hobbies gallery.
*/

/* ---------------------------------------------------------
   EXTRA HOBBY PHOTOS
   ---------------------------------------------------------
   1. Put extra images in: assets/images/extras/
   2. Add each path below.
   3. Every listed image is appended to the Hobbies masonry gallery.

   GitHub Pages cannot automatically enumerate a folder, so
   filenames still need to be listed here when you add them.
--------------------------------------------------------- */
const EXTRA_PHOTOS = [
  // "assets/images/extras/photo-01.jpg",
  // "assets/images/extras/photo-02.jpg",
  "assets/images/extras/FullSizeRender.jpg",
  "assets/images/extras/IMG_3870.jpg",
  "assets/images/extras/IMG_3872.jpg",
  "assets/images/extras/IMG_3886.jpg",
  "assets/images/extras/IMG_3889.jpg",
  "assets/images/extras/IMG_8915.JPG",
  "assets/images/extras/7R6A1764.JPG",
  "assets/images/extras/7R6A1767.JPG",
  "assets/images/extras/7R6A1770.JPG",
  "assets/images/extras/7R6A1775.JPG",
  "assets/images/extras/7R6A1875.JPG",
  "assets/images/extras/7R6A1915.JPG",
];

/* ---------------------------------------------------------
   HERO 3D MODEL
   ---------------------------------------------------------
   The right side of the intro is now the dedicated 3D slot.

   When you have a model:
   1. Put a GLB somewhere like: assets/models/intro.glb
   2. Set HERO_MODEL.src below to that path.

   With src left blank, the site shows woodruff-circle.png plus
   a small "3D model / To be filled" marker. Once src is set,
   that entire poster area is replaced by an interactive model.
--------------------------------------------------------- */
const HERO_MODEL = {
  src: "assets/models/small_emory.glb",
  poster: "assets/images/woodruff-circle.png",
  alt: "Interactive 3D model",
};

const MODEL_VIEWER_CDN =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js";


function initTypedText() {
  const target = document.querySelector("#typed-text");
  if (!target) return;

  const phrases = [
    "medicine",
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "cancer diagnosis models",
    "computer vision",
  ];

  // Give each phrase its own color family so the hero stays lively
  // without tying the typing effect to the section-button palette.
  const phraseColors = [
    "#fb7185", // medicine — coral/rose
    "#38bdf8", // artificial intelligence — electric blue
    "#a78bfa", // machine learning — violet
    "#818cf8", // deep learning — indigo
    "#f472b6", // cancer diagnosis models — rose
    "#22d3ee", // computer vision — cyan
  ];

  const typedLine = target.closest(".hero-typed");
  const applyPhraseColor = (index) => {
    if (!typedLine) return;
    typedLine.style.setProperty(
      "--typed-color",
      phraseColors[index % phraseColors.length]
    );
  };

  applyPhraseColor(0);

  if (window.Typed) {
    new window.Typed("#typed-text", {
      strings: phrases,
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      cursorChar: "▍",
      preStringTyped: (arrayPos) => applyPhraseColor(arrayPos),
    });
  } else {
    target.textContent = phrases[0];
  }
}

function initNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px" }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------------------------------------------------------
   Subtle pointer-following glass highlight.
   It only changes a radial highlight; cards do not tilt toward
   the cursor or move around.
--------------------------------------------------------- */
function initGlassHighlights() {
  const finePointer = window.matchMedia?.("(pointer: fine)").matches;
  if (!finePointer) return;

  document.querySelectorAll(".glass-reactive").forEach((surface) => {
    surface.addEventListener(
      "pointermove",
      (event) => {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
        surface.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
      },
      { passive: true }
    );
  });
}

/* ---------------------------------------------------------
   Extra photos -> Hobbies gallery.
--------------------------------------------------------- */
function normalizeAssetPath(path) {
  // Makes copied Windows paths (assets\\images\\...) safe for web URLs too.
  return String(path || "").trim().replace(/\\/g, "/");
}

function initExtraHobbyPhotos() {
  const gallery = document.querySelector("#hobbies .hobby-gallery");
  if (!gallery) return;

  const existingSources = new Set(
    [...gallery.querySelectorAll("img")].map((img) =>
      normalizeAssetPath(img.getAttribute("src"))
    )
  );

  EXTRA_PHOTOS
    .map(normalizeAssetPath)
    .filter(Boolean)
    .filter((src) => !existingSources.has(src))
    .forEach((src) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");

      figure.className = "hobby-photo glass-reactive hobby-photo-extra";
      image.src = src;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        console.warn(`Hobby photo could not be loaded: ${src}`);
        figure.remove();
      });

      figure.appendChild(image);
      gallery.appendChild(figure);
      existingSources.add(src);
    });
}

/* ---------------------------------------------------------
   Optional Emory2MC 3D viewer.
--------------------------------------------------------- */
let modelViewerLibraryPromise;

function ensureModelViewerLibrary() {
  if (customElements.get("model-viewer")) return Promise.resolve();
  if (modelViewerLibraryPromise) return modelViewerLibraryPromise;

  modelViewerLibraryPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_CDN;
    script.onload = async () => {
      try {
        await customElements.whenDefined("model-viewer");
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = () => reject(new Error("Could not load model-viewer."));
    document.head.appendChild(script);
  });

  return modelViewerLibraryPromise;
}

function initHeroModel() {
  const stage = document.querySelector("[data-hero-model]");
  if (!stage || !HERO_MODEL.src) return;

  ensureModelViewerLibrary()
    .then(() => {
      const viewer = document.createElement("model-viewer");
      viewer.setAttribute("src", HERO_MODEL.src);
      viewer.setAttribute("poster", HERO_MODEL.poster);
      viewer.setAttribute("alt", HERO_MODEL.alt || "Interactive 3D model");
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("touch-action", "pan-y");
      viewer.setAttribute("shadow-intensity", "1");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("interaction-prompt", "auto");
      stage.replaceChildren(viewer);
    })
    .catch((error) => {
      console.error(error);
      // The poster/placeholder stays visible if the viewer cannot load.
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  initNavigation();
  initTypedText();
  initRevealAnimations();
  initExtraHobbyPhotos();
  initGlassHighlights();
  initHeroModel();
});
