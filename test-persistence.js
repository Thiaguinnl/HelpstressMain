const axios = require('axios');

// Configuração
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_EMAIL = 'teste-persistencia@teste.com';
const TEST_PASSWORD = '123456';

console.log('🧪 Iniciando testes de persistência...');
console.log(`📍 URL: ${BASE_URL}`);

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testStatus() {
  console.log('\n📊 1. Verificando status inicial do banco...');
  try {
    const response = await axios.get(`${BASE_URL}/api/status`);
    console.log('✅ Status do banco:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.message);
    return null;
  }
}

async function testCreateUser() {
  console.log('\n👤 2. Criando usuário de teste...');
  try {
    const userData = {
      nome: 'Usuário Teste Persistência',
      email: TEST_EMAIL,
      senha: TEST_PASSWORD,
      celular: '11999999999'
    };
    
    const response = await axios.post(`${BASE_URL}/register`, userData);
    console.log('✅ Usuário criado:', response.data.usuario.nome);
    return response.data.usuario;
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error.response?.data || error.message);
    return null;
  }
}

async function testCreatePost(userId) {
  console.log('\n📝 3. Criando post de teste...');
  try {
    const postData = {
      userId: userId,
      autor: 'Usuário Teste Persistência',
      avatar: '/assets/img/user.png',
      data: new Date().toLocaleString('pt-BR'),
      tags: ['#teste', '#persistencia'],
      img: '',
      content: 'Este é um post de teste para verificar persistência!',
      title: 'Teste de Persistência',
      likes: 0,
      salvos: 0,
      likedBy: [],
      savedBy: [],
      comentarios: []
    };
    
    const response = await axios.post(`${BASE_URL}/posts`, postData);
    console.log('✅ Post criado com ID:', response.data.id);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar post:', error.response?.data || error.message);
    return null;
  }
}

async function testVerifyData() {
  console.log('\n🔍 4. Verificando se dados foram salvos...');
  try {
    // Verificar usuários
    const usersResponse = await axios.get(`${BASE_URL}/usuarios`);
    const testUser = usersResponse.data.find(u => u.email === TEST_EMAIL);
    
    if (testUser) {
      console.log('✅ Usuário encontrado:', testUser.nome);
      
      // Verificar posts
      const postsResponse = await axios.get(`${BASE_URL}/posts`);
      const testPost = postsResponse.data.find(p => p.userId === testUser.id);
      
      if (testPost) {
        console.log('✅ Post encontrado:', testPost.title);
        return { user: testUser, post: testPost };
      } else {
        console.log('❌ Post não encontrado');
        return { user: testUser, post: null };
      }
    } else {
      console.log('❌ Usuário não encontrado');
      return { user: null, post: null };
    }
  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error.message);
    return { user: null, post: null };
  }
}

async function testBackup() {
  console.log('\n💾 5. Testando backup manual...');
  try {
    const response = await axios.post(`${BASE_URL}/api/backup`);
    console.log('✅ Backup criado:', response.data.mensagem);
    return true;
  } catch (error) {
    console.error('❌ Erro ao criar backup:', error.response?.data || error.message);
    return false;
  }
}

async function testSync() {
  console.log('\n🔄 6. Testando sincronização manual...');
  try {
    const response = await axios.post(`${BASE_URL}/api/sync`);
    console.log('✅ Sincronização realizada:', response.data.mensagem);
    return true;
  } catch (error) {
    console.error('❌ Erro na sincronização:', error.response?.data || error.message);
    return false;
  }
}

async function testRestore() {
  console.log('\n🔄 7. Testando restauração de backup...');
  try {
    const response = await axios.post(`${BASE_URL}/api/restore-backup`);
    console.log('✅ Backup restaurado:', response.data.mensagem);
    return true;
  } catch (error) {
    console.error('❌ Erro ao restaurar backup:', error.response?.data || error.message);
    return false;
  }
}

async function simulateRestart() {
  console.log('\n🔄 8. Simulando reinicialização (aguardando 10s)...');
  console.log('⏳ Aguarde 10 segundos para simular reinicialização...');
  await delay(10000);
  console.log('✅ Simulação de reinicialização concluída');
}

async function runTests() {
  console.log('🚀 Iniciando testes de persistência...\n');
  
  // Teste 1: Status inicial
  const initialStatus = await testStatus();
  
  // Teste 2: Criar usuário
  const user = await testCreateUser();
  if (!user) {
    console.log('❌ Falha no teste de criação de usuário. Abortando...');
    return;
  }
  
  // Teste 3: Criar post
  const post = await testCreatePost(user.id);
  if (!post) {
    console.log('❌ Falha no teste de criação de post. Abortando...');
    return;
  }
  
  // Teste 4: Verificar dados salvos
  const savedData = await testVerifyData();
  
  // Teste 5: Backup
  await testBackup();
  
  // Teste 6: Sincronização
  await testSync();
  
  // Teste 7: Status após operações
  console.log('\n📊 9. Status após operações...');
  await testStatus();
  
  // Teste 8: Simular reinicialização
  await simulateRestart();
  
  // Teste 9: Verificar dados após "reinicialização"
  console.log('\n🔍 10. Verificando dados após simulação de reinicialização...');
  const finalData = await testVerifyData();
  
  // Teste 10: Status final
  console.log('\n📊 11. Status final...');
  const finalStatus = await testStatus();
  
  // Resultado final
  console.log('\n📋 RESUMO DOS TESTES:');
  console.log('='.repeat(50));
  
  if (savedData.user && savedData.post) {
    console.log('✅ Usuário e post criados com sucesso');
  } else {
    console.log('❌ Falha na criação de dados');
  }
  
  if (finalData.user && finalData.post) {
    console.log('✅ Dados persistiram após simulação de reinicialização');
  } else {
    console.log('❌ Dados foram perdidos após simulação de reinicialização');
  }
  
  if (initialStatus && finalStatus) {
    console.log('✅ Sistema de status funcionando');
  } else {
    console.log('❌ Problema com sistema de status');
  }
  
  console.log('\n🎯 TESTE CONCLUÍDO!');
  console.log('Se todos os itens acima estão ✅, a persistência está funcionando!');
}

// Executar testes
runTests().catch(console.error); 