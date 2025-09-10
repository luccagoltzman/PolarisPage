# Polaris Software - Landing Page

Uma landing page moderna e sofisticada para a Polaris Software, desenvolvida com design dark mode minimalista e efeitos visuais avançados.

## 🚀 Características

- **Design Moderno**: Interface dark mode com paleta de cores azul escuro (#0A1F44), azul vibrante (#1E90FF) e branco (#FFFFFF)
- **Efeitos Parallax**: Animações suaves e efeitos de movimento para criar uma experiência imersiva
- **Responsivo**: Totalmente adaptável para dispositivos móveis, tablets e desktops
- **Painel de Produtos**: Seção dedicada para exibir e vender softwares da empresa
- **Animações Avançadas**: Efeitos de digitação, contadores animados e transições suaves
- **Performance Otimizada**: Carregamento rápido e otimizado para SEO

## 📁 Estrutura do Projeto

```
PolarisPage/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript para interatividade
├── README.md           # Documentação
└── assets/
    ├── images/         # Imagens da empresa
    │   ├── PolarisP.jpeg
    │   ├── Polaris_proposta3.png
    │   ├── PSoft.jpeg
    │   ├── PolarisEstrela.jpeg
    │   └── pexels-umkreisel-app-957061.jpg  # Imagem de fundo da seção contato
    └── video/          # Vídeos
        ├── istockphoto-1360048537-640_adpp_is.mp4  # Vídeo hero principal
        ├── istockphoto-1394876713-640_adpp_is.mp4  # Vídeo alternativo
        ├── 225158_small.mp4                        # Vídeo alternativo
        └── README.md                                # Instruções para vídeos
```

## 🎨 Seções da Landing Page

### 1. **Hero Section**
- Vídeo de fundo com overlay
- Título com efeito de digitação
- Botões de call-to-action
- Indicador de scroll animado

### 2. **Sobre a Empresa**
- Estatísticas animadas
- Imagem da equipe
- Missão e valores

### 3. **Serviços**
- Cards com ícones e descrições
- Efeitos hover interativos
- Grid responsivo

### 4. **Produtos**
- Painel de preços para softwares
- Cards de produtos com imagens
- Sistema de compra integrado
- Modal de compra

### 5. **Contato**
- Formulário de contato funcional
- Informações de contato
- Validação de formulário

## 🛠️ Como Usar

1. **Abra o arquivo `index.html`** em qualquer navegador moderno
2. **Vídeo hero já configurado** - `istockphoto-1360048537-640_adpp_is.mp4` está sendo usado
3. **Personalize as informações** da empresa no HTML
4. **Ajuste as cores** no arquivo `styles.css` se necessário

## 📱 Responsividade

A landing page é totalmente responsiva e funciona perfeitamente em:
- 📱 Dispositivos móveis (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Telas grandes (1440px+)

## 🎯 Funcionalidades JavaScript

- **Navegação suave** entre seções
- **Menu mobile** responsivo
- **Efeitos parallax** no scroll
- **Animações de entrada** para elementos
- **Contadores animados** para estatísticas
- **Validação de formulário** em tempo real
- **Modal de compra** para produtos
- **Notificações** de feedback
- **Botão de voltar ao topo**

## 🎨 Paleta de Cores

- **Azul Escuro**: `#0A1F44` - Cor principal para fundos e elementos escuros
- **Azul Vibrante**: `#1E90FF` - Cor de destaque para botões e elementos interativos
- **Branco**: `#FFFFFF` - Cor para textos e elementos claros

## 📈 Performance

- **CSS otimizado** com variáveis CSS para fácil manutenção
- **JavaScript modular** com funções organizadas
- **Imagens otimizadas** com lazy loading
- **Animações suaves** com CSS transforms
- **Carregamento rápido** sem dependências externas pesadas

## 🔧 Personalização

### Alterar Cores
Edite as variáveis CSS no início do arquivo `styles.css`:

```css
:root {
    --primary-dark: #0A1F44;
    --primary-blue: #1E90FF;
    --white: #FFFFFF;
}
```

### Adicionar Novos Produtos
Adicione novos cards de produto na seção `#products` do `index.html`:

```html
<div class="product-card">
    <div class="product-image">
        <img src="assets/images/seu-produto.jpg" alt="Nome do Produto" class="product-img">
    </div>
    <div class="product-content">
        <h3>Nome do Produto</h3>
        <p>Descrição do produto...</p>
        <!-- ... resto do conteúdo ... -->
    </div>
</div>
```

## 📞 Suporte

Para dúvidas ou suporte, entre em contato:
- **Telefone**: +55 (88) 9802-0419
- **Localização**: São Luís, MA - Brasil

---

**Desenvolvido com exelência pela Polaris Software**