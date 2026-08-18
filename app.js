/* =========================================================
   Thomas Ma portfolio
   =========================================================
   The page intentionally keeps all content/matched images fixed.
   Only EXTRA_PHOTOS below are optional and randomized.
*/

/* ---------------------------------------------------------
   OPTIONAL EXTRA PHOTOS
   ---------------------------------------------------------
   1. Put extra images in: assets/images/extras/
   2. Add each path below.
   3. Once at least one path is present, a "Photos" control
      appears in the desktop navigation.
   4. Turning it on scatters a small random selection behind
      the main page content. These NEVER replace content images.

   GitHub Pages cannot automatically enumerate a folder, so
   filenames still need to be listed here when you add them.
--------------------------------------------------------- */
const EXTRA_PHOTOS = [
  // "assets/images/extras/photo-01.jpg",
  // "assets/images/extras/photo-02.jpg",
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
  src: "", // Example: "assets/models/intro.glb"
  poster: "assets/images/woodruff-circle.png",
  alt: "Interactive 3D model",
};

const MODEL_VIEWER_CDN =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js";

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

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
   Optional scattered photo layer.
--------------------------------------------------------- */
function renderExtraPhotos() {
  const layer = document.querySelector("#extra-photo-layer");
  const toggle = document.querySelector("#extra-photo-toggle");
  if (!layer || !toggle) return;

  const photos = EXTRA_PHOTOS.filter(Boolean);
  if (!photos.length || window.innerWidth < 1300) {
    toggle.hidden = true;
    layer.replaceChildren();
    document.body.classList.remove("extra-photos-on");
    return;
  }

  toggle.hidden = false;
  layer.style.height = `${document.documentElement.scrollHeight}px`;
  layer.replaceChildren();

  const selected = shuffle(photos).slice(0, Math.min(photos.length, 6));
  const slots = [
    { y: 0.12, side: "right", r: -5 },
    { y: 0.28, side: "left", r: 4 },
    { y: 0.44, side: "right", r: 3 },
    { y: 0.61, side: "left", r: -4 },
    { y: 0.77, side: "right", r: 5 },
    { y: 0.91, side: "left", r: 2 },
  ];

  const contentWidth = 1180;
  const outerMargin = Math.max(0, (window.innerWidth - contentWidth) / 2);
  const documentHeight = document.documentElement.scrollHeight;

  selected.forEach((src, index) => {
    const slot = slots[index];
    const width = 150 + Math.round(Math.random() * 34);
    const figure = document.createElement("figure");
    const image = document.createElement("img");

    figure.className = "extra-photo";
    figure.style.top = `${Math.round(documentHeight * slot.y)}px`;
    figure.style.setProperty("--photo-width", `${width}px`);
    figure.style.setProperty("--photo-rotate", `${slot.r + (Math.random() * 2 - 1)}deg`);

    if (slot.side === "left") {
      const left = Math.max(10, outerMargin - width * 0.72);
      figure.style.left = `${left}px`;
    } else {
      const left = Math.min(
        window.innerWidth - width - 10,
        window.innerWidth - outerMargin + width * 0.08
      );
      figure.style.left = `${Math.max(10, left)}px`;
    }

    image.src = src;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    figure.appendChild(image);
    layer.appendChild(figure);
  });
}

function initExtraPhotoToggle() {
  const toggle = document.querySelector("#extra-photo-toggle");
  if (!toggle) return;

  renderExtraPhotos();

  toggle.addEventListener("click", () => {
    const enabled = !document.body.classList.contains("extra-photos-on");
    document.body.classList.toggle("extra-photos-on", enabled);
    toggle.setAttribute("aria-pressed", String(enabled));
  });

  let resizeTimer;
  window.addEventListener(
    "resize",
    () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(renderExtraPhotos, 180);
    },
    { passive: true }
  );
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
  initGlassHighlights();
  initExtraPhotoToggle();
  initHeroModel();
});
