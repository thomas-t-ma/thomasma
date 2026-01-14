import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.155/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.155/examples/jsm/loaders/GLTFLoader.js";

  /* ===============================
     Typed.js (Hero Section)
  =============================== */
  new Typed("#typed-text", {
    strings: [
      "cancer diagnosis models",
      "machine learning",
      "deep learning",
      "computer vision",
    ],
    typeSpeed: 60,
    backSpeed: 40,
    backDelay: 1500,
    loop: true,
    cursorChar: "▍",
  });

  /* ===============================
     3D PROJECT CARD PREVIEW
     (Reusable helper)
  =============================== */
function initInteractive3DPreview(containerId, modelPath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  /* ---------------- Scene ---------------- */
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 3);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.physicallyCorrectLights = true;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
  scene.add(hemi);
  
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* ---------------- Lights ---------------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 5, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
  rimLight.position.set(-5, 3, -5);
  scene.add(rimLight);

  /* ---------------- Load GLB ---------------- */
  const loader = new THREE.GLTFLoader();
  let model;

  loader.load(
    modelPath,
    (gltf) => {
      model = gltf.scene;

      /* Auto-scale + center */
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      model.position.sub(center);
      model.scale.setScalar(1.6 / size);

      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("GLB load error:", error);
    }
  );

  /* ---------------- Interaction ---------------- */
  let isDragging = false;
  let prevX = 0;
  let prevY = 0;

  container.style.cursor = "grab";

  container.addEventListener("pointerdown", (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    container.setPointerCapture(e.pointerId);
    container.style.cursor = "grabbing";
  });

  container.addEventListener("pointermove", (e) => {
    if (!isDragging || !model) return;
    const dx = e.clientX - prevX;
    const dy = e.clientY - prevY;
    model.rotation.y += dx * 0.01;
    model.rotation.x += dy * 0.01;
    prevX = e.clientX;
    prevY = e.clientY;
  });

  container.addEventListener("pointerup", () => {
    isDragging = false;
    container.style.cursor = "grab";
  });

  /* ---------------- Resize ---------------- */
  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  /* ---------------- Animate ---------------- */
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

  /* ===============================
     Init Project 3D Card
  =============================== */
  initInteractive3DPreview("project-3d-preview", "assets/models/esc_emory.glb");
