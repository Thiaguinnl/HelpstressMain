const fs = require('fs');
const path = require('path');
const dbManager = require('./api/db-manager');

const baseDir = process.env.RENDER ? '/data' : path.join(__dirname, 'db');

console.log('🚀 Iniciando Helpstress Backend...');

// Garante que o diretório base existe
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
  console.log('📁 Diretório base criado.');
}

// Garante que o arquivo db.json existe
const dbFile = path.join(baseDir, 'db.json');
if (!fs.existsSync(dbFile)) {
  const initialData = {
    usuarios: [],
    depoimentos: [],
    posts: [],
    likedPosts: [],
    savedItems: []
  };
  fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('📄 Arquivo db.json inicializado.');
}

// Sincroniza arquivos
try {
  dbManager.syncFiles();
  console.log('✅ Sincronização inicial concluída.');
} catch (err) {
  console.error('❌ Erro na sincronização inicial:', err.message);
}

// Inicia o servidor
console.log('🌐 Iniciando servidor...');
require('./api/index.js'); 