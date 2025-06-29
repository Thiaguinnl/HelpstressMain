# 🧪 Guia de Testes de Persistência

## 📋 Como Testar se os Dados Não Vão Sumir

### 🚀 Testes Automatizados

#### 1. Teste Rápido (Recomendado)
```bash
# Instalar dependências
npm install

# Teste local
npm run test-local

# Teste em produção (substitua pela sua URL)
npm run test-prod
```

#### 2. Teste Completo
```bash
# Teste completo com simulação de reinicialização
npm run test-full
```

### 🔧 Testes Manuais

#### 1. Verificar Status do Banco
```bash
curl https://seu-backend.onrender.com/api/status
```

**O que verificar:**
- ✅ `tempExists: true` - Arquivo temporário existe
- ✅ `originalExists: true` - Arquivo original existe
- ✅ `integrity: true` - JSON é válido
- ✅ `tempSize > 0` - Arquivo não está vazio

#### 2. Criar Dados de Teste
```bash
# Criar usuário
curl -X POST https://seu-backend.onrender.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Teste Persistência",
    "email": "teste@teste.com",
    "senha": "123456",
    "celular": "11999999999"
  }'

# Criar post
curl -X POST https://seu-backend.onrender.com/posts \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "autor": "Teste",
    "content": "Post de teste",
    "title": "Teste"
  }'
```

#### 3. Verificar se Dados Foram Salvos
```bash
# Verificar usuários
curl https://seu-backend.onrender.com/usuarios

# Verificar posts
curl https://seu-backend.onrender.com/posts
```

#### 4. Testar Backup e Sincronização
```bash
# Criar backup manual
curl -X POST https://seu-backend.onrender.com/api/backup

# Forçar sincronização
curl -X POST https://seu-backend.onrender.com/api/sync

# Verificar status novamente
curl https://seu-backend.onrender.com/api/status
```

### 🔄 Teste de Reinicialização (Manual)

#### 1. Pré-teste
```bash
# Anotar dados antes da reinicialização
curl https://seu-backend.onrender.com/usuarios | jq '. | length'
curl https://seu-backend.onrender.com/posts | jq '. | length'
```

#### 2. Reinicializar Servidor
- No Render: Vá em "Manual Deploy" → "Deploy latest commit"
- Aguarde a reinicialização (2-3 minutos)

#### 3. Pós-teste
```bash
# Verificar se dados persistiram
curl https://seu-backend.onrender.com/usuarios | jq '. | length'
curl https://seu-backend.onrender.com/posts | jq '. | length'

# Verificar status
curl https://seu-backend.onrender.com/api/status
```

### 📊 Indicadores de Sucesso

#### ✅ Tudo Funcionando
```json
{
  "tempExists": true,
  "originalExists": true,
  "backupExists": true,
  "integrity": true,
  "tempSize": 1234,
  "originalSize": 1234,
  "backupSize": 1234
}
```

#### ❌ Problemas Detectados
```json
{
  "tempExists": false,        // Arquivo temporário perdido
  "originalExists": true,
  "integrity": false,         // JSON corrompido
  "tempSize": 0              // Arquivo vazio
}
```

### 🚨 Solução de Problemas

#### Problema: Dados Perdidos
```bash
# 1. Verificar status
curl https://seu-backend.onrender.com/api/status

# 2. Forçar sincronização
curl -X POST https://seu-backend.onrender.com/api/sync

# 3. Se não funcionar, restaurar backup
curl -X POST https://seu-backend.onrender.com/api/restore-backup
```

#### Problema: JSON Corrompido
```bash
# 1. Verificar integridade
curl https://seu-backend.onrender.com/api/status

# 2. Restaurar backup
curl -X POST https://seu-backend.onrender.com/api/restore-backup

# 3. Verificar novamente
curl https://seu-backend.onrender.com/api/status
```

### 📝 Checklist de Testes

#### Antes do Deploy
- [ ] Teste local funcionando
- [ ] Status do banco OK
- [ ] Backup automático configurado

#### Após o Deploy
- [ ] Status do banco em produção OK
- [ ] Criação de dados funcionando
- [ ] Dados persistem após operações
- [ ] Backup manual funcionando
- [ ] Sincronização manual funcionando

#### Após Reinicialização
- [ ] Dados ainda existem
- [ ] Status do banco OK
- [ ] Operações de escrita funcionando
- [ ] Backup automático funcionando

### 🎯 Teste Final Completo

1. **Deploy no Render**
2. **Executar teste completo**: `npm run test-full`
3. **Verificar logs no Render**
4. **Testar manualmente** algumas operações
5. **Reinicializar servidor** no Render
6. **Verificar se dados persistiram**

### 📞 Monitoramento Contínuo

#### Logs Importantes
- `[DB-MANAGER]` - Operações de persistência
- `Salvando dados após POST/PUT/PATCH/DELETE` - Persistência automática
- `Backup criado com sucesso` - Backup automático

#### Alertas
- Arquivo temporário não existe
- JSON corrompido
- Erro ao salvar dados
- Backup falhou

### 🔧 Configuração de Testes

#### Variáveis de Ambiente
```bash
# Para teste local
TEST_URL=http://localhost:3000

# Para teste em produção
TEST_URL=https://seu-backend.onrender.com
```

#### Scripts Disponíveis
```bash
npm run test          # Teste rápido
npm run test-full     # Teste completo
npm run test-local    # Teste local
npm run test-prod     # Teste produção
```

---

**💡 Dica**: Execute os testes regularmente, especialmente após mudanças no código ou reinicializações do servidor! 