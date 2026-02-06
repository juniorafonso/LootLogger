# 📋 Plano de Auto-Sync e Release Automatizado

## 🎯 Objetivo
Criar um sistema automatizado que verifica a cada 6 horas se o arquivo `items-fallback.js` está sincronizado com o arquivo original do repositório ao-data, e automaticamente:
1. Atualiza o fallback se necessário
2. Incrementa a versão do projeto
3. Gera builds para Windows e Linux
4. Cria uma nova release no GitHub

## 🏗️ Arquitetura da Solução

### 📁 Estrutura dos Workflows
```
.github/workflows/
├── build.yml (existente - modificar)
└── auto-sync.yml (novo - criar)
```

### 🔄 Fluxo do Auto-Sync

#### 1. **Workflow de Sincronização** (`auto-sync.yml`)
- **Trigger**: Cron job a cada 6 horas
- **Trigger manual**: workflow_dispatch para testes
- **Responsabilidades**:
  - Baixar arquivo original do ao-data
  - Comparar com nosso fallback atual
  - Se diferente: atualizar, incrementar versão, criar tag
  - Se igual: não fazer nada

#### 2. **Workflow de Build** (`build.yml`) 
- **Trigger**: Quando nova tag é criada pelo auto-sync
- **Responsabilidades**:
  - Build Windows e Linux
  - Criar release automático

## 📝 Detalhamento Técnico

### 🕕 Schedule do Cron Job
```yaml
schedule:
  - cron: '0 */6 * * *'  # A cada 6 horas
```

### 🔍 Processo de Comparação
1. **Download**: Baixar arquivo do `https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.txt`
2. **Comparação**: Usar hash SHA-256 para comparar conteúdo
3. **Decisão**: Se hash diferir → atualizar, senão → sair

### 📈 Sistema de Versionamento
- **Tipo**: Patch automático (1.2.9 → 1.2.10)
- **Método**: Usar `npm version patch` + ajuste no build.sh
- **Tag**: Criar tag `v{nova_versao}` automaticamente

### 🔧 Modificações Necessárias

#### A. Novo arquivo: `.github/workflows/auto-sync.yml`
```yaml
name: Auto Sync Items Fallback
on:
  schedule:
    - cron: '0 */6 * * *'  # Cada 6 horas
  workflow_dispatch:  # Trigger manual para testes

jobs:
  check-and-sync:
    runs-on: ubuntu-latest
    steps:
    # 1. Checkout do repo
    # 2. Download arquivo original
    # 3. Comparar com fallback atual
    # 4. Se diferente: atualizar, incrementar versão, criar tag
    # 5. Push das mudanças
```

#### B. Modificar: `.github/workflows/build.yml`
- **Remover**: Trigger em pull_request (manter apenas tags)
- **Ajustar**: Versão dinâmica no build.sh
- **Melhorar**: Release notes automáticas

#### C. Modificar: `build.sh`
- **Tornar dinâmico**: Ler versão do package.json
- **Remover hardcode**: Versão "1.2.9.0"

#### D. Criar: Script auxiliar `scripts/sync-items.js`
- **Função**: Baixar, comparar e atualizar fallback
- **Saída**: Exit code 0 (sem mudança) ou 1 (atualizado)

## 🔐 Permissões Necessárias

### GitHub Token
```yaml
permissions:
  contents: write  # Para criar commits e tags
  actions: write   # Para triggerar workflows
```

### Variáveis de Ambiente
- `GITHUB_TOKEN`: Automático do GitHub Actions
- Nenhuma configuração adicional necessária

## 📊 Fluxograma do Processo

```
┌─────────────────┐
│ Cron (6h)       │
└─────────┬───────┘
          │
┌─────────▼───────┐
│ Download items  │
│ do ao-data      │
└─────────┬───────┘
          │
┌─────────▼───────┐
│ Comparar hash   │
│ SHA-256         │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │ Diferente? │
    └─┬───────┬─┘
      │ Sim   │ Não
      │       │
┌─────▼───┐ ┌─▼─────┐
│ Update  │ │ Exit  │
│ files   │ │ (0)   │
└─────┬───┘ └───────┘
      │
┌─────▼───────┐
│ npm version │
│ patch       │
└─────┬───────┘
      │
┌─────▼───────┐
│ git tag     │
│ v{version}  │
└─────┬───────┘
      │
┌─────▼───────┐
│ git push    │
│ + tags      │
└─────┬───────┘
      │
┌─────▼───────┐
│ Trigger     │
│ build.yml   │
└─────────────┘
```

## 🚀 Implementação por Etapas

### **Etapa 1**: Criar script de sincronização
- [ ] `scripts/sync-items.js`
- [ ] Função de download e comparação
- [ ] Atualização do `items-fallback.js`

### **Etapa 2**: Modificar build.sh
- [ ] Versão dinâmica do package.json
- [ ] Remover hardcode de versão

### **Etapa 3**: Criar auto-sync workflow
- [ ] `.github/workflows/auto-sync.yml`
- [ ] Lógica de comparação e atualização
- [ ] Commits automatizados

### **Etapa 4**: Ajustar build workflow
- [ ] Trigger apenas em tags
- [ ] Release notes melhoradas

### **Etapa 5**: Testes
- [ ] Trigger manual do auto-sync
- [ ] Verificar builds automáticas
- [ ] Validar releases

## ⚠️ Considerações e Riscos

### 🔄 Controle de Rate Limit
- GitHub Actions: 2000 minutos/mês (grátis)
- 4 execuções/dia = ~120 execuções/mês
- Consumo baixo, sem risco de limite

### 🛡️ Fallback de Segurança
- Se script de sync falhar: manter fallback atual
- Não quebrar builds existentes
- Logs detalhados para debug

### 📋 Monitoramento
- Actions logs automáticos no GitHub
- Notificações em caso de falha
- Histórico completo de sincronizações

## 📈 Benefícios

1. **🔄 Automatização**: Zero intervenção manual
2. **📊 Dados Atualizados**: Fallback sempre sincronizado
3. **🚀 Releases Rápidas**: Builds automáticas em minutos
4. **📝 Histórico**: Todas as mudanças versionadas
5. **⚡ Eficiência**: Só atualiza quando necessário

---

## ✅ Próximos Passos

1. **Aprovar este plano** ✋
2. **Implementar Etapa 1** (script de sync)
3. **Testar localmente**
4. **Implementar workflows**
5. **Testar end-to-end**
6. **Deploy em produção**

**Tempo estimado**: 2-3 horas de implementação + testes
**Complexidade**: Média
**Risco**: Baixo (não afeta funcionamento atual)