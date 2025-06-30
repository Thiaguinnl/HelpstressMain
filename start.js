const fs = require('fs');
const path = require('path');
const dbManager = require('./api/db-manager');
const jsonServer = require('json-server');

const isRender = process.env.RENDER === '1';
const dataDir = isRender ? '/data' : path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'db.json');

console.log('🚀 Iniciando Helpstress Backend...');
// Cria o diretório se não existir
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`📁 Diretório criado em ${dataDir}`);
}

// Cria db.json vazio se não existir
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ usuarios: [] }, null, 2));
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

// Inicializa JSON Server
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