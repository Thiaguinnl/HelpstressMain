document.addEventListener('DOMContentLoaded', () => {
    const perfilNomeUsuario = document.getElementById('perfil-nome-usuario');
    const perfilEmailUsuario = document.getElementById('perfil-email-usuario');
    const perfilDescricaoUsuario = document.getElementById('perfil-descricao-usuario');
    const editarPerfilButton = document.getElementById('editar-perfil-button');
    const logoutButtonPerfil = document.getElementById('logout-button-perfil');

    // Elemento da imagem de avatar no perfil
    const perfilAvatarImg = document.querySelector('.perfil-avatar');

    function loadUserProfile() {
        const authToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        console.log('Perfil.js: authToken', authToken);
        console.log('Perfil.js: userData', userData);

        if (!authToken || !userData) {
            console.log('Perfil.js: Usuário NÃO está logado. Redirecionando...');
            alert('Você precisa estar logado para acessar esta página.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const user = JSON.parse(userData);
            console.log('Perfil.js: Dados do usuário logado:', user);
            perfilNomeUsuario.textContent = user.nome || 'Nome não disponível';
            perfilDescricaoUsuario.textContent = user.bio || 'Compartilhe um pouco sobre você e seus interesses!';
            
            // Atualizar a imagem de avatar do perfil
            perfilAvatarImg.src = user.avatar || '/assets/img/user.png';

            // perfilEmailUsuario.textContent = user.email || 'Email não disponível'; 

        } catch (e) {
            console.error('Erro ao carregar dados do usuário do localStorage:', e);
            alert('Erro ao carregar dados do perfil. Por favor, faça login novamente.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = 'login.html';
        }
    }

    if (editarPerfilButton) {
        editarPerfilButton.addEventListener('click', () => {
            window.location.href = 'editarPerfil.html';
        });
    }

    if (logoutButtonPerfil) {
        logoutButtonPerfil.addEventListener('click', () => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            alert('Você foi desconectado!');
            window.location.href = 'index.html';
        });
    }

    loadUserProfile();

    const noPostsMessage = document.getElementById('noPostsMessage');
    const perfilPostsGrid = document.querySelector('.perfil-posts-grid');
    const postsTab = document.getElementById('posts-tab');
    const likesTab = document.getElementById('likes-tab');
    const savedTab = document.getElementById('saved-tab');

    const dummyUserPosts = [];

    const dummyLikedPosts = [];

    const dummySavedPosts = [];

    function getUserId() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.id;
            } catch (e) {
                console.error("Erro ao parsear userData do localStorage:", e);
                return null;
            }
        }
        return null;
    }

    async function showContent(tab) {
        const userId = getUserId();
        if (!userId) {
            console.error("ID do usuário não encontrado. Não é possível carregar o conteúdo.");
            noPostsMessage.classList.remove('hidden');
            noPostsMessage.querySelector('h2').textContent = 'Erro ao carregar';
            noPostsMessage.querySelector('p').textContent = 'Por favor, faça login novamente.';
            noPostsMessage.querySelector('.share-post-button').style.display = 'none';
            return;
        }

        noPostsMessage.classList.add('hidden');
        perfilPostsGrid.classList.add('hidden');
        perfilPostsGrid.innerHTML = ''; 
        
        postsTab.classList.remove('active');
        likesTab.classList.remove('active');
        savedTab.classList.remove('active');

        tab.classList.add('active');

        let currentContent = [];
        let messageTitle = '';
        let messageText = '';
        let buttonText = '';
        let buttonAction = () => {};
        let showGrid = false;

        try {
            if (tab === postsTab) {
                const response = await fetch(`http://localhost:3000/posts?userId=${userId}`);
                if (!response.ok) throw new Error('Erro ao buscar posts do usuário');
                currentContent = await response.json();
                console.log('Dados de posts do usuário (do JSON Server):', currentContent);

                if (currentContent.length > 0) {
                    showGrid = true;
                } else {
                    messageTitle = 'Comente seus posts';
                    messageText = 'Que tal dividir suas histórias, experiências e aprendizados com a comunidade? Sua vivência pode fazer a diferença!';
                    buttonText = 'COMPARTILHE SUA PRIMEIRA POSTAGEM';
                    buttonAction = () => window.location.href = 'comunidadeOFF.html'; 
                }
            } else if (tab === likesTab) {
                const likedResponse = await fetch(`http://localhost:3000/likedPosts?userId=${userId}`);
                if (!likedResponse.ok) throw new Error('Erro ao buscar curtidas');
                const likedItems = await likedResponse.json();

                if (likedItems.length > 0) {
                    const postPromises = likedItems.map(item => 
                        fetch(`http://localhost:3000/posts/${item.postId}`).then(res => res.json())
                    );
                    currentContent = await Promise.all(postPromises);
                    console.log('Dados de posts curtidos (do JSON Server):', currentContent);
                    showGrid = true;
                } else {
                    messageTitle = 'Nenhuma curtida ainda!';
                    messageText = 'Curta posts na comunidade para vê-los aqui.';
                    buttonText = 'EXPLORAR COMUNIDADE';
                    buttonAction = () => window.location.href = 'comunidadeOFF.html';
                }
            } else if (tab === savedTab) {
                const savedResponse = await fetch(`http://localhost:3000/savedItems?userId=${userId}`);
                if (!savedResponse.ok) throw new Error('Erro ao buscar itens salvos');
                const savedItems = await savedResponse.json();

                if (savedItems.length > 0) {
                    const itemPromises = savedItems.map(item => {
                        if (item.type === 'post') {
                            return fetch(`http://localhost:3000/posts/${item.itemId}`).then(res => res.json());
                        } else {
                            return Promise.resolve({ id: item.itemId, title: 'Conteúdo Salvo', img: 'https://via.placeholder.com/250x200?text=Conteudo+Salvo' });
                        }
                    });
                    currentContent = await Promise.all(itemPromises);
                    console.log('Dados de itens salvos (do JSON Server):', currentContent);
                    showGrid = true;
                } else {
                    messageTitle = 'Nenhum item salvo!';
                    messageText = 'Salve posts e artigos para vê-los aqui.';
                    buttonText = 'EXPLORAR CONTEÚDO';
                    buttonAction = () => window.location.href = 'dicasTecnicas.html'; 
                }
            }
            console.log('Decisão de showGrid:', showGrid);

            if (showGrid) {
                console.log('Renderizando o grid de posts...');
                renderContent(currentContent, perfilPostsGrid);
                perfilPostsGrid.classList.remove('hidden');
            } else {
                console.log('Exibindo a mensagem de nenhum conteúdo...');
                noPostsMessage.querySelector('h2').textContent = messageTitle;
                noPostsMessage.querySelector('p').textContent = messageText;
                noPostsMessage.querySelector('.share-post-button').textContent = buttonText;
                noPostsMessage.querySelector('.share-post-button').onclick = buttonAction;
                noPostsMessage.querySelector('.share-post-button').style.display = ''; 
                noPostsMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro ao carregar conteúdo do perfil:', error);
            noPostsMessage.classList.remove('hidden');
            noPostsMessage.querySelector('h2').textContent = 'Erro ao carregar';
            noPostsMessage.querySelector('p').textContent = 'Não foi possível carregar o conteúdo. Tente novamente.';
            noPostsMessage.querySelector('.share-post-button').style.display = 'none'; 
        }
    }

    if (postsTab) {
        postsTab.addEventListener('click', (e) => {
            e.preventDefault();
            showContent(postsTab);
        });
    }

    if (likesTab) {
        likesTab.addEventListener('click', (e) => {
            e.preventDefault();
            showContent(likesTab);
        });
    }

    if (savedTab) {
        savedTab.addEventListener('click', (e) => {
            e.preventDefault();
            showContent(savedTab);
        });
    }

    showContent(postsTab);

    // Função para renderizar posts dinamicamente
    function renderContent(contentArray, containerElement) {
        console.log('Chamando renderContent com dados:', contentArray);
        containerElement.innerHTML = ''; 
        if (contentArray && contentArray.length > 0) {
            contentArray.forEach(item => {
                const card = document.createElement('div');
                card.classList.add('perfil-post-card');
                card.innerHTML = `
                    <img src="${item.img}" alt="${item.title}">
                    <h3>${item.title}</h3>
                `;
                containerElement.appendChild(card);
            });
        } else {
            console.log("renderContent: Nenhum conteúdo para renderizar.");
        }
    }
}); 