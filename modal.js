// Sistema de Modal Premium
class PremiumModal {
    constructor() {
        this.setupStyles();
    }
    
    show(productName, productPrice) {
        const modal = document.createElement('div');
        modal.className = 'premium-modal';
        
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-container">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title">
                                <h2>${productName}</h2>
                                <p>Solução Premium para seu Negócio</p>
                            </div>
                            <button class="modal-close" aria-label="Fechar modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div class="modal-body">
                            <div class="product-features">
                                <h4>Recursos Inclusos</h4>
                                <ul class="features-list">
                                    <li>
                                        <i class="fas fa-check-circle"></i>
                                        <span>Acesso Completo ao Sistema</span>
                                    </li>
                                    <li>
                                        <i class="fas fa-check-circle"></i>
                                        <span>Suporte 24/7 Prioritário</span>
                                    </li>
                                    <li>
                                        <i class="fas fa-check-circle"></i>
                                        <span>Atualizações Automáticas</span>
                                    </li>
                                    <li>
                                        <i class="fas fa-check-circle"></i>
                                        <span>Treinamento Personalizado</span>
                                    </li>
                                    <li>
                                        <i class="fas fa-check-circle"></i>
                                        <span>Backup em Nuvem</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="modal-footer">
                            <div class="guarantee">
                                <i class="fas fa-shield-alt"></i>
                                <span>30 dias de garantia incondicional</span>
                            </div>
                            <button class="btn-primary cta-button">
                                <i class="fab fa-whatsapp"></i>
                                Falar com Especialista
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animação de entrada
        requestAnimationFrame(() => {
            modal.classList.add('active');
            modal.querySelector('.modal-container').classList.add('active');
        });
        
        // Eventos
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        const ctaButton = modal.querySelector('.cta-button');
        
        const close = () => {
            modal.classList.remove('active');
            modal.querySelector('.modal-container').classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };
        
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        
        ctaButton.addEventListener('click', () => {
            window.open(`https://wa.me/558898020419?text=Olá! Gostaria de saber mais sobre ${productName}`, '_blank');
        });
        
        // Efeito de luz nos botões
        const options = modal.querySelectorAll('.contact-option');
        options.forEach(option => {
            option.addEventListener('mousemove', (e) => {
                const rect = option.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                option.style.setProperty('--mouse-x', `${x}px`);
                option.style.setProperty('--mouse-y', `${y}px`);
            });
        });
        
        // Fechar com Esc
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                close();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        
        document.addEventListener('keydown', handleEscape);
    }
    
    setupStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .premium-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .premium-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 31, 68, 0.95);
                backdrop-filter: blur(20px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .modal-container {
                background: var(--gradient-glass);
                border-radius: var(--border-radius-xl);
                border: var(--border-light);
                max-width: 800px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
                transform: scale(0.8) translateY(30px);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            .modal-container.active {
                transform: scale(1) translateY(0);
                opacity: 1;
            }
            
            .modal-content {
                position: relative;
                z-index: 1;
            }
            
            .modal-header {
                padding: 2rem;
                border-bottom: var(--border-light);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, rgba(30, 144, 255, 0.1), transparent);
            }
            
            .modal-title h2 {
                color: var(--white);
                font-size: 1.8rem;
                margin-bottom: 0.5rem;
            }
            
            .modal-title p {
                color: var(--primary-blue);
                font-size: 1rem;
                opacity: 0.9;
            }
            
            .modal-close {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: rgba(30, 144, 255, 0.1);
                border: var(--border-light);
                color: var(--white);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: var(--transition);
            }
            
            .modal-close:hover {
                background: rgba(30, 144, 255, 0.2);
                transform: rotate(90deg);
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .product-features h4 {
                color: var(--white);
                font-size: 1.2rem;
                margin-bottom: 1.5rem;
            }
            
            .features-list {
                display: grid;
                gap: 1rem;
            }
            
            .features-list li {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(30, 144, 255, 0.05);
                border-radius: var(--border-radius);
                border: var(--border-light);
                transition: var(--transition);
            }
            
            .features-list li:hover {
                background: rgba(30, 144, 255, 0.1);
                transform: translateX(10px);
            }
            
            .features-list i {
                color: var(--primary-blue);
                font-size: 1.2rem;
            }
            
            
            .modal-footer {
                padding: 2rem;
                border-top: var(--border-light);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: linear-gradient(135deg, rgba(30, 144, 255, 0.05), transparent);
            }
            
            .guarantee {
                display: flex;
                align-items: center;
                gap: 1rem;
                color: var(--white);
                opacity: 0.8;
            }
            
            .guarantee i {
                color: var(--primary-blue);
            }
            
            .cta-button {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                padding: 1rem 2rem;
                font-size: 1.1rem;
                border-radius: var(--border-radius);
                background: var(--gradient-primary);
                color: var(--white);
                border: none;
                cursor: pointer;
                transition: var(--transition);
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-glow);
            }
            
            @media (max-width: 768px) {
                .modal-overlay {
                    padding: 1rem;
                }
                
                .modal-container {
                    max-height: 95vh;
                }
                
                .modal-header {
                    padding: 1.5rem;
                }
                
                .modal-title h2 {
                    font-size: 1.5rem;
                }
                
                .modal-footer {
                    flex-direction: column;
                    gap: 1rem;
                    text-align: center;
                }
                
                .cta-button {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Inicializar sistema de modal
document.addEventListener('DOMContentLoaded', () => {
    window.premiumModal = new PremiumModal();
});
