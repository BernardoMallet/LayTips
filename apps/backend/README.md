# Backend - API LayTips

API NestJS para análise e processamento de dados de jogos de futebol.

## Variáveis de Ambiente

```
RAPIDAPI_KEY=seu_api_key_aqui
RAPIDAPI_HOST=api-football-v1.p.rapidapi.com
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Scripts

- `npm run dev` - Inicia em modo desenvolvimento com watch
- `npm run build` - Build para produção
- `npm start` - Inicia o servidor

## Endpoints

- `GET /api/health` - Health check
- `GET /api/matches/today` - Lista diária de partidas
- `GET /api/matches/detail?id=<matchId>` - Detalhes de uma partida

## Estrutura

- `api-football.service.ts` - Integração com API-Football
- `analysis.service.ts` - Lógica de análise e filtros
- `analysis.controller.ts` - Endpoints HTTP
