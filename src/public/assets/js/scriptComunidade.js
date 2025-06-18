console.log('scriptComunidade.js carregado');

// elementos
const tabs = document.querySelectorAll('.tab');
const prevButton = document.querySelector('.carrossel-button.prev');
const nextButton = document.querySelector('.carrossel-button.next');

// carrossel dados
const blogData = {
    'todos': [
        {
            image: 'assets/img/Yoga.jpg',
            title: 'Minha Jornada com a Ansiedade',
            description: 'Como encontrei paz através da meditação e mindfulness',
            author: 'Ana Silva',
            date: '12 Fev 2025',
            avatar: 'assets/img/anasilva.jpg'
        },
        {
            image: 'assets/img/Respiração.jpg',
            title: '5 Técnicas de Respiração',
            description: 'Exercícios práticos para momentos de ansiedade',
            author: 'Pedro Santos',
            date: '8 Mai 2023',
            avatar: 'assets/img/pedro.jpg'
        },
        {
            image: 'assets/img/Yoga2.png',
            title: 'Yoga para Iniciantes',
            description: 'Como começar sua prática de yoga em casa',
            author: 'Maria Costa',
            date: '27 Dez 2024',
            avatar: 'assets/img/maria.jpg'
        }
    ],
    'historias': [
        {
            image: 'assests/img/Hist1.jpg',
            title: 'Superando Crises de Pânico',
            description: 'Meu relato sobre como enfrentei e superei as crises de pânico.',
            author: 'Lucas Pereira',
            date: '7 Mai 2023',
            avatar: 'assets/img/lucas.jpg'
        },
        {
            image: 'assets/img/Hist2.jpg',
            title: 'Apoio da Família',
            description: 'Como o apoio familiar foi fundamental na minha recuperação.',
            author: 'Juliana Alves',
            date: '14 Out 2024',
            avatar: 'assets/img/juliana.jpg'
        },
        {
            image: 'assets/img/Hist3.jpg',
            title: 'Descobrindo a Terapia',
            description: 'Minha experiência ao iniciar a terapia e os benefícios que senti.',
            author: 'Rafael Souza',
            date: '9 Jan 2024',
            avatar: 'assets/img/rafael.jpg'
        }
    ],
    'tecnicas': [
        {
            image: 'assets/img/Meditacao2.jpg',
            title: 'Meditação Avançada',
            description: 'Técnicas avançadas de meditação para controle da ansiedade',
            author: 'Roberto Almeida',
            date: '28 Abr 2023',
            avatar: 'assets/img/roberto.jpg'
        },
        {
            image: 'assets/img/Exercicios.jpg',
            title: 'Exercícios Físicos em casa',
            description: 'Como a atividade física pode ajudar no controle da ansiedade',
            author: 'Fernanda Lima',
            date: '23 Jul 2024',
            avatar: 'assets/img/fernanda.jpg'
        },
        {
            image: 'assets/img/Alimentacao.jpg',
            title: 'Alimentação e Saúde Mental',
            description: 'Como uma dieta balanceada pode influenciar na ansiedade',
            author: 'Carlos Silva',
            date: '14 Ago 2023',
            avatar: 'assets/img/carlos.jpg'
        }
    ],
    'estudos': [
        {
            image: 'assets/img/Estudos1.jpg',
            title: 'Pesquisas Recentes sobre Ansiedade',
            description: 'Descobertas científicas sobre o tratamento da ansiedade em 2025',
            author: 'Dr. Lucas Mendes',
            date: '20 Jan 2025',
            avatar: 'assets/img/dr-lucas.jpg'
        },
        {
            image: 'assets/img/Estudo2.jpg',
            title: 'Eficácia das Terapias Alternativas',
            description: 'Análise científica sobre diferentes abordagens terapêuticas',
            author: 'Dra. Silvia Costa',
            date: '18 Abr 2024',
            avatar: 'assets/img/dra-silvia.jpg'
        },
        {
            image: 'assets/img/Estudos3.jpg',
            title: 'Ansiedade na Adolescência',
            description: 'Pesquisa mostra aumento de casos em jovens durante o período escolar.',
            author:'Prof. Ricardo Lima',
            date: '27 Dez 2024',
            avatar: 'assets/img/maria.jpg'
        }
    ]
};

// card de blog
function createBlogCard(item) {
    return `
        <article class="blog-card">
            <img src="${item.image}" alt="${item.title}" class="blog-image" loading="lazy">
            <div class="blog-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="author-info">
                    <img src="${item.avatar}" alt="${item.author}" class="author-avatar" loading="lazy">
                    <div class="author-details">
                        <h4>${item.author}</h4>
                        <span>${item.date}</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

const tabOrder = ['todos', 'historias', 'tecnicas', 'estudos'];
let currentTabIndex = 0;

let scrollPosition = 0;
const cardWidth = 300; 
const scrollStep = cardWidth / 1.5;

function updateNavigationButtons() {
    const blogGrid = document.querySelector('.blog-grid');
    const maxScroll = blogGrid.scrollWidth - blogGrid.clientWidth;
    
    prevButton.style.opacity = scrollPosition <= 0 ? '0.5' : '1';
    nextButton.style.opacity = scrollPosition >= maxScroll ? '0.5' : '1';
}

function waitForImagesToLoad(container, callback) {
    const images = container.querySelectorAll('img');
    let loaded = 0;
    if (images.length === 0) {
        callback();
        return;
    }
    images.forEach(img => {
        if (img.complete) {
            loaded++;
        } else {
            img.addEventListener('load', () => {
                loaded++;
                if (loaded === images.length) callback();
            });
            img.addEventListener('error', () => {
                loaded++;
                if (loaded === images.length) callback();
            });
        }
    });
    if (loaded === images.length) callback();
}

function updateCarousel(category) {
    const blogGrid = document.querySelector('.blog-grid');
    const items = blogData[category] || blogData['todos'];
    scrollPosition = 0;
    blogGrid.classList.remove('show-category');
    blogGrid.classList.add('fade-category');
    blogGrid.classList.add('loading');
    prevButton.disabled = true;
    nextButton.disabled = true;
    setTimeout(() => {
        blogGrid.innerHTML = items.map(createBlogCard).join('');
        waitForImagesToLoad(blogGrid, () => {
            setTimeout(() => {
                const containerWidth = blogGrid.clientWidth;
                const contentWidth = blogGrid.scrollWidth;
                const scrollLeft = (contentWidth - containerWidth) / 2;
                blogGrid.scrollLeft = scrollLeft;
                scrollPosition = scrollLeft;
                blogGrid.classList.remove('loading');
                blogGrid.classList.remove('fade-category');
                blogGrid.classList.add('show-category');
                prevButton.disabled = false;
                nextButton.disabled = false;
            }, 100);
            updateNavigationButtons();
        });
    }, 250);
    currentTabIndex = tabOrder.indexOf(category);
}

function scrollCarousel(direction) {
    const blogGrid = document.querySelector('.blog-grid');
    const maxScroll = blogGrid.scrollWidth - blogGrid.clientWidth;
    if (direction === 'next') {
        if (scrollPosition < maxScroll) {
            scrollPosition = Math.min(maxScroll, scrollPosition + scrollStep);
            blogGrid.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        } else {
            const tabs = document.querySelectorAll('.tab');
            currentTabIndex = (currentTabIndex + 1) % tabOrder.length;
            tabs[currentTabIndex].click();
        }
    } else {
        if (scrollPosition > 0) {
            scrollPosition = Math.max(0, scrollPosition - scrollStep);
            blogGrid.scrollTo({ left: scrollPosition, behavior: 'smooth' });
        } else {
            const tabs = document.querySelectorAll('.tab');
            currentTabIndex = (currentTabIndex - 1 + tabOrder.length) % tabOrder.length;
            tabs[currentTabIndex].click();
        }
    }
    updateNavigationButtons();
}

document.querySelectorAll('.tab').forEach((tab, idx) => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        let key = tab.textContent.trim().toLowerCase();
        if (key === 'todos') key = 'todos';
        else if (key === 'histórias' || key === 'historia' || key === 'histórias') key = 'historias';
        else if (key === 'técnicas' || key === 'tecnicas') key = 'tecnicas';
        else if (key === 'estudos') key = 'estudos';
        updateCarousel(key);
    });
});

prevButton.addEventListener('click', () => {
    scrollCarousel('prev');
});

nextButton.addEventListener('click', () => {
    scrollCarousel('next');
});

document.querySelector('.blog-grid').addEventListener('scroll', () => {
    scrollPosition = document.querySelector('.blog-grid').scrollLeft;
    updateNavigationButtons();
});

updateCarousel('todos');
document.querySelector('.tab').classList.add('active');


document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage.split('/').pop()) {
            link.classList.add('active');
        }
    });

    mostrarNomeUsuario();
});

// animação no scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// menu mobile
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// DOM(teste)
if (window.innerWidth <= 768) {
    const textDiv = document.querySelector('.conteudo-inicial');
    const banner = document.querySelector('.banner');
    if (textDiv && banner && textDiv.children.length > 0) {
        textDiv.insertBefore(banner, textDiv.children[1]);
    }
}

function mostrarNomeUsuario() {
    const userNameSpan = document.getElementById('userName');
    const communityProfileAvatar = document.getElementById('communityProfileAvatar');
    const userData = localStorage.getItem('userData');

    if (userData) {
        try {
            const user = JSON.parse(userData);
            if (userNameSpan) {
                userNameSpan.textContent = user.nome || 'Visitante';
            }
            
            if (communityProfileAvatar) {
                communityProfileAvatar.src = user.avatar || '/assets/img/user.png';
            }
        } catch (e) {
            console.error('Erro ao parsear dados do usuário do localStorage:', e);
            if (userNameSpan) {
                userNameSpan.textContent = 'Visitante';
            }
            if (communityProfileAvatar) {
                communityProfileAvatar.src = '/assets/img/user.png';
            }
        }
    } else {
        if (userNameSpan) {
            userNameSpan.textContent = 'Visitante';
        }
        if (communityProfileAvatar) {
            communityProfileAvatar.src = '/assets/img/user.png';
        }
    }
}

mostrarNomeUsuario(); 