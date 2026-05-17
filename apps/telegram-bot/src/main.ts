/**
 * Main do Telegram Bot
 */

import dotenv from "dotenv";
import { LayTipsBot } from "./bot";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const API_URL =
  process.env.API_URL || "http://localhost:3001";

if (!BOT_TOKEN || !CHAT_ID) {
  console.error(
    "❌ TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID são obrigatórios"
  );
  process.exit(1);
}

const bot = new LayTipsBot(BOT_TOKEN, CHAT_ID);

/**
 * Schedule para enviar lista diária
 * Executar a cada 6 horas ou em horários específicos
 */
async function scheduleDailyUpdate(): Promise<void> {
  try {
    // Buscar dados do backend
    const response = await fetch(`${API_URL}/api/matches/today`);
    const data = await response.json();

    // Enviar para Telegram
    await bot.sendDailyList(data);
  } catch (error) {
    console.error("Erro ao buscar e enviar dados:", error);
  }
}

// Inicia o bot
bot.start().catch(console.error);

// Schedule: executar às 8:00, 12:00, 16:00, 20:00
const hours = [8, 12, 16, 20];

setInterval(() => {
  const now = new Date();
  const currentHour = now.getHours();

  if (hours.includes(currentHour)) {
    const lastMinute = new Date(
      now.getTime() - 1 * 60 * 1000
    ).getHours();

    // Se antes estava em hora diferente, executar agora
    if (!hours.includes(lastMinute)) {
      console.log(`\n📤 Enviando atualizações...`);
      scheduleDailyUpdate();
    }
  }
}, 60 * 1000); // Verificar a cada 1 minuto

console.log("📡 Telegram Bot aguardando atualizações...");

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando bot...");
  await bot.stop();
  process.exit(0);
});
