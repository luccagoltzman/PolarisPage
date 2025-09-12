// Sistema de Otimização de Performance
class PerformanceOptimizer {
    constructor() {
        this.metrics = {
            fps: 0,
            memory: {},
            loadTime: 0,
            resourcesSize: 0
        };
        
        this.thresholds = {
            fps: 30,
            memory: 0.8, // 80% do limite
            loadTime: 3000, // 3 segundos
            resourcesSize: 5 * 1024 * 1024 // 5MB
        };
        
        this.optimizations = {
            reduceParticles: false,
            disableEffects: false,
            reduceQuality: false,
            useProgressive: false
        };
        
        this.initialize();
    }
    
    initialize() {
        this.setupMetricsMonitoring();
        this.setupResourceOptimization();
        this.setupDynamicLoading();
        this.setupPerformanceUI();
        
        // Monitorar performance continuamente
        this.monitor();
    }
    
    setupMetricsMonitoring() {
        // FPS Monitoring
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            const now = performance.now();
            const delta = now - lastTime;
            
            if (delta >= 1000) {
                this.metrics.fps = Math.round((frameCount * 1000) / delta);
                frameCount = 0;
                lastTime = now;
                
                this.updateOptimizations();
            }
            
            frameCount++;
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
        
        // Memory Monitoring (Chrome only)
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                this.metrics.memory = {
                    used: window.performance.memory.usedJSHeapSize,
                    total: window.performance.memory.jsHeapSizeLimit
                };
            }, 1000);
        }
        
        // Load Time
        window.addEventListener('load', () => {
            this.metrics.loadTime = performance.now();
            
            // Calcular tamanho total dos recursos
            const resources = performance.getEntriesByType('resource');
            this.metrics.resourcesSize = resources.reduce((total, resource) => {
                return total + (resource.encodedBodySize || 0);
            }, 0);
        });
    }
    
    setupResourceOptimization() {
        // Lazy Loading de Imagens
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImageProgressively(img);
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
        
        // Otimização de Vídeos
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.addEventListener('canplay', () => {
                if (this.optimizations.reduceQuality) {
                    video.setAttribute('playsinline', '');
                    video.setAttribute('preload', 'none');
                }
            });
        });
    }
    
    loadImageProgressively(img) {
        if (!this.optimizations.useProgressive) {
            img.src = img.dataset.src;
            return;
        }
        
        // Carregar versão de baixa qualidade primeiro
        const lowQualitySrc = img.dataset.lowSrc || this.generateLowQualityUrl(img.dataset.src);
        
        const lowQualityImg = new Image();
        lowQualityImg.src = lowQualitySrc;
        lowQualityImg.onload = () => {
            img.src = lowQualitySrc;
            img.style.filter = 'blur(10px)';
            
            // Carregar versão de alta qualidade
            const highQualityImg = new Image();
            highQualityImg.src = img.dataset.src;
            highQualityImg.onload = () => {
                img.src = img.dataset.src;
                img.style.filter = 'none';
                img.style.transition = 'filter 0.3s ease-out';
            };
        };
    }
    
    generateLowQualityUrl(url) {
        // Simular URL de baixa qualidade (na prática, você teria um serviço de imagem)
        return url.replace(/\.(jpg|png)$/, '-low.$1');
    }
    
    setupDynamicLoading() {
        // Code Splitting
        const sections = document.querySelectorAll('section[data-module]');
        const moduleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const module = entry.target.dataset.module;
                    this.loadModule(module);
                    moduleObserver.unobserve(entry.target);
                }
            });
        });
        
        sections.forEach(section => moduleObserver.observe(section));
    }
    
    async loadModule(module) {
        try {
            await import(`./modules/${module}.js`);
        } catch (error) {
            console.warn(`Erro ao carregar módulo ${module}:`, error);
        }
    }
    
    setupPerformanceUI() {
        const ui = document.createElement('div');
        ui.className = 'performance-monitor';
        ui.innerHTML = `
            <div class="performance-toggle">
                <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="performance-panel">
                <h3>Monitor de Performance</h3>
                <div class="metrics">
                    <div class="metric">
                        <label>FPS</label>
                        <span class="fps-value">60</span>
                    </div>
                    <div class="metric">
                        <label>Memória</label>
                        <span class="memory-value">0 MB</span>
                    </div>
                    <div class="metric">
                        <label>Tempo de Carregamento</label>
                        <span class="load-time-value">0ms</span>
                    </div>
                </div>
                <div class="optimizations">
                    <h4>Otimizações Ativas</h4>
                    <ul class="optimization-list"></ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(ui);
        
        const toggle = ui.querySelector('.performance-toggle');
        const panel = ui.querySelector('.performance-panel');
        
        toggle.addEventListener('click', () => {
            panel.classList.toggle('active');
        });
    }
    
    updateOptimizations() {
        // Ajustar otimizações com base nas métricas
        if (this.metrics.fps < this.thresholds.fps) {
            this.optimizations.reduceParticles = true;
            this.optimizations.disableEffects = true;
        } else {
            this.optimizations.reduceParticles = false;
            this.optimizations.disableEffects = false;
        }
        
        if (this.metrics.memory.used / this.metrics.memory.total > this.thresholds.memory) {
            this.optimizations.reduceQuality = true;
        }
        
        if (this.metrics.loadTime > this.thresholds.loadTime) {
            this.optimizations.useProgressive = true;
        }
        
        this.applyOptimizations();
        this.updateUI();
    }
    
    applyOptimizations() {
        // Reduzir partículas
        if (this.optimizations.reduceParticles) {
            const particles = document.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                if (index % 2 === 0) {
                    particle.style.display = 'none';
                }
            });
        }
        
        // Desabilitar efeitos
        if (this.optimizations.disableEffects) {
            document.body.classList.add('reduce-effects');
        } else {
            document.body.classList.remove('reduce-effects');
        }
        
        // Reduzir qualidade
        if (this.optimizations.reduceQuality) {
            document.body.classList.add('reduce-quality');
        } else {
            document.body.classList.remove('reduce-quality');
        }
    }
    
    updateUI() {
        const ui = document.querySelector('.performance-monitor');
        if (!ui) return;
        
        ui.querySelector('.fps-value').textContent = this.metrics.fps;
        
        if (this.metrics.memory.used) {
            const usedMB = Math.round(this.metrics.memory.used / (1024 * 1024));
            ui.querySelector('.memory-value').textContent = `${usedMB} MB`;
        }
        
        ui.querySelector('.load-time-value').textContent = `${Math.round(this.metrics.loadTime)}ms`;
        
        const optimizationList = ui.querySelector('.optimization-list');
        optimizationList.innerHTML = '';
        
        Object.entries(this.optimizations).forEach(([key, value]) => {
            if (value) {
                const li = document.createElement('li');
                li.textContent = this.formatOptimizationName(key);
                optimizationList.appendChild(li);
            }
        });
    }
    
    formatOptimizationName(key) {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    
    monitor() {
        setInterval(() => {
            this.updateOptimizations();
        }, 1000);
    }
}

// Estilos para o monitor de performance
const style = document.createElement('style');
style.textContent = `
    .performance-monitor {
        position: fixed;
        bottom: 2rem;
        left: 6rem;
        z-index: 10000;
    }
    
    .performance-toggle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: var(--shadow-medium);
        transition: var(--transition);
    }
    
    .performance-toggle:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-heavy);
    }
    
    .performance-panel {
        position: absolute;
        bottom: 60px;
        left: 0;
        width: 300px;
        background: var(--gradient-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: var(--border-light);
        border-radius: var(--border-radius-lg);
        padding: 1.5rem;
        transform: translateY(20px);
        opacity: 0;
        visibility: hidden;
        transition: var(--transition);
    }
    
    .performance-panel.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
    }
    
    .performance-panel h3 {
        color: var(--primary-blue);
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
    
    .metrics {
        display: grid;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .metric {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem;
        background: rgba(30, 144, 255, 0.1);
        border-radius: var(--border-radius);
    }
    
    .metric label {
        color: var(--white);
        opacity: 0.8;
    }
    
    .metric span {
        color: var(--primary-blue);
        font-weight: 600;
    }
    
    .optimizations h4 {
        color: var(--white);
        margin-bottom: 0.5rem;
        font-size: 1rem;
    }
    
    .optimization-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .optimization-list li {
        color: var(--white);
        opacity: 0.8;
        padding: 0.3rem 0;
        font-size: 0.9rem;
    }
    
    .optimization-list li::before {
        content: '•';
        color: var(--primary-blue);
        margin-right: 0.5rem;
    }
    
    /* Classes de otimização */
    .reduce-effects {
        --transition: none !important;
    }
    
    .reduce-effects * {
        animation: none !important;
        transition: none !important;
    }
    
    .reduce-quality img {
        image-rendering: optimizeSpeed;
    }
    
    .reduce-quality video {
        filter: none !important;
    }
    
    @media (max-width: 768px) {
        .performance-monitor {
            bottom: 1rem;
            left: 1rem;
        }
        
        .performance-panel {
            width: calc(100vw - 2rem);
            left: 50%;
            transform: translate(-50%, 20px);
        }
        
        .performance-panel.active {
            transform: translate(-50%, 0);
        }
    }
`;

document.head.appendChild(style);

// Inicializar otimizador de performance quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});
