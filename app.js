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
  "assets/web/extras/FullSizeRender.webp",
  "assets/web/extras/IMG_3870.webp",
  "assets/web/extras/IMG_3872.webp",
  "assets/web/extras/IMG_3886.webp",
  "assets/web/extras/IMG_3889.webp",
  "assets/web/extras/IMG_8915.webp",
  "assets/web/extras/7R6A1764.webp",
  "assets/web/extras/7R6A1767.webp",
  "assets/web/extras/7R6A1775.webp",
  "assets/web/extras/7R6A1875.webp",
  "assets/web/extras/7R6A1915.webp",
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
  poster: "assets/web/woodruff-circle.webp",
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
      image.fetchPriority = "low";
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
   Single-row media rails.
   Trackpad/touch work natively; desktop also supports edge chevrons,
   keyboard arrows, and click-drag scrolling.
--------------------------------------------------------- */
function initCardCarousels() {
  document.querySelectorAll("[data-card-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    if (!track || !previous || !next) return;

    const getStep = () => {
      const firstCard = track.firstElementChild;
      if (!firstCard) return Math.max(300, track.clientWidth * 0.8);
      const styles = getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "20") || 20;
      return firstCard.getBoundingClientRect().width + gap;
    };

    const updateControls = () => {
      const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
      // A modest edge tolerance prevents controls from lingering because of
      // sub-pixel scroll positions or smooth-scroll settling near either end.
      const edgeTolerance = 18;
      const canLeft = track.scrollLeft > edgeTolerance;
      const canRight = track.scrollLeft < maxScroll - edgeTolerance;
      previous.disabled = !canLeft;
      next.disabled = !canRight;
    };

    previous.addEventListener("click", () => {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });
    next.addEventListener("click", () => {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    track.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      track.scrollBy({
        left: event.key === "ArrowLeft" ? -getStep() : getStep(),
        behavior: "smooth",
      });
    });

    let pointerId = null;
    let startX = 0;
    let startScroll = 0;
    let dragged = false;
    let suppressNextClick = false;

    track.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("a, button")) return;
      pointerId = event.pointerId;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      dragged = false;
      track.setPointerCapture?.(pointerId);
    });

    track.addEventListener("pointermove", (event) => {
      if (pointerId !== event.pointerId) return;
      const distance = event.clientX - startX;
      if (!dragged && Math.abs(distance) < 5) return;
      dragged = true;
      track.classList.add("is-dragging");
      track.scrollLeft = startScroll - distance;
    });

    const endDrag = (event) => {
      if (pointerId !== event.pointerId) return;
      if (dragged) suppressNextClick = true;
      track.classList.remove("is-dragging");
      try { track.releasePointerCapture?.(pointerId); } catch (_) {}
      pointerId = null;
      dragged = false;
      requestAnimationFrame(updateControls);
    };

    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);
    track.addEventListener("click", (event) => {
      if (!suppressNextClick) return;
      event.preventDefault();
      event.stopPropagation();
      suppressNextClick = false;
    }, true);

    track.addEventListener("scroll", updateControls, { passive: true });
    window.addEventListener("resize", updateControls, { passive: true });
    requestAnimationFrame(updateControls);
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

  // Load automatically on page initialization. The poster remains visible
  // while the viewer library/model are loading.
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
      viewer.setAttribute("loading", "eager");
      stage.replaceChildren(viewer);
    })
    .catch((error) => {
      console.error(error);
      const placeholder = stage.querySelector(".hero-model-placeholder");
      if (placeholder) {
        const label = placeholder.querySelector("span");
        const status = placeholder.querySelector("strong");
        if (label) label.textContent = "Interactive 3D";
        if (status) status.textContent = "Could not load";
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.querySelector("#current-year");
  if (year) year.textContent = new Date().getFullYear();

  initNavigation();
  initTypedText();
  initRevealAnimations();
  initExtraHobbyPhotos();
  initCardCarousels();
  initGlassHighlights();
  initHeroModel();
});
