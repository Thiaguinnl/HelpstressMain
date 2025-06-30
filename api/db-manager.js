const fs = require('fs');
const path = require('path');

const baseDir = process.env.RENDER ? '/data' : path.join(__dirname, '..', 'db');
const originalDbPath = path.join(__dirname, '..', 'db', 'db.json');
const tempDbPath = path.join(__dirname, '..', 'db', 'temp-db.json');
const backupDir = path.join(__dirname, '..', 'db', 'backups');
const backupFile = path.join(backupDir, 'db-backup.json');

function log(msg) {
  console.log(`[DB-MANAGER] ${msg}`);
}

function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    log('Diretório de backup criado.');
  }
}

function saveToOriginal() {
  try {
    if (!fs.existsSync(tempDbPath)) {
      log('Arquivo temporário não existe. Pulando salvamento.');
      return;
    }
    const data = fs.readFileSync(tempDbPath, 'utf-8');
    JSON.parse(data);
    fs.writeFileSync(originalDbPath, data, 'utf-8');
    log('Dados salvos no arquivo original com sucesso.');
    // Força atualização do backup sempre que salvar o original
    createBackup();
  } catch (err) {
    log('Erro ao salvar dados no arquivo original: ' + err.message);
  }
}

function saveToTemp() {
  try {
    if (!fs.existsSync(originalDbPath)) {
      log('Arquivo original não existe. Pulando sincronização.');
      return;
    }
    
    const data = fs.readFileSync(originalDbPath, 'utf-8');
    // Verifica se o JSON é válido antes de salvar
    JSON.parse(data);
    
    fs.writeFileSync(tempDbPath, data, 'utf-8');
    log('Dados sincronizados do original para o temporário.');
  } catch (err) {
    log('Erro ao sincronizar dados para o temporário: ' + err.message);
  }
}

function createBackup() {
  ensureBackupDir();
  try {
    if (!fs.existsSync(tempDbPath)) {
      log('Arquivo temporário não existe. Pulando backup.');
      return;
    }
    
    const data = fs.readFileSync(tempDbPath, 'utf-8');
    // Verifica se o JSON é válido antes de fazer backup
    JSON.parse(data);
    
    fs.writeFileSync(backupFile, data, 'utf-8');
    log('Backup criado com sucesso.');
  } catch (err) {
    log('Erro ao criar backup: ' + err.message);
  }
}

function restoreBackup() {
  try {
    if (!fs.existsSync(backupFile)) throw new Error('Backup não encontrado.');
    const data = fs.readFileSync(backupFile, 'utf-8');
    // Verifica se o JSON é válido antes de restaurar
    JSON.parse(data);
    
    fs.writeFileSync(tempDbPath, data, 'utf-8');
    fs.writeFileSync(originalDbPath, data, 'utf-8');
    log('Backup restaurado com sucesso.');
    return true;
  } catch (err) {
    log('Erro ao restaurar backup: ' + err.message);
    return false;
  }
}

function checkIntegrity() {
  try {
    if (!fs.existsSync(tempDbPath)) {
      log('Arquivo temporário não existe.');
      return false;
    }
    
    const tempData = fs.readFileSync(tempDbPath, 'utf-8');
    JSON.parse(tempData);
    log('Integridade do arquivo temporário OK.');
    return true;
  } catch (err) {
    log('Integridade do arquivo temporário FALHOU: ' + err.message);
    return false;
  }
}

function getStatus() {
  const status = {
    tempExists: fs.existsSync(tempDbPath),
    originalExists: fs.existsSync(originalDbPath),
    backupExists: fs.existsSync(backupFile),
    tempSize: fs.existsSync(tempDbPath) ? fs.statSync(tempDbPath).size : 0,
    originalSize: fs.existsSync(originalDbPath) ? fs.statSync(originalDbPath).size : 0,
    backupSize: fs.existsSync(backupFile) ? fs.statSync(backupFile).size : 0,
    integrity: checkIntegrity()
  };
  
  // Adiciona timestamps se os arquivos existem
  if (fs.existsSync(tempDbPath)) {
    status.tempModified = fs.statSync(tempDbPath).mtime;
  }
  if (fs.existsSync(originalDbPath)) {
    status.originalModified = fs.statSync(originalDbPath).mtime;
  }
  if (fs.existsSync(backupFile)) {
    status.backupModified = fs.statSync(backupFile).mtime;
  }
  
  return status;
}

function syncFiles() {
  log('Iniciando sincronização de arquivos...');
  
  const tempExists = fs.existsSync(tempDbPath);
  const originalExists = fs.existsSync(originalDbPath);
  
  if (!tempExists && !originalExists) {
    log('Nenhum arquivo de banco encontrado. Criando arquivo vazio.');
    const emptyDb = { usuarios: [], depoimentos: [], posts: [], likedPosts: [], savedItems: [] };
    fs.writeFileSync(originalDbPath, JSON.stringify(emptyDb, null, 2), 'utf-8');
    fs.writeFileSync(tempDbPath, JSON.stringify(emptyDb, null, 2), 'utf-8');
    return;
  }
  
  if (!tempExists && originalExists) {
    log('Arquivo temporário não existe. Copiando do original.');
    saveToTemp();
    return;
  }
  
  if (tempExists && !originalExists) {
    log('Arquivo original não existe. Copiando do temporário.');
    saveToOriginal();
    return;
  }
  
  // Ambos existem, verifica qual é mais recente
  const tempStats = fs.statSync(tempDbPath);
  const originalStats = fs.statSync(originalDbPath);
  
  if (tempStats.mtime > originalStats.mtime) {
    log('Arquivo temporário é mais recente. Sincronizando para o original.');
    saveToOriginal();
  } else {
    log('Arquivo original é mais recente. Sincronizando para o temporário.');
    saveToTemp();
  }
}

module.exports = {
  saveToOriginal,
  saveToTemp,
  createBackup,
  restoreBackup,
  checkIntegrity,
  getStatus,
  syncFiles,
  backupFile,
  log
}; 