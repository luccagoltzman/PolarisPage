// Interface de Voz
class VoiceInterface {
    constructor() {
        this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.commands = this.setupCommands();
        
        this.setupRecognition();
        this.createVoiceButton();
    }
    
    setupCommands() {
        return {
            'navegar para início': () => this.navigateTo('home'),
            'ir para início': () => this.navigateTo('home'),
            'navegar para sobre': () => this.navigateTo('about'),
            'ir para sobre': () => this.navigateTo('about'),
            'navegar para serviços': () => this.navigateTo('services'),
            'ir para serviços': () => this.navigateTo('services'),
            'navegar para produtos': () => this.navigateTo('products'),
            'ir para produtos': () => this.navigateTo('products'),
            'navegar para contato': () => this.navigateTo('contact'),
            'ir para contato': () => this.navigateTo('contact'),
            'rolar para baixo': () => this.scroll('down'),
            'rolar para cima': () => this.scroll('up'),
            'parar de ouvir': () => this.stopListening(),
            'ajuda': () => this.showHelp()
        };
    }
    
    setupRecognition() {
        this.recognition.lang = 'pt-BR';
        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        
        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase().trim();
            
            console.log('Comando reconhecido:', command);
            this.processCommand(command);
        };
        
        this.recognition.onerror = (event) => {
            console.error('Erro no reconhecimento de voz:', event.error);
            this.updateVoiceButton(false);
        };
        
        this.recognition.onend = () => {
            if (this.isListening) {
                this.recognition.start();
            }
        };
    }
    
    createVoiceButton() {
        const button = document.createElement('button');
        button.className = 'voice-control';
        button.innerHTML = '<i class="fas fa-microphone"></i>';
        button.title = 'Controle por Voz (Clique para Ativar)';
        
        const ripple = document.createElement('div');
        ripple.className = 'voice-ripple';
        button.appendChild(ripple);
        
        button.addEventListener('click', () => this.toggleVoiceControl());
        
        document.body.appendChild(button);
        this.voiceButton = button;
    }
    
    toggleVoiceControl() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }
    
    startListening() {
        try {
            this.recognition.start();
            this.isListening = true;
            this.updateVoiceButton(true);
            this.speak('Controle por voz ativado. Diga "ajuda" para ver os comandos disponíveis.');
        } catch (error) {
            console.error('Erro ao iniciar reconhecimento de voz:', error);
        }
    }
    
    stopListening() {
        this.recognition.stop();
        this.isListening = false;
        this.updateVoiceButton(false);
        this.speak('Controle por voz desativado.');
    }
    
    updateVoiceButton(isActive) {
        this.voiceButton.classList.toggle('active', isActive);
        this.voiceButton.querySelector('.voice-ripple').style.animation = 
            isActive ? 'voiceRipple 1.5s linear infinite' : 'none';
    }
    
    processCommand(command) {
        let executed = false;
        
        Object.entries(this.commands).forEach(([key, action]) => {
            if (command.includes(key)) {
                action();
                executed = true;
            }
        });
        
        if (!executed) {
            this.speak('Comando não reconhecido. Diga "ajuda" para ver os comandos disponíveis.');
        }
    }
    
    navigateTo(section) {
        const element = document.getElementById(section);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            this.speak(`Navegando para a seção ${section}`);
        }
    }
    
    scroll(direction) {
        const distance = window.innerHeight * 0.8;
        const scrollOptions = {
            top: direction === 'down' ? distance : -distance,
            behavior: 'smooth'
        };
        
        window.scrollBy(scrollOptions);
        this.speak(`Rolando para ${direction === 'down' ? 'baixo' : 'cima'}`);
    }
    
    speak(text) {
        // Cancelar qualquer fala anterior
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1;
        utterance.pitch = 1;
        
        this.synthesis.speak(utterance);
    }
    
    showHelp() {
        const helpText = `
            Comandos disponíveis:
            - Navegar para início
            - Navegar para sobre
            - Navegar para serviços
            - Navegar para produtos
            - Navegar para contato
            - Rolar para baixo
            - Rolar para cima
            - Parar de ouvir
        `;
        
        this.speak(helpText);
        
        // Mostrar modal de ajuda visual
        const modal = document.createElement('div');
        modal.className = 'voice-help-modal';
        modal.innerHTML = `
            <div class="voice-help-content">
                <h3>Comandos de Voz Disponíveis</h3>
                <ul>
                    ${Object.keys(this.commands)
                        .map(command => `<li>${command}</li>`)
                        .join('')}
                </ul>
                <button class="close-help">Fechar</button>
            </div>
        `;
        
        modal.querySelector('.close-help').addEventListener('click', () => {
            modal.remove();
        });
        
        document.body.appendChild(modal);
    }
}

// Estilos para a interface de voz
const style = document.createElement('style');
style.textContent = `
    .voice-control {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
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
    
    .voice-control:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-heavy);
    }
    
    .voice-control.active {
        background: linear-gradient(135deg, #FF4B4B, #FF7676);
        animation: pulseVoice 1.5s ease-in-out infinite;
    }
    
    .voice-ripple {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        opacity: 0;
        pointer-events: none;
    }
    
    @keyframes voiceRipple {
        0% {
            transform: scale(1);
            opacity: 0.4;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes pulseVoice {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    .voice-help-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 31, 68, 0.95);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        animation: fadeIn 0.3s forwards;
    }
    
    .voice-help-content {
        background: var(--gradient-glass);
        padding: 2rem;
        border-radius: var(--border-radius-lg);
        border: var(--border-light);
        max-width: 500px;
        width: 90%;
        color: white;
        box-shadow: var(--shadow-heavy);
    }
    
    .voice-help-content h3 {
        color: var(--primary-blue);
        margin-bottom: 1rem;
        font-size: 1.5rem;
    }
    
    .voice-help-content ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    
    .voice-help-content li {
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        font-size: 1.1rem;
    }
    
    .voice-help-content li:last-child {
        border-bottom: none;
    }
    
    .close-help {
        margin-top: 1.5rem;
        padding: 0.8rem 1.5rem;
        background: var(--gradient-primary);
        border: none;
        border-radius: var(--border-radius);
        color: white;
        cursor: pointer;
        font-size: 1rem;
        transition: var(--transition);
    }
    
    .close-help:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-medium);
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .voice-control {
            bottom: 1rem;
            left: 1rem;
            width: 40px;
            height: 40px;
            font-size: 1rem;
        }
        
        .voice-help-content {
            padding: 1.5rem;
            font-size: 0.9rem;
        }
    }
`;

document.head.appendChild(style);

// Inicializar interface de voz quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        new VoiceInterface();
    } else {
        console.warn('Reconhecimento de voz não suportado neste navegador.');
    }
});
