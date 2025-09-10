// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollEffects();
    initAnimations();
    initParallax();
    initFormHandling();
    initProductInteractions();
    initVideoHandling();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Smooth scrolling for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 31, 68, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 31, 68, 0.95)';
        }
    });
}

// Scroll effects and animations
function initScrollEffects() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                
                // Add specific animations based on element
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s`;
                }
                
                if (entry.target.classList.contains('product-card')) {
                    entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.15}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .product-card, .about-text, .about-image, .contact-info, .contact-form');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Initialize animations
function initAnimations() {
    // Typing effect for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalHTML = heroTitle.innerHTML;
        heroTitle.innerHTML = '';
        
        // Parse the HTML to preserve span tags
        const parser = new DOMParser();
        const doc = parser.parseFromString(originalHTML, 'text/html');
        const textNodes = [];
        
        function extractTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                textNodes.push({ type: 'text', content: node.textContent });
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'SPAN' && node.classList.contains('gradient-text')) {
                    textNodes.push({ type: 'span', content: node.textContent });
                } else {
                    for (let child of node.childNodes) {
                        extractTextNodes(child);
                    }
                }
            }
        }
        
        extractTextNodes(doc.body);
        
        let currentIndex = 0;
        const typeWriter = () => {
            if (currentIndex < textNodes.length) {
                const node = textNodes[currentIndex];
                if (node.type === 'text') {
                    heroTitle.innerHTML += node.content;
                } else if (node.type === 'span') {
                    heroTitle.innerHTML += `<span class="gradient-text">${node.content}</span>`;
                }
                currentIndex++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 2000);
    }

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-item h4');
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + '+';
        }, 20);
    };

    // Observe stats section
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = entry.target.querySelectorAll('.stat-item h4');
                statItems.forEach(item => {
                    const target = parseInt(item.textContent);
                    animateCounter(item, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
}

// Parallax effects
function initParallax() {
    // Parallax for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && heroContent) {
            const rate = scrolled * -0.5;
            heroContent.style.transform = `translateY(${rate}px)`;
        }

        // Parallax for about image
        const aboutImage = document.querySelector('.about-image');
        if (aboutImage) {
            const rect = aboutImage.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                const rate = (window.innerHeight - rect.top) * 0.1;
                aboutImage.style.transform = `translateY(${rate}px)`;
            }
        }
    });

    // Mouse parallax effect
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        // Apply subtle parallax to service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            const speed = (index + 1) * 0.02;
            const x = (mouseX - 0.5) * speed * 100;
            const y = (mouseY - 0.5) * speed * 100;
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Por favor, preencha todos os campos.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            this.reset();
        });
    }
}

// Product interactions
function initProductInteractions() {
    const productButtons = document.querySelectorAll('.btn-product');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Show purchase modal or redirect
            showPurchaseModal(productName, productPrice);
        });
    });
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function showPurchaseModal(productName, productPrice) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="modal-title">
                        <h3>Comprar ${productName}</h3>
                        <p>Finalize sua compra de forma rápida e segura</p>
                    </div>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="product-summary">
                        <div class="product-info">
                            <h4>${productName}</h4>
                            <p>Software profissional para impulsionar seu negócio</p>
                        </div>
                        <div class="product-price-modal">
                            <span class="price">${productPrice}</span>
                            <span class="period">/mês</span>
                        </div>
                    </div>
                    
                    <div class="purchase-options">
                        <h5>Escolha como deseja prosseguir:</h5>
                        <div class="option-cards">
                            <div class="option-card">
                                <div class="option-icon">
                                    <i class="fab fa-whatsapp"></i>
                                </div>
                                <div class="option-content">
                                    <h6>WhatsApp</h6>
                                    <p>Fale diretamente conosco</p>
                                </div>
                                <a href="https://wa.me/558898020419?text=Olá! Gostaria de comprar o ${productName}" class="option-btn" target="_blank">
                                    <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                            
                            <div class="option-card">
                                <div class="option-icon">
                                    <i class="fas fa-phone"></i>
                                </div>
                                <div class="option-content">
                                    <h6>Telefone</h6>
                                    <p>Ligue agora mesmo</p>
                                </div>
                                <a href="tel:+558898020419" class="option-btn">
                                    <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                            
                            <div class="option-card">
                                <div class="option-icon">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div class="option-content">
                                    <h6>Email</h6>
                                    <p>Envie sua solicitação</p>
                                </div>
                                <a href="mailto:contato@polarissoftware.com?subject=Interesse em comprar ${productName}" class="option-btn">
                                    <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-features">
                        <h5>O que você recebe:</h5>
                        <ul class="features-list">
                            <li><i class="fas fa-check"></i> Acesso imediato ao software</li>
                            <li><i class="fas fa-check"></i> Suporte técnico especializado</li>
                            <li><i class="fas fa-check"></i> Atualizações gratuitas</li>
                            <li><i class="fas fa-check"></i> Treinamento completo</li>
                            <li><i class="fas fa-check"></i> Garantia de 30 dias</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-close">
                        <i class="fas fa-times"></i>
                        Fechar
                    </button>
                    <button class="btn-primary" onclick="window.open('https://wa.me/558898020419?text=Olá! Gostaria de comprar o ${productName}', '_blank')">
                        <i class="fab fa-whatsapp"></i>
                        Comprar Agora
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .purchase-modal {
            font-family: 'Inter', sans-serif;
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
        
        .modal-content {
            background: linear-gradient(135deg, #0A1F44, #1a2a5a);
            border-radius: 20px;
            border: 1px solid rgba(30, 144, 255, 0.3);
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            z-index: 1;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
            transform: scale(0.9) translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            margin: 1rem;
        }
        
        .modal-content.show {
            transform: scale(1) translateY(0);
        }
        
        .modal-header {
            display: flex;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(30, 144, 255, 0.2);
            background: linear-gradient(135deg, rgba(30, 144, 255, 0.1), transparent);
        }
        
        .modal-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #1E90FF, #00BFFF);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            font-size: 1.2rem;
            color: white;
            box-shadow: 0 8px 25px rgba(30, 144, 255, 0.3);
            flex-shrink: 0;
        }
        
        .modal-title h3 {
            color: #1E90FF;
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
            font-weight: 700;
            line-height: 1.2;
        }
        
        .modal-title p {
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            font-size: 0.85rem;
            line-height: 1.3;
        }
        
        .modal-close {
            background: rgba(30, 144, 255, 0.1);
            border: 1px solid rgba(30, 144, 255, 0.3);
            color: #1E90FF;
            font-size: 1rem;
            cursor: pointer;
            padding: 0.75rem;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            margin-left: auto;
        }
        
        .modal-close:hover {
            background: rgba(30, 144, 255, 0.2);
            transform: scale(1.1);
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .product-summary {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: rgba(30, 144, 255, 0.05);
            padding: 1.2rem;
            border-radius: 12px;
            border: 1px solid rgba(30, 144, 255, 0.1);
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .product-info h4 {
            color: #1E90FF;
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
        }
        
        .product-info p {
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            font-size: 0.85rem;
            line-height: 1.3;
        }
        
        .product-price-modal {
            text-align: right;
        }
        
        .product-price-modal .price {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1E90FF;
        }
        
        .product-price-modal .period {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.85rem;
            margin-left: 0.5rem;
        }
        
        .purchase-options h5 {
            color: #1E90FF;
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
        }
        
        .option-cards {
            display: grid;
            grid-template-columns: 1fr;
            gap: 0.8rem;
            margin-bottom: 1.5rem;
        }
        
        .option-card {
            background: rgba(30, 144, 255, 0.05);
            border: 1px solid rgba(30, 144, 255, 0.1);
            border-radius: 12px;
            padding: 1.2rem;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            transition: all 0.3s ease;
            cursor: pointer;
            min-height: 60px;
        }
        
        .option-card:hover {
            background: rgba(30, 144, 255, 0.1);
            border-color: #1E90FF;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(30, 144, 255, 0.2);
        }
        
        .option-icon {
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #1E90FF, #00BFFF);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            color: white;
            flex-shrink: 0;
        }
        
        .option-content {
            flex: 1;
        }
        
        .option-content h6 {
            color: #1E90FF;
            margin: 0 0 0.25rem 0;
            font-size: 0.95rem;
            font-weight: 600;
        }
        
        .option-content p {
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            font-size: 0.75rem;
            line-height: 1.2;
        }
        
        .option-btn {
            color: #1E90FF;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .option-card:hover .option-btn {
            transform: translateX(5px);
        }
        
        .modal-features h5 {
            color: #1E90FF;
            margin: 0 0 1rem 0;
            font-size: 1.1rem;
        }
        
        .features-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .features-list li {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.5rem 0;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .features-list li i {
            color: #1E90FF;
            font-size: 0.9rem;
        }
        
        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid rgba(30, 144, 255, 0.2);
            display: flex;
            gap: 0.8rem;
            justify-content: flex-end;
            flex-wrap: wrap;
        }
        
        .modal-footer .btn-secondary {
            background: transparent;
            border: 1px solid rgba(30, 144, 255, 0.3);
            color: #1E90FF;
            padding: 0.7rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.9rem;
            flex: 1;
            justify-content: center;
            min-width: 120px;
        }
        
        .modal-footer .btn-secondary:hover {
            background: rgba(30, 144, 255, 0.1);
            border-color: #1E90FF;
        }
        
        .modal-footer .btn-primary {
            background: linear-gradient(135deg, #1E90FF, #00BFFF);
            border: none;
            color: white;
            padding: 0.7rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-weight: 600;
            font-size: 0.9rem;
            flex: 1;
            justify-content: center;
            min-width: 120px;
        }
        
        .modal-footer .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(30, 144, 255, 0.3);
        }
        
        @media (max-width: 768px) {
            .modal-overlay {
                padding: 0.5rem;
                align-items: flex-start;
                padding-top: 2rem;
            }
            
            .modal-content {
                max-height: 95vh;
                margin: 0;
                border-radius: 16px;
                width: calc(100% - 1rem);
            }
            
            .modal-header {
                padding: 1rem;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .modal-icon {
                width: 40px;
                height: 40px;
                font-size: 1rem;
                margin-right: 0.8rem;
            }
            
            .modal-title h3 {
                font-size: 1.1rem;
            }
            
            .modal-title p {
                font-size: 0.8rem;
            }
            
            .modal-close {
                width: 35px;
                height: 35px;
                font-size: 0.9rem;
            }
            
            .modal-body {
                padding: 1rem;
            }
            
            .product-summary {
                flex-direction: column;
                gap: 0.8rem;
                text-align: center;
                padding: 1rem;
            }
            
            .product-info h4 {
                font-size: 1rem;
            }
            
            .product-info p {
                font-size: 0.8rem;
            }
            
            .product-price-modal .price {
                font-size: 1.5rem;
            }
            
            .purchase-options h5 {
                font-size: 1rem;
                margin-bottom: 0.8rem;
            }
            
            .option-card {
                padding: 1rem;
                min-height: 55px;
            }
            
            .option-icon {
                width: 40px;
                height: 40px;
                font-size: 1rem;
            }
            
            .option-content h6 {
                font-size: 0.9rem;
            }
            
            .option-content p {
                font-size: 0.7rem;
            }
            
            .modal-features h5 {
                font-size: 1rem;
                margin-bottom: 0.8rem;
            }
            
            .features-list li {
                font-size: 0.85rem;
                padding: 0.4rem 0;
            }
            
            .modal-footer {
                padding: 1rem;
                flex-direction: column;
                gap: 0.6rem;
            }
            
            .modal-footer .btn-secondary,
            .modal-footer .btn-primary {
                width: 100%;
                padding: 0.8rem 1rem;
                font-size: 0.9rem;
            }
        }
        
        @media (max-width: 480px) {
            .modal-overlay {
                padding: 0.25rem;
                padding-top: 1rem;
            }
            
            .modal-content {
                width: calc(100% - 0.5rem);
                border-radius: 12px;
            }
            
            .modal-header {
                padding: 0.8rem;
            }
            
            .modal-body {
                padding: 0.8rem;
            }
            
            .product-summary {
                padding: 0.8rem;
            }
            
            .option-card {
                padding: 0.8rem;
                min-height: 50px;
            }
            
            .modal-footer {
                padding: 0.8rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Store original scroll position and body overflow
    const originalScrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${originalScrollY}px`;
    document.body.style.width = '100%';
    
    // Close modal functionality
    const closeModal = () => {
        modal.style.opacity = '0';
        modal.querySelector('.modal-content').classList.remove('show');
        
        // Restore body scroll and position
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, originalScrollY);
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
                style.remove();
            }
        }, 300);
    };
    
    modal.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
        if (e.target === modal.querySelector('.modal-overlay')) {
            closeModal();
        }
    });
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.modal-content').classList.add('show');
    }, 100);
    
    // Handle escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    
    document.addEventListener('keydown', handleEscape);
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #1E90FF, #00BFFF);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(30, 144, 255, 0.3);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
initScrollToTop();

// Performance optimization
function optimizePerformance() {
    // Lazy load images when they come into view
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize performance optimizations
optimizePerformance();

// Video handling for iOS compatibility
function initVideoHandling() {
    const video = document.querySelector('.hero-video video');
    const fallback = document.querySelector('.video-fallback');
    
    if (!video || !fallback) return;
    
    // Detect iOS and mobile devices
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Force video attributes for better compatibility
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('muted', '');
    video.setAttribute('loop', '');
    video.setAttribute('autoplay', '');
    video.setAttribute('preload', 'auto');
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    
    // Hide fallback initially
    fallback.classList.add('hidden');
    
    // Create a more aggressive play function
    let playAttempts = 0;
    const maxAttempts = 10;
    let isPlaying = false;
    
    function attemptPlay() {
        if (isPlaying) return;
        
        playAttempts++;
        console.log(`Attempting to play video (attempt ${playAttempts})`);
        
        // Force video properties
        video.muted = true;
        video.loop = true;
        video.autoplay = true;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video started playing successfully');
                isPlaying = true;
                fallback.classList.add('hidden');
            }).catch(error => {
                console.log(`Play attempt ${playAttempts} failed:`, error);
                
                if (playAttempts < maxAttempts) {
                    // Try again after a short delay
                    setTimeout(attemptPlay, 200);
                } else {
                    console.log('All play attempts failed, showing fallback');
                    fallback.classList.remove('hidden');
                }
            });
        }
    }
    
    // Handle video events
    video.addEventListener('loadstart', function() {
        console.log('Video load started');
        attemptPlay();
    });
    
    video.addEventListener('loadeddata', function() {
        console.log('Video data loaded');
        attemptPlay();
    });
    
    video.addEventListener('canplay', function() {
        console.log('Video can play');
        attemptPlay();
    });
    
    video.addEventListener('canplaythrough', function() {
        console.log('Video can play through');
        attemptPlay();
    });
    
    video.addEventListener('playing', function() {
        console.log('Video is playing');
        isPlaying = true;
        fallback.classList.add('hidden');
    });
    
    video.addEventListener('pause', function() {
        console.log('Video paused');
        isPlaying = false;
        // Only show fallback on iOS if video was paused by user
        if (isIOS && !video.ended) {
            fallback.classList.remove('hidden');
        }
    });
    
    video.addEventListener('error', function(e) {
        console.log('Video error:', e);
        fallback.classList.remove('hidden');
    });
    
    // Handle fallback click
    fallback.addEventListener('click', function() {
        video.play().then(() => {
            console.log('Video started playing from fallback');
            isPlaying = true;
            fallback.classList.add('hidden');
        }).catch(error => {
            console.log('Error playing video from fallback:', error);
        });
    });
    
    // Try to play video immediately
    attemptPlay();
    
    // Create fake user interaction for iOS
    if (isIOS) {
        // Simulate user interaction
        const fakeInteraction = () => {
            const event = new Event('touchstart', { bubbles: true });
            document.dispatchEvent(event);
        };
        
        // Try fake interaction multiple times
        setTimeout(fakeInteraction, 100);
        setTimeout(fakeInteraction, 500);
        setTimeout(fakeInteraction, 1000);
        setTimeout(fakeInteraction, 2000);
    }
    
    // Force play on any user interaction
    const userInteractionEvents = ['touchstart', 'touchend', 'click', 'keydown', 'mousedown', 'mouseup', 'scroll'];
    userInteractionEvents.forEach(event => {
        document.addEventListener(event, function() {
            if (video.paused && !isPlaying) {
                console.log('User interaction detected, attempting to play video');
                attemptPlay();
            }
        }, { once: false });
    });
    
    // Very aggressive play attempts
    const intervals = [100, 300, 500, 1000, 2000, 3000, 5000];
    intervals.forEach((delay, index) => {
        setTimeout(() => {
            if (video.paused && !isPlaying) {
                console.log(`Delayed play attempt ${index + 1} (${delay}ms)`);
                attemptPlay();
            }
        }, delay);
    });
    
    // Handle visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            video.pause();
            isPlaying = false;
        } else {
            // Try to resume playing when tab becomes visible
            if (!video.ended && !isPlaying) {
                attemptPlay();
            }
        }
    });
    
    // Force play on window focus (helps with some mobile browsers)
    window.addEventListener('focus', function() {
        if (!video.ended && video.paused && !isPlaying) {
            attemptPlay();
        }
    });
    
    // Additional iOS specific handling
    if (isIOS) {
        // Try to play on orientation change
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                if (video.paused && !isPlaying) {
                    attemptPlay();
                }
            }, 500);
        });
        
        // Try to play on resize
        window.addEventListener('resize', function() {
            if (video.paused && !isPlaying) {
                attemptPlay();
            }
        });
        
        // Programmatic click on video element
        const programmaticClick = () => {
            if (video.paused && !isPlaying) {
                console.log('Programmatic click on video');
                video.click();
                attemptPlay();
            }
        };
        
        // Try programmatic clicks
        setTimeout(programmaticClick, 200);
        setTimeout(programmaticClick, 1000);
        setTimeout(programmaticClick, 3000);
    }
    
    // Final fallback - try to play on any DOM event
    document.addEventListener('DOMContentLoaded', attemptPlay);
    window.addEventListener('load', attemptPlay);
    document.addEventListener('readystatechange', attemptPlay);
}


