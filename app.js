document.addEventListener("DOMContentLoaded", () => {

    // ===== TYPED.JS =====
    new Typed("#typed-text", {
      strings: [
        "full-stack apps",
        "machine learning models",
        "3D web experiences",
        "research software"
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      smartBackspace: true,
      showCursor: true,
      cursorChar: "|"
    });
  
    // ===== THREE.JS =====
    const container = document.getElementById("three-container");
    if (!container) return; // <-- prevents crash
  
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
  
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);
  
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
  
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
  
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xff0051 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  });
  