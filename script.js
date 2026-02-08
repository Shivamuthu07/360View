// --- CURSOR ---
const dot = document.getElementById('cursor-dot');
const outline = document.getElementById('cursor-outline');

if (dot && outline) {
    window.addEventListener('mousemove', (e) => {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;

        outline.animate({
            left: `${e.clientX - 15}px`, // Center the 30px div
            top: `${e.clientY - 15}px`
        }, { duration: 500, fill: "forwards" });
    });

    document.querySelectorAll('a, .service-card, .gear-card, .hamburger, .intel-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
            outline.style.transform = 'scale(2)';
            outline.style.borderColor = 'rgba(255,255,255,0.8)';
            dot.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            outline.style.transform = 'scale(1)';
            outline.style.borderColor = 'var(--bright-red)';
            dot.style.opacity = '1';
        });
    });
}

// --- MOBILE MENU ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        hamburger.children[0].style.transform = mobileMenu.classList.contains('active') ? 'rotate(45deg) translate(5px, 5px)' : 'none';
        hamburger.children[1].style.opacity = mobileMenu.classList.contains('active') ? '0' : '1';
        hamburger.children[2].style.transform = mobileMenu.classList.contains('active') ? 'rotate(-45deg) translate(5px, -5px)' : 'none';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.children[0].style.transform = 'none';
            hamburger.children[1].style.opacity = '1';
            hamburger.children[2].style.transform = 'none';
        });
    });
}

// --- SCROLL ANIMATIONS ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// --- THREE.JS BACKGROUND ---
const canvas = document.getElementById('canvas3d');
if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild(renderer.domElement);

    // Particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        // Spread particles in a wide area
        posArray[i] = (Math.random() - 0.5) * 15;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.025, // small dots
        color: 0xff0000, // Red
        transparent: true,
        opacity: 0.8,
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);

    // Connecting Lines
    const geo2 = new THREE.IcosahedronGeometry(3, 1);
    const mat2 = new THREE.MeshBasicMaterial({
        color: 0xaa0000,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const wireframeSphere = new THREE.Mesh(geo2, mat2);
    scene.add(wireframeSphere);

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate entire system
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = mouseY * 0.5;

        wireframeSphere.rotation.x += 0.002;
        wireframeSphere.rotation.y += 0.002;

        // Parallax effect
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
