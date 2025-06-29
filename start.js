const fs = require('fs');
const path = require('path');
const dbManager = require('./api/db-manager');

const baseDir = process.env.RENDER ? '/data' : path.join(__dirname, 'db');

console.log('🚀 Iniciando Helpstress Backend...');

// Só cria o arquivo db.json se baseDir existir
if (fs.existsSync(baseDir)) {
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
} else {
  console.error('❌ Diretório base não existe:', baseDir);
  process.exit(1);
}

// Garante que o diretório de backups existe (se necessário)
const backupDir = path.join(baseDir, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('📁 Diretório de backups criado.');
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