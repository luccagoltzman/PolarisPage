// Sistema Avançado de Acessibilidade
class AccessibilitySystem {
    constructor() {
        this.preferences = this.loadPreferences();
        this.createAccessibilityMenu();
        this.applyPreferences();
        this.setupKeyboardNavigation();
        this.setupScreenReader();
        this.setupColorBlindness();
        this.setupMotionReduction();
    }
    
    loadPreferences() {
        return JSON.parse(localStorage.getItem('accessibility_preferences')) || {
            fontSize: 'normal',
            contrast: 'normal',
            colorBlind: 'none',
            reduceMotion: false,
            textSpacing: 'normal',
            soundFeedback: false,
            keyboardMode: false
        };
    }
    
    savePreferences() {
        localStorage.setItem('accessibility_preferences', JSON.stringify(this.preferences));
        this.applyPreferences();
    }
    
    createAccessibilityMenu() {
        const menu = document.createElement('div');
        menu.className = 'accessibility-menu';
        menu.setAttribute('role', 'dialog');
        menu.setAttribute('aria-label', 'Menu de Acessibilidade');
        
        menu.innerHTML = `
            <div class="accessibility-content">
                <h2>Configurações de Acessibilidade</h2>
                
                <div class="accessibility-section">
                    <h3>Tamanho do Texto</h3>
                    <div class="font-size-controls">
                        <button class="font-size-btn" data-size="small">A</button>
                        <button class="font-size-btn" data-size="normal">A</button>
                        <button class="font-size-btn" data-size="large">A</button>
                    </div>
                </div>
                
                <div class="accessibility-section">
                    <h3>Contraste</h3>
                    <select id="contrast-select">
                        <option value="normal">Normal</option>
                        <option value="high">Alto Contraste</option>
                        <option value="inverted">Cores Invertidas</option>
                    </select>
                </div>
                
                <div class="accessibility-section">
                    <h3>Daltonismo</h3>
                    <select id="colorblind-select">
                        <option value="none">Nenhum</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                        <option value="tritanopia">Tritanopia</option>
                    </select>
                </div>
                
                <div class="accessibility-section">
                    <label class="toggle-label">
                        <input type="checkbox" id="motion-toggle">
                        Reduzir Movimento
                    </label>
                </div>
                
                <div class="accessibility-section">
                    <label class="toggle-label">
                        <input type="checkbox" id="sound-toggle">
                        Feedback Sonoro
                    </label>
                </div>
                
                <div class="accessibility-section">
                    <label class="toggle-label">
                        <input type="checkbox" id="keyboard-toggle">
                        Modo Teclado
                    </label>
                </div>
                
                <button class="reset-btn">Restaurar Padrões</button>
            </div>
        `;
        
        // Botão de acessibilidade
        const button = document.createElement('button');
        button.className = 'accessibility-button';
        button.innerHTML = '<i class="fas fa-universal-access"></i>';
        button.setAttribute('aria-label', 'Abrir menu de acessibilidade');
        
        document.body.appendChild(button);
        document.body.appendChild(menu);
        
        // Eventos
        button.addEventListener('click', () => this.toggleMenu());
        
        menu.querySelector('.font-size-controls').addEventListener('click', (e) => {
            if (e.target.classList.contains('font-size-btn')) {
                this.preferences.fontSize = e.target.dataset.size;
                this.savePreferences();
            }
        });
        
        menu.querySelector('#contrast-select').addEventListener('change', (e) => {
            this.preferences.contrast = e.target.value;
            this.savePreferences();
        });
        
        menu.querySelector('#colorblind-select').addEventListener('change', (e) => {
            this.preferences.colorBlind = e.target.value;
            this.savePreferences();
        });
        
        menu.querySelector('#motion-toggle').addEventListener('change', (e) => {
            this.preferences.reduceMotion = e.target.checked;
            this.savePreferences();
        });
        
        menu.querySelector('#sound-toggle').addEventListener('change', (e) => {
            this.preferences.soundFeedback = e.target.checked;
            this.savePreferences();
        });
        
        menu.querySelector('#keyboard-toggle').addEventListener('change', (e) => {
            this.preferences.keyboardMode = e.target.checked;
            this.savePreferences();
        });
        
        menu.querySelector('.reset-btn').addEventListener('click', () => {
            this.resetPreferences();
        });
    }
    
    toggleMenu() {
        const menu = document.querySelector('.accessibility-menu');
        const isOpen = menu.classList.toggle('active');
        
        if (isOpen) {
            this.playSound('open');
            menu.querySelector('h2').focus();
        } else {
            this.playSound('close');
        }
    }
    
    applyPreferences() {
        document.body.className = '';
        
        // Tamanho do texto
        document.body.classList.add(`font-size-${this.preferences.fontSize}`);
        
        // Contraste
        document.body.classList.add(`contrast-${this.preferences.contrast}`);
        
        // Daltonismo
        if (this.preferences.colorBlind !== 'none') {
            document.body.classList.add(`colorblind-${this.preferences.colorBlind}`);
        }
        
        // Redução de movimento
        if (this.preferences.reduceMotion) {
            document.body.classList.add('reduce-motion');
        }
        
        // Modo teclado
        if (this.preferences.keyboardMode) {
            document.body.classList.add('keyboard-mode');
        }
        
        // Atualizar controles do menu
        const menu = document.querySelector('.accessibility-menu');
        menu.querySelector(`[data-size="${this.preferences.fontSize}"]`).classList.add('active');
        menu.querySelector('#contrast-select').value = this.preferences.contrast;
        menu.querySelector('#colorblind-select').value = this.preferences.colorBlind;
        menu.querySelector('#motion-toggle').checked = this.preferences.reduceMotion;
        menu.querySelector('#sound-toggle').checked = this.preferences.soundFeedback;
        menu.querySelector('#keyboard-toggle').checked = this.preferences.keyboardMode;
    }
    
    resetPreferences() {
        this.preferences = {
            fontSize: 'normal',
            contrast: 'normal',
            colorBlind: 'none',
            reduceMotion: false,
            textSpacing: 'normal',
            soundFeedback: false,
            keyboardMode: false
        };
        
        this.savePreferences();
        this.playSound('reset');
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (!this.preferences.keyboardMode) return;
            
            const focusable = 'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
            const elements = Array.from(document.querySelectorAll(focusable));
            
            if (e.key === 'Tab') {
                elements.forEach(el => {
                    el.style.outline = '2px solid var(--primary-blue)';
                    el.style.outlineOffset = '2px';
                });
            }
        });
    }
    
    setupScreenReader() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            this.enhanceNodeForScreenReader(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Melhorar elementos existentes
        this.enhanceNodeForScreenReader(document.body);
    }
    
    enhanceNodeForScreenReader(node) {
        // Adicionar descrições ARIA
        const images = node.querySelectorAll('img:not([aria-label])');
        images.forEach(img => {
            if (img.alt) {
                img.setAttribute('aria-label', img.alt);
            }
        });
        
        // Melhorar links
        const links = node.querySelectorAll('a:not([aria-label])');
        links.forEach(link => {
            if (!link.textContent.trim()) {
                const img = link.querySelector('img');
                if (img && img.alt) {
                    link.setAttribute('aria-label', img.alt);
                }
            }
        });
        
        // Melhorar formulários
        const inputs = node.querySelectorAll('input:not([aria-label])');
        inputs.forEach(input => {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-label', label.textContent);
            }
        });
    }
    
    setupColorBlindness() {
        const filters = {
            protanopia: 'url(#protanopia-filter)',
            deuteranopia: 'url(#deuteranopia-filter)',
            tritanopia: 'url(#tritanopia-filter)'
        };
        
        // Adicionar filtros SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.display = 'none';
        svg.innerHTML = `
            <defs>
                <filter id="protanopia-filter">
                    <feColorMatrix
                        in="SourceGraphic"
                        type="matrix"
                        values="0.567, 0.433, 0,     0, 0
                                0.558, 0.442, 0,     0, 0
                                0,     0.242, 0.758, 0, 0
                                0,     0,     0,     1, 0"/>
                </filter>
                <filter id="deuteranopia-filter">
                    <feColorMatrix
                        in="SourceGraphic"
                        type="matrix"
                        values="0.625, 0.375, 0,   0, 0
                                0.7,   0.3,   0,   0, 0
                                0,     0.3,   0.7, 0, 0
                                0,     0,     0,   1, 0"/>
                </filter>
                <filter id="tritanopia-filter">
                    <feColorMatrix
                        in="SourceGraphic"
                        type="matrix"
                        values="0.95, 0.05,  0,     0, 0
                                0,    0.433, 0.567, 0, 0
                                0,    0.475, 0.525, 0, 0
                                0,    0,     0,     1, 0"/>
                </filter>
            </defs>
        `;
        
        document.body.appendChild(svg);
    }
    
    setupMotionReduction() {
        if (this.preferences.reduceMotion) {
            const style = document.createElement('style');
            style.textContent = `
                * {
                    animation-duration: 0.001s !important;
                    transition-duration: 0.001s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    playSound(type) {
        if (!this.preferences.soundFeedback) return;
        
        const sounds = {
            open: 440,    // A4
            close: 330,   // E4
            reset: 523,   // C5
            hover: 587,   // D5
            click: 659    // E5
        };
        
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        
        oscillator.connect(gain);
        gain.connect(context.destination);
        
        oscillator.frequency.value = sounds[type];
        gain.gain.value = 0.1;
        
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.1);
        
        setTimeout(() => {
            oscillator.stop();
            context.close();
        }, 100);
    }
}

// Estilos para o sistema de acessibilidade
const style = document.createElement('style');
style.textContent = `
    .accessibility-button {
        position: fixed;
        bottom: 2rem;
        right: 6rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        border: none;
        color: white;
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: var(--shadow-medium);
        transition: var(--transition);
    }
    
    .accessibility-button:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-heavy);
    }
    
    .accessibility-menu {
        position: fixed;
        top: 0;
        right: -400px;
        width: 400px;
        height: 100vh;
        background: var(--gradient-glass);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-left: var(--border-light);
        z-index: 10000;
        transition: var(--transition);
        padding: 2rem;
        color: var(--white);
        overflow-y: auto;
    }
    
    .accessibility-menu.active {
        right: 0;
        box-shadow: var(--shadow-heavy);
    }
    
    .accessibility-content h2 {
        color: var(--primary-blue);
        margin-bottom: 2rem;
        font-size: 1.5rem;
    }
    
    .accessibility-section {
        margin-bottom: 2rem;
    }
    
    .accessibility-section h3 {
        color: var(--white);
        margin-bottom: 1rem;
        font-size: 1.1rem;
    }
    
    .font-size-controls {
        display: flex;
        gap: 1rem;
    }
    
    .font-size-btn {
        width: 40px;
        height: 40px;
        border-radius: var(--border-radius);
        border: var(--border-light);
        background: transparent;
        color: var(--white);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .font-size-btn[data-size="small"] { font-size: 0.8rem; }
    .font-size-btn[data-size="normal"] { font-size: 1rem; }
    .font-size-btn[data-size="large"] { font-size: 1.2rem; }
    
    .font-size-btn:hover,
    .font-size-btn.active {
        background: var(--gradient-primary);
        border-color: var(--primary-blue);
    }
    
    select {
        width: 100%;
        padding: 0.8rem;
        background: rgba(30, 144, 255, 0.1);
        border: var(--border-light);
        border-radius: var(--border-radius);
        color: var(--white);
        cursor: pointer;
        transition: var(--transition);
    }
    
    select:hover {
        background: rgba(30, 144, 255, 0.2);
        border-color: var(--primary-blue);
    }
    
    .toggle-label {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
    }
    
    .toggle-label input[type="checkbox"] {
        width: 50px;
        height: 26px;
        position: relative;
        appearance: none;
        background: rgba(30, 144, 255, 0.1);
        border-radius: 13px;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .toggle-label input[type="checkbox"]::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 20px;
        height: 20px;
        background: var(--white);
        border-radius: 50%;
        transition: var(--transition);
    }
    
    .toggle-label input[type="checkbox"]:checked {
        background: var(--gradient-primary);
    }
    
    .toggle-label input[type="checkbox"]:checked::before {
        left: 27px;
    }
    
    .reset-btn {
        width: 100%;
        padding: 1rem;
        background: transparent;
        border: 1px solid var(--primary-blue);
        border-radius: var(--border-radius);
        color: var(--primary-blue);
        cursor: pointer;
        transition: var(--transition);
        margin-top: 2rem;
    }
    
    .reset-btn:hover {
        background: var(--primary-blue);
        color: var(--white);
    }
    
    /* Classes de acessibilidade */
    .font-size-small {
        font-size: 14px;
    }
    
    .font-size-normal {
        font-size: 16px;
    }
    
    .font-size-large {
        font-size: 18px;
    }
    
    .contrast-high {
        filter: contrast(1.5);
    }
    
    .contrast-inverted {
        filter: invert(1);
    }
    
    .colorblind-protanopia {
        filter: url(#protanopia-filter);
    }
    
    .colorblind-deuteranopia {
        filter: url(#deuteranopia-filter);
    }
    
    .colorblind-tritanopia {
        filter: url(#tritanopia-filter);
    }
    
    .keyboard-mode *:focus {
        outline: 2px solid var(--primary-blue) !important;
        outline-offset: 2px !important;
    }
    
    @media (max-width: 768px) {
        .accessibility-menu {
            width: 100%;
            right: -100%;
        }
        
        .accessibility-button {
            bottom: 1rem;
            right: 1rem;
        }
    }
`;

document.head.appendChild(style);

// Inicializar sistema de acessibilidade quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new AccessibilitySystem();
});
