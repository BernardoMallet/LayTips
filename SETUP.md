# SETUP COMPLETO

## ✅ O que foi implementado

### Arquitetura Completa
- [x] Monorepo com Yarn workspaces
- [x] Tipagem TypeScript compartilhada
- [x] Motor de análise de filtros
- [x] Motor RACE para visualização
- [x] Backend NestJS com integração API-Football
- [x] Frontend React com Vite + Tailwind

### Componentes & Funcionalidades
- [x] Motor de análise (Lay 0x0 + Lay Favorito)
- [x] Cálculo de confiança
- [x] Ordenação automática de partidas
- [x] Visualização RACE com últimos 10 jogos
- [x] Interface estilo SofaScore (dark mode)
- [x] Cache em memória (5 min)
- [x] Atualização dinâmica

---

## 🚀 Próximos Passos

### 1. Setup Inicial
```bash
# Instalar dependências
yarn install

# Configurar API-Football
# Ir para: https://api-football.com/
# Pegar sua RAPIDAPI_KEY
# Editar .env.local:
RAPIDAPI_KEY=sua_chave_aqui
```

### 2. Rodar em Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd apps/backend
yarn dev
# Estará em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
yarn dev
# Estará em http://localhost:3000
```

### 3. Testar a Aplicação

1. Abrir `http://localhost:3000`
2. Verificar "Health check" da API
3. Clicar em "Atualizar Agora" para buscar partidas
4. Clicar em um card para ver detalhes

---

## 📂 Estrutura de Arquivos

### Backend
```
apps/backend/src/
├── main.ts                  # Bootstrap
├── app.module.ts            # Módulo principal
├── analysis.controller.ts   # Endpoints HTTP
├── analysis.service.ts      # Lógica de análise
└── api-football.service.ts  # Integração com API
```

### Frontend
```
apps/frontend/src/
├── main.tsx                 # Bootstrap React
├── App.tsx                  # Componente principal
├── components/
│   ├── MatchCard.tsx       # Card de partida
│   ├── MatchDetail.tsx     # Detalhes completos
│   ├── RaceVisualization.tsx # RACE visual
│   └── ui/                 # Componentes base
├── hooks/
│   └── useMatches.ts       # Hook de dados
└── services/
    └── api.ts              # Cliente HTTP
```

### Packages
```
packages/
├── shared-types/           # Tipos TypeScript
├── filters/               # Motor de análise
├── race-engine/           # Visualização RACE
└── ui/                    # Componentes compartilhados
```

---

## 🔍 Fluxo de Dados

```
1. Frontend carrega App
   ↓
2. Hook useMatches() dispara GET /api/matches/today
   ↓
3. Backend (analysis.controller) recebe requisição
   ↓
4. AnalysisService chama API-Football
   ↓
5. Para cada partida:
   - Busca últimos 10 jogos de cada equipe
   - Calcula estatísticas (gols, HT, Over 1.5)
   - Aplica filtros (checkLay00 / checkLayFavorite)
   - Calcula confiança
   ↓
6. Ordena por: horário → método → média ofensiva
   ↓
7. Retorna JSON com partidas elegíveis
   ↓
8. Frontend renderiza cards com RACE visual
```

---

## 🧪 Testando os Métodos

### Testar Lay 0x0
```typescript
const homeStats = {
  goalsAvg65: 0.9,      // >= 0.85 ✓
  htGoalRate: 85,       // >= 80% ✓
  over15Rate: 90,       // >= 85% ✓
  // ... outros campos
};

const awayStats = {
  goalsAvg65: 0.88,
  htGoalRate: 82,
  over15Rate: 88,
  // ... outros campos
};

const isEligible = checkLay00(homeStats, awayStats);
// isEligible === true
```

### Testar Lay Favorito
```typescript
const favoriteStats = {
  goalsAvg70: 0.87,        // >= 0.85 ✓
  // ... outros campos
};

const opponentStats = {
  concededAvg65: 0.88,     // >= 0.85 ✓
  // ... outros campos
};

const isEligible = checkLayFavorite(favoriteStats, opponentStats);
// isEligible === true
```

---

## 📊 Estrutura de Dados

### Match (Partida)
```typescript
{
  id: string;
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  kickoff: Date;
  league: string;
  method: "LAY_00" | "LAY_FAVORITE";
  confidence: 0-100;
  homeStats: TeamStats;
  awayStats: TeamStats;
  criteria: { ... };
}
```

### TeamStats (Estatísticas da Equipe)
```typescript
{
  goalsAvg65: number;        // Média até 65 min
  goalsAvg70: number;        // Média até 70 min
  concededAvg65: number;     // Sofre até 65 min
  concededAvg70: number;     // Sofre até 70 min
  htGoalRate: number;        // % HT Goals
  over15Rate: number;        // % Over 1.5
  scoredFrequency: number;   // % jogos marcou
  scoredTimeline: number[];     // Gols últimos 10
  concededTimeline: number[]; // Sofreu últimos 10
  lastMatches: SimpleMatch[];   // Últimos 10 jogos
}
```

---

## 🔄 Melhorias Futuras

### Curto Prazo
- [ ] Integração com reais eventos de minuto
- [ ] Histórico de análises
- [ ] Sistema de alertas
- [ ] Melhor tratamento de erros

### Médio Prazo
- [ ] Banco de dados (PostgreSQL)
- [ ] Sistema de notificações (email, SMS)
- [ ] API pública
- [ ] Integração Telegram

### Longo Prazo
- [ ] Machine Learning para melhorar filtros
- [ ] Mobile app nativa
- [ ] Histórico completo de ROI
- [ ] Sistema de assinaturas

---

## 🆘 Troubleshooting

### "Cannot find module @laytips/*"
- Executar `yarn install` novamente
- Limpar node_modules: `rm -rf node_modules yarn.lock`
- Reinstalar: `yarn install`

### API retorna 401
- Verifique se sua RAPIDAPI_KEY está correta em .env.local
- Verifique se tem créditos na API-Football

### Frontend não conecta ao backend
- Certifique-se que backend está rodando (porta 3001)
- Verifique se o proxy em vite.config.ts está correto

### Compilação falha
- Verifique erro de TypeScript: `yarn type-check`
- Lint: `yarn lint`

---

## 📚 Documentação Adicional

- [API-Football Docs](https://api-football.com/)
- [NestJS Docs](https://docs.nestjs.com/)
- [React Docs](https://react.dev/)
- [Tailwind Docs](https://tailwindcss.com/)

---

**Desenvolvido com ❤️ para traders de lay**
