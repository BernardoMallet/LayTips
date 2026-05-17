# Telegram Bot - LayTips

Bot automático que envia a lista diária de partidas elegíveis para Telegram.

## Setup

### 1. Criar bot no Telegram

1. Conversar com [@BotFather](https://t.me/botfather)
2. Comando `/newbot`
3. Copiar o token

### 2. Pegar Chat ID

1. Conversar com [@userinfobot](https://t.me/userinfobot)
2. Copiar seu ID de usuário

### 3. Configurar .env

```
TELEGRAM_BOT_TOKEN=seu_token
TELEGRAM_CHAT_ID=seu_id
API_URL=http://localhost:3001
```

## Scripts

- `npm run dev` - Modo desenvolvimento
- `npm run build` - Build
- `npm start` - Produção

## Funcionamento

O bot faz schedule de atualizações às:
- 08:00
- 12:00
- 16:00
- 20:00

E envia a lista diária filtrada para Telegram.
