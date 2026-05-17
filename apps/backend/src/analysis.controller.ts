import { Controller, Get, Query } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";
import type { DailyMatches, Match } from "@laytips/shared-types";

@Controller("api")
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  /**
   * GET /api/matches/today
   * Retorna a lista de partidas do dia filtradas
   */
  @Get("matches/today")
  async getMatchesToday(
    @Query("refresh") refresh?: string
  ): Promise<DailyMatches> {
    return this.analysisService.getDailyMatches(
      refresh === "true"
    );
  }

  /**
   * GET /api/matches/detail/:id
   * Retorna detalhes de uma partida específica com RACE
   */
  @Get("matches/detail")
  async getMatchDetail(
    @Query("id") matchId: string
  ): Promise<{ match: Match; message: string }> {
    const matches = await this.analysisService.getDailyMatches();
    const match = matches.matches.find((m) => m.id === matchId);

    if (!match) {
      return {
        match: null,
        message: "Match not found",
      };
    }

    return {
      match,
      message: "Match details retrieved successfully",
    };
  }

  /**
   * GET /api/health
   * Health check
   */
  @Get("health")
  getHealth() {
    return {
      status: "OK",
      timestamp: new Date(),
    };
  }
}
