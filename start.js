const fs = require('fs');
const path = require('path');
const dbManager = require('./api/db-manager');

const isRender = process.env.RENDER === '1';
const dataDir = isRender ? '/data' : path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');

console.log('🚀 Iniciando Helpstress Backend...');


if (!isRender && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`📁 Diretório criado em ${dataDir}`);
}


if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ posts: [], usuarios: [], depoimentos: [], likedPosts: [], savedItems: [] }, null, 2));
  console.log(`📝 Arquivo db.json criado em ${dbPath}`);
}

// Garante que o diretório de backups existe
const backupDir = path.join(dataDir, 'backups');
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

// Inicia o JSON Server apontando para esse caminho
const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(router);

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
}); 