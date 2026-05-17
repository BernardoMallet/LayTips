# API Backend - LayTips

API NestJS que consome FootyStats API e fornece análises filtradas.

## Variáveis de Ambiente

```
FOOTYSTATS_API_KEY=sua_chave_aqui
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5174
```

## Scripts

- `npm run dev` - Desenvolvimento com watch
- `npm run build` - Build
- `npm start` - Produção

## Endpoints

- `GET /api/health` - Health check + cache info
- `GET /api/matches/today` - Lista diária
- `GET /api/matches/detail?id=<matchId>` - Detalhes
- `GET /api/cache/info` - Info do cache

## Features

- ✅ Atualização automática a cada hora (Cron)
- ✅ Cache em memória (5 min)
- ✅ Integração FootyStats
- ✅ Filtros automáticos (Lay 0x0 + Lay Favorito)
- ✅ Cálculo de confiança
