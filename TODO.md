# TODO & Melhorias

## ✅ Implementado no MVP

### Análise & Filtros
- [x] Método Lay 0x0 (critérios documentados)
- [x] Método Lay Favorito (critérios documentados)
- [x] Cálculo de confiança (0-100%)
- [x] Ordenação por horário → método → média

### Backend
- [x] Consumo de API-Football
- [x] Cache em memória (5 min)
- [x] Endpoints HTTP (health, today, detail)
- [x] Integração NestJS

### Frontend
- [x] Lista de partidas com cards
- [x] Visualização RACE com emojis
- [x] Tela de detalhes
- [x] Dark mode com Tailwind
- [x] Atualização/Refresh manual

### Compartilhado
- [x] Tipos TypeScript centralizados
- [x] Monorepo com workspaces
- [x] Motor de filtros reutilizável
- [x] Motor RACE reutilizável

---

## 📋 Para Implementação Imediata

### Backend
- [ ] Melhorar parsing de eventos (minutos exatos de gols)
- [ ] Implementar filtros opcionais (odd, scored frequency)
- [ ] Adicionar logs estruturados
- [ ] Testes unitários para filtros
- [ ] Rate limiting para API-Football

### Frontend
- [ ] Filtros por método (show/hide Lay 0x0 ou Favorite)
- [ ] Filtro por liga/país
- [ ] Filtro por confiança mínima
- [ ] Dark/Light mode toggle
- [ ] Gráficos com Recharts (distribuição de gols)
- [ ] Toast notifications (sucesso/erro)

### Dados & Cache
- [ ] Persistir cache em localStorage
- [ ] WebSocket para atualizações em tempo real
- [ ] Tratamento de erros de API
- [ ] Fallback quando API está down

---

## 🎯 Fase 2 (Com Database)

### Backend
- [ ] PostgreSQL para histórico
- [ ] Schema com migrations
- [ ] Autenticação JWT
- [ ] Permissões de usuário

### Frontend
- [ ] Sistema de login
- [ ] Dashboard com histórico
- [ ] Gráficos de performance
- [ ] ROI tracker
- [ ] Exportar relatórios

### Features
- [ ] Telegram bot para notificações
- [ ] Email alerts
- [ ] API pública
- [ ] Mobile app
- [ ] Sistema de assinaturas

---

## 🐛 Bugs Conhecidos

- [ ] Timeline de gols está sendo estimada (sem real minutos)
- [ ] Distribuição por minuto não é 100% precisa
- [ ] Não há tratamento para jogos adiados/cancelados
- [ ] Cache não diferencia timezone

---

## ⚡ Performance

### Otimizações Possíveis

```typescript
// 1. Implementar Queue para requisições paralelas
// Atualmente: serial (lento)
// Melhor: Promise.all() com limite

// 2. Adicionar índices no cache por timestamp
// Verificar dados stale

// 3. Compressão de resposta (gzip)

// 4. Lazy loading no frontend
// Carregar detalhes sob demanda

// 5. Workers ( Web Workers)
// Processar filtros em background
```

---

## 📱 Componentes Still Missing

### UI Components Não Criados
- [ ] Pagination
- [ ] Skeleton loading
- [ ] Toast notifications
- [ ] Modal/Dialog
- [ ] Dropdown menus
- [ ] Search input
- [ ] Tabs

### Reutilizáveis de UI
```typescript
// Adicionar ao packages/ui/
export { Badge }
export { Spinner }
export { Alert }
export { Modal }
export { Select }
export { Input }
```

---

## 🧪 Testes

### Unit Tests Faltando
```bash
# Adicionar em packages/filters/__tests__/
checkLay00.test.ts
checkLayFavorite.test.ts
calculateConfidence.test.ts
sortMatches.test.ts

# Adicionar em apps/backend/test/
analysis.service.test.ts
api-football.service.test.ts
```

### E2E Tests
```bash
# Adicionar em apps/frontend/e2e/
matches.spec.ts
detail.spec.ts
```

---

## 🔌 Integração de Dados Real

Atualmente os gols são randomizados. Para melhorar:

```typescript
// Parse de eventos da API
const events = await apiFootball.getFixtureEvents(fixtureId);

events.forEach(event => {
  if (event.type === 'Goal') {
    const minute = event.time.elapsed;
    const teamId = event.team.id;
    
    // Classificar em bucket
    const bucket = getGoalBucket(minute); // "0-15", "16-30", etc
    stats.scoredDistribution[bucket]++;
  }
});
```

---

## 📖 Documentação Faltando

- [ ] API Swagger/OpenAPI
- [ ] Guia de contribuição
- [ ] Architecture Decision Records (ADR)
- [ ] Diagrama de fluxo
- [ ] Video tutorial
- [ ] FAQ

---

## 🚀 Quick Wins (fáceis de fazer)

1. **Adicionar favicon**
   ```html
   <link rel="icon" href="/soccer.svg">
   ```

2. **PWA (Progressive Web App)**
   ```json
   {
     "name": "LayTips",
     "icons": [...],
     "start_url": "/",
     "display": "standalone"
   }
   ```

3. **Preload de fontes**
   ```html
   <link rel="preload" href="/font.woff2" as="font" crossorigin>
   ```

4. **Sitemap.xml** para SEO
5. **robots.txt** para crawlers
6. **Open Graph meta tags**

---

## 💡 Ideias Avançadas

1. **Multi-sport support**
   - Basquete
   - Tênis
   - Outros esportes

2. **Prediction Model**
   - Machine Learning para melhorar confiança
   - Historical accuracy tracking

3. **Marketplace**
   - Vender picks/analyses
   - Premium subscribers

4. **Social Features**
   - Share picks
   - Leaderboard
   - Comments

---

**Priorizar de acordo com demanda e feedback de usuários**
