// Inicialização do Three.js
let scene, camera, renderer, controls;
let geometry, material, mesh;
let clock = new THREE.Clock();
let composer;

// Shaders
const vertexShader = document.getElementById('vertexShader').textContent;
const fragmentShader = document.getElementById('fragmentShader').textContent;

// Configuração do Three.js
function initThree() {
    // Cena
    scene = new THREE.Scene();
    
    // Câmera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('bgCanvas'),
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    
    // Material com shader personalizado
    material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color: { value: new THREE.Color(0x1E90FF) }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true
    });
    
    // Geometria
    geometry = new THREE.IcosahedronGeometry(2, 4);
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Pós-processamento
    composer = new THREE.EffectComposer(renderer);
    const renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // Intensidade
        0.4, // Raio
        0.85 // Threshold
    );
    composer.addPass(bloomPass);
}

// Animação
function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();
    
    // Rotação suave
    mesh.rotation.x = Math.sin(time * 0.5) * 0.3;
    mesh.rotation.y = Math.cos(time * 0.3) * 0.2;
    
    // Atualizar uniforms do shader
    material.uniforms.time.value = time;
    
    controls.update();
    composer.render();
}

// Rastreamento de movimento com TensorFlow.js
let model, video, motionCanvas, motionCtx;
let isTracking = false;

async function initMotionTracking() {
    try {
        // Carregar modelo
        model = await faceLandmarksDetection.load(
            faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
        );
        
        // Configurar vídeo
        video = document.getElementById('motionVideo');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
        
        // Configurar canvas
        motionCanvas = document.getElementById('motionCanvas');
        motionCtx = motionCanvas.getContext('2d');
        
        isTracking = true;
        trackMotion();
        
    } catch (error) {
        console.log('Erro ao iniciar rastreamento:', error);
    }
}

async function trackMotion() {
    if (!isTracking) return;
    
    const faces = await model.estimateFaces({
        input: video,
        returnTensors: false,
        flipHorizontal: false
    });
    
    if (faces.length > 0) {
        const face = faces[0];
        
        // Calcular centro do rosto
        const centerX = face.boundingBox.topLeft[0] + face.boundingBox.bottomRight[0] / 2;
        const centerY = face.boundingBox.topLeft[1] + face.boundingBox.bottomRight[1] / 2;
        
        // Atualizar posição da câmera 3D
        const offsetX = (centerX / video.width - 0.5) * 2;
        const offsetY = (centerY / video.height - 0.5) * 2;
        
        gsap.to(camera.position, {
            x: offsetX * 2,
            y: -offsetY * 2,
            duration: 1,
            ease: "power2.out"
        });
    }
    
    requestAnimationFrame(trackMotion);
}

// Sistema de partículas interativas
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.querySelector('.hero-particles');
        this.mouseX = 0;
        this.mouseY = 0;
        
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 20 + 10;
            const startX = Math.random() * window.innerWidth;
            const startY = Math.random() * window.innerHeight;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${startX}px`;
            particle.style.top = `${startY}px`;
            
            particle.style.setProperty('--float-duration', `${Math.random() * 3 + 2}s`);
            particle.style.setProperty('--particle-opacity', `${Math.random() * 0.3 + 0.1}`);
            particle.style.setProperty('--particle-opacity-peak', `${Math.random() * 0.4 + 0.3}`);
            
            this.container.appendChild(particle);
            this.particles.push({
                element: particle,
                x: startX,
                y: startY,
                size: size,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
    }
    
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    animate() {
        this.particles.forEach(particle => {
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 200) {
                const angle = Math.atan2(dy, dx);
                const force = (200 - distance) / 200;
                
                particle.speedX += Math.cos(angle) * force * 0.2;
                particle.speedY += Math.sin(angle) * force * 0.2;
            }
            
            particle.speedX *= 0.95;
            particle.speedY *= 0.95;
            
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Manter partículas dentro da tela
            if (particle.x < 0) particle.x = window.innerWidth;
            if (particle.x > window.innerWidth) particle.x = 0;
            if (particle.y < 0) particle.y = window.innerHeight;
            if (particle.y > window.innerHeight) particle.y = 0;
            
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initThree();
    animate();
    initMotionTracking();
    new ParticleSystem();
    
    // Configurar ScrollTrigger e SplitText
    gsap.registerPlugin(ScrollTrigger);
    
    // Dividir texto para animação
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(text => {
        const chars = text.textContent.split('');
        text.textContent = '';
        chars.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.display = 'inline-block';
            text.appendChild(span);
        });
        
        gsap.from(text.children, {
            scrollTrigger: {
                trigger: text,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
                markers: false
            },
            opacity: 0,
            y: 20,
            rotationX: 30,
            stagger: 0.02,
            ease: "power2.out"
        });
    });
    
    // Efeito de paralaxe nas camadas
    const parallaxLayers = document.querySelectorAll('.parallax-layer');
    parallaxLayers.forEach(layer => {
        const speed = layer.getAttribute('data-speed');
        gsap.to(layer, {
            scrollTrigger: {
                trigger: layer.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
            ease: 'none'
        });
    });
    
    // Revelar elementos no scroll
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleClass: 'visible',
                once: true
            }
        });
    });
    
    // Fade up elements
    const fadeUpElements = document.querySelectorAll('.fade-up');
    fadeUpElements.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleClass: 'visible',
                once: true
            }
        });
    });
    
    // Animação de entrada da seção hero
    gsap.from('.hero-content', {
        duration: 2,
        y: 100,
        opacity: 0,
        ease: "power4.out",
        scrollTrigger: {
            trigger: '.hero',
            start: 'top center',
            end: 'bottom center',
            scrub: 1
        }
    });
    
    // Animações para cards de serviço
    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'center center',
                scrub: 1
            },
            y: 100,
            opacity: 0,
            rotation: 5,
            scale: 0.8,
            duration: 1,
            ease: "power2.out",
            delay: i * 0.2
        });
    });
});

// Redimensionamento
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
