# LayTips - Plataforma de Radar Diário de Jogos

**Radar estatístico automático para identificar diariamente partidas com alta tendência de gols, baseado em FootyStats API.**

## 🎯 Visão Geral

LayTips analisa em tempo real partidas de futebol para identificar oportunidades de "Lay" (apostas contra) baseado em:

- **Lay 0x0**: Encontrar partidas com forte tendência de sair gol
- **Lay Favorito**: Identificar reação do favorito contra times que sofrem gols

Envia automaticamente a lista diária para **Telegram Bot**.

## 🚀 Quick Start

### Pré-requisitos

- Node.js 18+
- Yarn
- FootyStats API key (https://footystats.org/api)
- Telegram Bot Token (via @BotFather)

### Instalação

```bash
# Clonar e instalar
git clone <repo>
cd LayTips
yarn install

# Copiar e configurar .env
cp .env.example .env.local
# Editar com suas credenciais:
# - FOOTYSTATS_API_KEY
# - TELEGRAM_BOT_TOKEN
# - TELEGRAM_CHAT_ID
```

### Desenvolvimento

```bash
# Rodar todos os apps (api + web + bot)
yarn dev

# Ou rodar individualmente:
yarn dev:api      # API em 3001
yarn dev:web      # Web em 5173
yarn dev:bot      # Bot em background
```

### Build & Produção

```bash
# Build
yarn build

# Rodar em produção
yarn start
```

## 📁 Estrutura do Projeto

```
LayTips/
├── apps/
│   ├── api/              # NestJS API (port 3001)
│   ├── web/              # React Frontend (port 5173)
│   └── telegram-bot/     # Telegraf Bot
│
├── packages/
│   ├── shared-types/     # Tipos TypeScript
│   ├── filters/          # Motor de análise
│   ├── race-engine/      # Visualização RACE
│   ├── footystats/       # Integração FootyStats
│   └── utils/            # Utilitários
│
└── docs_*               # Documentação
```

## 🔧 Stack

### Backend
- **NestJS** - Framework Node.js
- **FootyStats API** - Dados esportivos
- **@nestjs/schedule** - Cron jobs

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos

### Telegram
- **Telegraf.js** - Bot framework

### Compartilhado
- **TypeScript** - Type safety
- **Yarn workspaces** - Monorepo

## 🎮 Funcionalidades

### MVP

- [x] Lista diária de partidas elegíveis
- [x] Filtros automáticos (Lay 0x0 + Lay Favorito)
- [x] Visual estilo SofaScore
- [x] Visualização RACE (últimos 10 jogos)
- [x] Cards operacionais com métricas
- [x] Ordenação automática
- [x] Cache em memória (5 min)
- [x] **Envio automático para Telegram**
- [x] Schedule de atualização (cron)

### Métodos de Análise

#### Lay 0x0
```
✓ Uma das equipes: média gols 65' >= 0.85
✓ Ambas: HT Goals >= 80%
✓ Ambas: Over 1.5 >= 85%
```

#### Lay Favorito
```
✓ Favorito: gols até 70' >= 0.85
✓ Adversário: sofre 65' >= 0.85
```

## 🔄 Fluxo de Dados

```
FootyStats API
    ↓
API Backend (NestJS)
    ↓
Motor de Filtros
    ↓
Cache em Memória
    ├→ Frontend (React UI)
    └→ Telegram Bot (Mensagens)
```

## 🔌 Endpoints da API

```
GET  /api/health              # Health check + cache info
GET  /api/matches/today       # Lista diária
GET  /api/matches/detail      # Detalhes de partida
GET  /api/cache/info          # Info do cache
```

## 📱 Apps

### `apps/api` - Backend
- Consome FootyStats
- Aplica filtros
- Fornece dados para web + bot

### `apps/web` - Frontend
- Dashboard com lista diária
- Visualização RACE
- Atualização dinâmica

### `apps/telegram-bot` - Bot
- Envia lista automática
- Schedule: 08:00, 12:00, 16:00, 20:00
- Formatação de mensagens

## 🛠️ Desenvolvimento

### Adicionar novo método de análise

1. Editar `packages/filters/src/index.ts`
2. Implementar função `checkNewMethod()`
3. Atualizar tipos em `packages/shared-types/src/index.ts`

### Modificar integração FootyStats

1. Editar `packages/footystats/src/index.ts`
2. Testar com `apps/api`

## 🎨 Design

Interface inspirada em:
- **SofaScore** (dark mode, cards, operacional)
- **Radar Esportivo** (velocidade, poucos cliques)

## 📊 Visualização RACE

```
[🟢🟢🟢🔴🟢🟢🟢🔴🟢🟢]

🟢 Marcou
🔴 Sofreu
⚪ Ambos
⚫ Nenhum
```

## 📈 Roadmap

### Fase 2
- [ ] Banco de dados (PostgreSQL)
- [ ] Histórico completo
- [ ] Estatísticas de ROI
- [ ] Notificações avançadas (email, SMS)
- [ ] Dashboard de performance

### Fase 3
- [ ] IA para melhoramento
- [ ] Mobile app
- [ ] API pública
- [ ] Sistema de assinaturas

## 📝 Licença

MIT

---

**Desenvolvido com ❤️ para traders de lay**