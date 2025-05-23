// Dados dos cards
const cardsData = [
    {
        titulo: "Suporte 24/7",
        descricao: "Acesso a profissionais de saúde mental e comunidade de apoio a qualquer momento",
        icone: "/src/public/assets/img/suporte.png"
    },
    {
        titulo: "Técnicas de Respiração",
        descricao: "Exercícios guiados para ajudar no controle da ansiedade",
        icone: "/src/public/assets/img/respiracao.png"
    },
    {
        titulo: "Diário de Humor",
        descricao: "Acompanhe seu estado emocional e identifique padrões",
        icone: "/src/public/assets/img/diario.png"
    },
    {
        titulo: "Meditações",
        descricao: "Sessões de meditação guiada para diferentes níveis",
        icone: "/src/public/assets/img/meditacao.png"
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


document.addEventListener('DOMContentLoaded', criarCards);

