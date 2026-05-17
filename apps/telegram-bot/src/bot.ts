/**
 * Telegram Bot - LayTips Radar
 * Envia lista diária de partidas elegíveis
 */

import { Telegraf, Context } from "telegraf";
import type { DailyMatches, Match } from "@laytips/shared-types";

export class LayTipsBot {
  private bot: Telegraf;
  private chatId: string;

  constructor(botToken: string, chatId: string) {
    this.bot = new Telegraf(botToken);
    this.chatId = chatId;
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.bot.command("start", (ctx: Context) => {
      ctx.reply(
        `🤖 LayTips Radar Bot\n\nEnviando análises diárias de partidas.`
      );
    });

    this.bot.command("status", (ctx: Context) => {
      ctx.reply("✅ Bot operacional");
    });
  }

  /**
   * Formata uma partida para mensagem do Telegram
   */
  private formatMatch(match: Match): string {
    const kickoff = match.kickoff.toLocaleTimeString(
      "pt-BR",
      { hour: "2-digit", minute: "2-digit" }
    );

    const method =
      match.method === "LAY_FAVORITE"
        ? "💰 Lay Favorito"
        : "⚽ Lay 0x0";

    let message = `<b>${method}</b>\n`;
    message += `${kickoff} \n`;
    message += `<b>${match.homeTeam}</b> x <b>${match.awayTeam}</b>\n`;
    message += `${match.league}\n\n`;

    if (match.method === "LAY_00" && match.criteria.lay00) {
      message += `✅ Gols 65': ${match.homeStats.goalsAvg65.toFixed(2)}\n`;
      message += `✅ HT Goals: ${match.homeStats.htGoalRate.toFixed(0)}%\n`;
      message += `✅ Over 1.5: ${match.homeStats.over15Rate.toFixed(0)}%\n`;
    } else if (
      match.method === "LAY_FAVORITE" &&
      match.criteria.layFavorite
    ) {
      const isFavHome =
        match.homeStats.goalsAvg70 >=
        match.awayStats.goalsAvg70;
      const favStats = isFavHome
        ? match.homeStats
        : match.awayStats;
      const oppStats = isFavHome
        ? match.awayStats
        : match.homeStats;

      message += `✅ Favorito Gols 70': ${favStats.goalsAvg70.toFixed(2)}\n`;
      message += `✅ Sofre 65': ${oppStats.concededAvg65.toFixed(2)}\n`;
    }

    message += `\n<b>Confiança:</b> ${match.confidence}%`;

    return message;
  }

  /**
   * Envia a lista diária para o Telegram
   */
  async sendDailyList(daily: DailyMatches): Promise<void> {
    if (daily.matches.length === 0) {
      await this.bot.telegram.sendMessage(
        this.chatId,
        "📭 Nenhuma partida elegível encontrada para hoje."
      );
      return;
    }

    try {
      // Cabeçalho
      const header = `🔥 <b>RADAR DIÁRIO — ${new Date().toLocaleDateString("pt-BR")}</b>\n\n`;

      // Agrupa por método
      const lay00 = daily.matches.filter(
        (m) => m.method === "LAY_00"
      );
      const layFav = daily.matches.filter(
        (m) => m.method === "LAY_FAVORITE"
      );

      let fullMessage = header;

      // Envia Lay 0x0
      if (lay00.length > 0) {
        fullMessage += `<b>⚽ LAY 0x0 (${lay00.length})</b>\n`;
        fullMessage += `${"─".repeat(30)}\n`;

        for (const match of lay00.slice(0, 5)) {
          // Limite 5 por message
          fullMessage += this.formatMatch(match) + "\n\n";
        }

        fullMessage += "\n";
      }

      // Envia Lay Favorito
      if (layFav.length > 0) {
        fullMessage += `<b>💰 LAY FAVORITO (${layFav.length})</b>\n`;
        fullMessage += `${"─".repeat(30)}\n`;

        for (const match of layFav.slice(0, 5)) {
          // Limite 5 por message
          fullMessage += this.formatMatch(match) + "\n\n";
        }
      }

      fullMessage += `\n📊 Total: ${daily.totalCount} partidas\n`;
      fullMessage += `⏱️ ${new Date().toLocaleTimeString("pt-BR")}`;

      await this.bot.telegram.sendMessage(
        this.chatId,
        fullMessage,
        {
          parse_mode: "HTML",
        }
      );

      console.log(
        `✅ Mensagem enviada para Telegram (${daily.totalCount} partidas)`
      );
    } catch (error) {
      console.error(
        "Erro ao enviar mensagem para Telegram:",
        error
      );
    }
  }

  /**
   * Inicia o bot
   */
  async start(): Promise<void> {
    try {
      await this.bot.launch();
      console.log(`🤖 Telegram Bot iniciado`);
    } catch (error) {
      console.error("Erro ao iniciar bot:", error);
    }
  }

  /**
   * Para o bot
   */
  async stop(): Promise<void> {
    await this.bot.stop();
    console.log(`🤖 Telegram Bot parado`);
  }
}
