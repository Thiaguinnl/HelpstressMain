gsap.registerPlugin(DrawSVGPlugin);

// Dados dos cards
const cardsData = [
    {
        titulo: "Suporte 24/7",
        descricao: "Acesso a profissionais de saúde mental e comunidade de apoio a qualquer momento",
        icone: "assets/img/diagn.png"
    },
    {
        titulo: "Técnicas de Respiração",
        descricao: "Exercícios guiados para ajudar no controle da ansiedade",
        icone: "assets/img/saude.png"
    },
    {
        titulo: "Diário de Humor",
        descricao: "Acompanhe seu estado emocional e identifique padrões",
        icone: "assets/img/cuidados.png"
    },
    {
        titulo: "Meditações",
        descricao: "Sessões de meditação guiada para diferentes níveis",
        icone: "assets/img/meditacao.png"
    }
];

// Dados dos depoimentos
const testimonialsData = [
    {
        quote: "Nosso time de conteúdo se move muito mais rápido na implantação de páginas web. Slices tornam o processo de ideação para implantação mais rápido, mantendo a qualidade da nossa marca.",
        author: "Yuriy Mikitchenko",
        title: "Growth Marketing Director",
        companyLogo: "assets/img/LOGO.png",
        authorPhoto: "assets/img/user.png"
    },
    {
        quote: "A plataforma transformou a maneira como lidamos com a ansiedade. É um recurso inestimável para a nossa equipe.",
        author: "Outro Usuário",
        title: "Cargo",
        companyLogo: "assets/img/LOGO.png",
        authorPhoto: "assets/img/user.png"
    },
    {
        quote: "Recomendo a todos que buscam apoio e ferramentas práticas para gerenciar o estresse.",
        author: "Mais Um Usuário",
        title: "Cargo",
        companyLogo: "assets/img/LOGO.png",
        authorPhoto: "assets/img/user.png"
    }
];

function criarCards() {
    const cardsContainer = document.getElementById('oferecemos-cards');
    
    cardsData.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        
        cardElement.innerHTML = `
            <img src="${card.icone}" alt="${card.titulo}" class="card-icon">
            <h3>${card.titulo}</h3>
            <p>${card.descricao}</p>
        `;
        
        cardsContainer.appendChild(cardElement);
    });
}

// Função para gerar o HTML do carrossel de depoimentos
function generateTestimonialsCarousel() {
    let carouselHTML = `
        <section class="testimonials-section">
            <div class="carousel-container">
                <div class="carousel-inner">
    `;

    testimonialsData.forEach(testimonial => {
        carouselHTML += `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <img src="${testimonial.companyLogo}" alt="Company Logo" class="company-logo">
                    <div class="testimonial-nav">
                        <button class="nav-arrow prev-arrow"><img src="/assets/img/arrow1.png" alt="Previous"></button>
                        <button class="nav-arrow next-arrow"><img src="/assets/img/arrow2.png" alt="Next"></button>
                    </div>
                </div>
                <hr class="testimonial-divider">
                <div class="testimonial-content">
                    <p class="quote"><img src="/assets/img/aspas.png" alt="Aspas">"${testimonial.quote}"</p>
                </div>
                <hr class="testimonial-divider">
                <div class="testimonial-footer">
                    <img src="${testimonial.authorPhoto}" alt="${testimonial.author}" class="author-photo">
                    <div class="author-info">
                        <p class="author-name">${testimonial.author}</p>
                        <p class="author-title">${testimonial.title}</p>
                    </div>
                </div>
            </div>
        `;
    });

    carouselHTML += `
                </div>
            </div>
        </section>
    `;

    return carouselHTML;
}

let currentIndex = 0;

// Função para renderizar um card específico
function renderCard(index) {
  const card = document.getElementById("card-display");
  const testimonial = testimonialsData[index]; // Usando seus dados existentes
  card.innerHTML = `
    <div class="testimonial-header">
        <img src="${testimonial.companyLogo}" alt="Company Logo" class="company-logo">
        <div class="testimonial-nav-buttons">
            <button class="arrow left" onclick="prevCard()">&#10094;</button>
            <button class="arrow right" onclick="nextCard()">&#10095;</button>
        </div>
    </div>
    <hr class="testimonial-divider">
    <div class="testimonial-content">
        <p class="quote"><img src="/assets/img/aspas.png" alt="Aspas">${testimonial.quote}</p>
    </div>
    <hr class="testimonial-divider">
    <div class="testimonial-footer">
        <img src="${testimonial.authorPhoto}" alt="${testimonial.author}" class="author-photo">
        <div class="author-info">
            <p class="author-name">${testimonial.author}</p>
            <p class="author-title">${testimonial.title}</p>
        </div>
    </div>
  `;
}

// Funções de navegação (mantidas da sua sugestão)
function nextCard() {
  currentIndex = (currentIndex + 1) % testimonialsData.length; // Usando seus dados
  renderCard(currentIndex);
}

function prevCard() {
  currentIndex = (currentIndex - 1 + testimonialsData.length) % testimonialsData.length; // Usando seus dados
  renderCard(currentIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    criarCards();

    // Remover a animação ScrollReveal para os cards

    // Inicializa com o primeiro card usando a nova lógica
    renderCard(currentIndex);
});

// Remover o código de animação GSAP para a linha esquerda

