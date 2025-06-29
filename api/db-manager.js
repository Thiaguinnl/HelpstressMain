const fs = require('fs');
const path = require('path');

const originalDbPath = path.join(__dirname, '..', 'db', 'db.json');
const tempDbPath = '/tmp/db.json';
const backupDir = path.join(__dirname, '..', 'db', 'backups');
const backupFile = path.join(backupDir, 'db-backup.json');

function log(msg) {
  console.log(`[DB-MANAGER] ${msg}`);
}

function ensureBackupDir() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
    log('Diretório de backup criado.');
  }
}

function saveToOriginal() {
  try {
    const data = fs.readFileSync(tempDbPath, 'utf-8');
    fs.writeFileSync(originalDbPath, data, 'utf-8');
    log('Dados salvos no arquivo original.');
  } catch (err) {
    log('Erro ao salvar dados no arquivo original: ' + err.message);
  }
}

function saveToTemp() {
  try {
    const data = fs.readFileSync(originalDbPath, 'utf-8');
    fs.writeFileSync(tempDbPath, data, 'utf-8');
    log('Dados sincronizados do original para o temporário.');
  } catch (err) {
    log('Erro ao sincronizar dados para o temporário: ' + err.message);
  }
}

function createBackup() {
  ensureBackupDir();
  try {
    const data = fs.readFileSync(tempDbPath, 'utf-8');
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
  return {
    tempExists: fs.existsSync(tempDbPath),
    originalExists: fs.existsSync(originalDbPath),
    backupExists: fs.existsSync(backupFile),
    tempSize: fs.existsSync(tempDbPath) ? fs.statSync(tempDbPath).size : 0,
    originalSize: fs.existsSync(originalDbPath) ? fs.statSync(originalDbPath).size : 0,
    backupSize: fs.existsSync(backupFile) ? fs.statSync(backupFile).size : 0,
    integrity: checkIntegrity()
  };
}

function syncFiles() {
  // Se o temporário não existe, copia do original
  if (!fs.existsSync(tempDbPath)) {
    saveToTemp();
  }
  // Se o original está desatualizado, salva do temp
  else {
    saveToOriginal();
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