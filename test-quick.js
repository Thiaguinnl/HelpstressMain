const axios = require('axios');

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

console.log('⚡ Teste Rápido de Persistência');
console.log(`📍 URL: ${BASE_URL}`);

async function quickTest() {
  try {
    // 1. Verificar status
    console.log('\n📊 Verificando status...');
    const status = await axios.get(`${BASE_URL}/api/status`);
    console.log('✅ Status OK:', {
      tempExists: status.data.tempExists,
      originalExists: status.data.originalExists,
      integrity: status.data.integrity
    });

    // 2. Contar usuários e posts
    console.log('\n📈 Contando dados...');
    const users = await axios.get(`${BASE_URL}/usuarios`);
    const posts = await axios.get(`${BASE_URL}/posts`);
    console.log(`✅ Usuários: ${users.data.length}, Posts: ${posts.data.length}`);

    // 3. Criar usuário de teste
    console.log('\n👤 Criando usuário de teste...');
    const testEmail = `teste-${Date.now()}@teste.com`;
    const userData = {
      nome: 'Teste Rápido',
      email: testEmail,
      senha: '123456',
      celular: '11999999999'
    };
    
    const newUser = await axios.post(`${BASE_URL}/register`, userData);
    console.log('✅ Usuário criado:', newUser.data.usuario.nome);

    // 4. Verificar se usuário foi salvo
    console.log('\n🔍 Verificando se usuário foi salvo...');
    const usersAfter = await axios.get(`${BASE_URL}/usuarios`);
    const savedUser = usersAfter.data.find(u => u.email === testEmail);
    
    if (savedUser) {
      console.log('✅ Usuário persistiu corretamente!');
    } else {
      console.log('❌ Usuário não foi salvo!');
    }

    // 5. Status final
    console.log('\n📊 Status final...');
    const finalStatus = await axios.get(`${BASE_URL}/api/status`);
    console.log('✅ Status final OK');

    console.log('\n🎯 TESTE RÁPIDO CONCLUÍDO!');
    console.log('Se todos os itens estão ok, a persistência básica está funcionando!');

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

quickTest(); 