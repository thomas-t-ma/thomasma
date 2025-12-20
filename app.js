document.addEventListener("DOMContentLoaded", () => {
    // Typed.js
    new Typed("#typed-text", {
      strings: [
        "cancer diagnosis models",
        "machine learning",
        "deep learning",
        "computer vision"
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      cursorChar: "▍"
    });
  
    // Three.js (placeholder scene)
    const container = document.getElementById("three-container");
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
  
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
  
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x8b5cf6 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
  
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(10, 10, 10);
    scene.add(light);
  
    camera.position.z = 3;
  
    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
  
    animate();
  });
  