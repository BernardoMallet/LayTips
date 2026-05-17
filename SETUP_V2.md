# SETUP - LayTips v2 com FootyStats + Telegram Bot

## ✅ O que foi implementado - NOVA VERSÃO

### Arquitetura Nova
- [x] Renomeado: `apps/backend` → `apps/api`
- [x] Renomeado: `apps/frontend` → `apps/web`
- [x] **Novo**: `apps/telegram-bot` com Telegraf.js
- [x] **Novo**: `packages/footystats` (integração FootyStats)
- [x] API-Football **substituída por FootyStats**
- [x] Cron jobs para atualização automática

### Telegram Bot
- [x] Envio automático em schedule
- [x] Formatação em HTML
- [x] Grouping por método (Lay 0x0 / Lay Favorito)
- [x] Limite de 5 partidas por método
- [x] Status + timestamp

### Novo Stack
- **Backend**: NestJS + @nestjs/schedule (cron)
- **API dados**: FootyStats (gols por minuto já disponibles)
- **Bot**: Telegraf.js + schedule

---

## 🚀 Setup Inicial

### 1. Pré-requisitos

```bash
# Node 18+
node -v

# Yarn
yarn -v

# Instalar dependencies
yarn install
```

### 2. Credenciais Necessárias

#### FootyStats API
1. Ir para https://footystats.org/api
2. Registrar e pegar API key
3. Adicionar em `.env.local`: `FOOTYSTATS_API_KEY=sua_chave`

#### Telegram Bot
1. Conversar com [@BotFather](https://t.me/botfather) no Telegram
2. Comando: `/newbot`
3. Seguir as instruções
4. Copiar o token

5. Pegar seu Chat ID:
   - Conversar com [@userinfobot](https://t.me/userinfobot)
   - Copiar seu ID

6. Adicionar em `.env.local`:
   ```
   TELEGRAM_BOT_TOKEN=seu_token
   TELEGRAM_CHAT_ID=seu_id
   ```

### 3. Configurar .env.local

```bash
# Copiar template
cp .env.example .env.local

# Editar e preencher:
FOOTYSTATS_API_KEY=sua_chave_aqui
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_CHAT_ID=seu_id_aqui
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
VITE_API_BASE_URL=http://localhost:3001/api
API_URL=http://localhost:3001
```

---

## 🎮 Rodar em Desenvolvimento

### Opção 1: Todos os apps juntos

```bash
yarn dev

# Isso executa:
# - API em http://localhost:3001
# - Web em http://localhost:5173
# - Bot em background
```

### Opção 2: Individualmente

```bash
# Terminal 1 - API Backend
yarn dev:api
# http://localhost:3001
# Endpoints: /api/health, /api/matches/today

# Terminal 2 - Web Frontend  
yarn dev:web
# http://localhost:5173
# Dashboard com lista diária

# Terminal 3 - Telegram Bot
yarn dev:bot
# Envia para Telegram conforme schedule
```

---

## 🔄 Fluxo de Operação

```
1. Backend (API) inicia
   ↓
2. Atualização automática via Cron (a cada hora)
   ↓
3. Busca FootyStats
   ↓
4. Filtra (Lay 0x0 + Lay Favorito)
   ↓
5. Armazena em cache (5 min)
   ├→ Web acessa via GET /api/matches/today
   └→ Bot envia para Telegram (schedule: 08, 12, 16, 20h)
```

---

## 📊 Teste Manual

### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2026-05-17T...",
  "cache": {
    "cached": true,
    "totalMatches": 5,
    "lastUpdate": "2026-05-17T..."
  }
}
```

### 2. Listar Partidas

```bash
curl http://localhost:3001/api/matches/today
```

### 3. Abrir UI

```
http://localhost:5173
```

### 4. Telegram Bot

- Bot envia mensagens automaticamente
- Horários: 08:00, 12:00, 16:00, 20:00
- Ou envie `/start` para o bot

---

## 🏗️ Arquitetura Nova

### Apps

| App | Port | Descrição |
|-----|------|-----------|
| `@laytips/api` | 3001 | NestJS + FootyStats |
| `@laytips/web` | 5173 | React UI |
| `@laytips/telegram-bot` | - | Telegraf Bot (async) |

### Packages

| Package | Descrição |
|---------|-----------|
| `@laytips/shared-types` | Tipos TypeScript |
| `@laytips/filters` | Motor de análise |
| `@laytips/race-engine` | Visualização RACE |
| `@laytips/footystats` | Integração FootyStats |
| `@laytips/utils` | Utilitários |

---

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
yarn dev              # Todos os apps
yarn dev:api          # Só backend
yarn dev:web          # Só frontend
yarn dev:bot          # Só bot

# Build
yarn build            # Todos
yarn build:api        # Só backend
yarn build:web        # Só frontend
yarn build:bot        # Só bot

# Produção
yarn start            # Todos os apps
yarn start --prefix apps/api       # Só backend
yarn start --prefix apps/web       # Só frontend
yarn start --prefix apps/telegram-bot  # Só bot

# Qualidade
yarn lint            # ESLint
yarn type-check      # TypeScript check
```

---

## 🆘 Troubleshooting

### "FOOTYSTATS_API_KEY não configurada"
- Verificar `.env.local`
- Restart do servidor

### Bot não envia mensagem
- Verificar `TELEGRAM_BOT_TOKEN`
- Verificar `TELEGRAM_CHAT_ID`
- Verificar se API está rodando (http://localhost:3001)

### API não conecta FootyStats
- Verificar `FOOTYSTATS_API_KEY`
- Testar rate limiting
- Verificar resposta: `curl https://api.footystats.org/v1/...`

### Compilação falha
```bash
# Limpar e reinstalar
rm -rf node_modules yarn.lock
yarn install

# Check
yarn type-check
yarn lint
```

---

## 🚀 Deploy

### Backend + Bot → Railway.app ou Render.com
```bash
# Build
yarn build

# Deploy com env vars:
# - FOOTYSTATS_API_KEY
# - TELEGRAM_BOT_TOKEN
# - TELEGRAM_CHAT_ID
```

### Frontend → Vercel
```bash
yarn build:web
# Deploy pasta apps/web/dist para Vercel
```

---

## 📚 Documentação Adicional

- `docs_3` - Referência técnica (FootyStats)
- `docs_1` - Especificação dos métodos
- `apps/api/README.md` - Backend specifics
- `apps/web/README.md` - Frontend specifics
- `apps/telegram-bot/README.md` - Bot specifics

---

**v2.0 - FootyStats + Telegram integrado ✅**
