import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import type {
  Match,
  TeamStats,
  DailyMatches,
  SimpleMatch,
} from "@laytips/shared-types";
import { FootyStatsService } from "@laytips/footystats";
import {
  analyzeMatch,
  calculateConfidence,
  sortMatches,
} from "@laytips/filters";

@Injectable()
export class AnalysisService {
  private dailyMatchesCache: DailyMatches | null = null;
  private lastUpdate: Date = new Date(0);

  constructor(
    private readonly footyStats: FootyStatsService
  ) {}

  /**
   * Processa uma partida individual
   */
  private async processMatch(
    fixture: any
  ): Promise<Match | null> {
    try {
      // Buscar stats das equipes
      const homeStats =
        await this.footyStats.getTeamStats(
          fixture.home_team_id,
          fixture.home_team
        );
      const awayStats =
        await this.footyStats.getTeamStats(
          fixture.away_team_id,
          fixture.away_team
        );

      // Analisar método
      const method = analyzeMatch(homeStats, awayStats);

      if (!method) {
        return null; // Não qualifica
      }

      const match: Match = {
        id: `${fixture.fixture_id}-${Date.now()}`,
        fixtureId: fixture.fixture_id,
        homeTeam: fixture.home_team,
        awayTeam: fixture.away_team,
        kickoff: new Date(fixture.date),
        league: fixture.league,
        method,
        confidence: calculateConfidence(
          homeStats,
          awayStats,
          method
        ),
        homeStats,
        awayStats,
        criteria: {
          lay00:
            method === "LAY_00"
              ? {
                  goalsAvg65Met:
                    Math.max(
                      homeStats.goalsAvg65,
                      awayStats.goalsAvg65
                    ) >= 0.85,
                  htGoalRateMet:
                    homeStats.htGoalRate >= 80 &&
                    awayStats.htGoalRate >= 80,
                  over15RateMet:
                    homeStats.over15Rate >= 85 &&
                    awayStats.over15Rate >= 85,
                }
              : undefined,
          layFavorite:
            method === "LAY_FAVORITE"
              ? {
                  favoriteGoalsAvg70Met:
                    Math.max(
                      homeStats.goalsAvg70,
                      awayStats.goalsAvg70
                    ) >= 0.85,
                  opponentConcededAvg65Met:
                    Math.min(
                      homeStats.concededAvg65,
                      awayStats.concededAvg65
                    ) >= 0.85,
                }
              : undefined,
        },
        collectedAt: new Date(),
      };

      return match;
    } catch (error) {
      console.error(
        `Erro ao processar fixture ${fixture.fixture_id}:`,
        error
      );
      return null;
    }
  }

  /**
   * Gera lista diária (executado de hora em hora)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async generateDailyMatches(): Promise<DailyMatches> {
    try {
      console.log("🔄 Atualizando lista diária...");

      const fixtures =
        await this.footyStats.getFixturesToday();

      const processedMatches: Match[] = [];

      for (const fixture of fixtures) {
        const match = await this.processMatch(fixture);
        if (match) {
          processedMatches.push(match);
        }
      }

      const sortedMatches = sortMatches(processedMatches);

      const dailyMatches: DailyMatches = {
        date: new Date(),
        matches: sortedMatches,
        totalCount: sortedMatches.length,
        updatedAt: new Date(),
      };

      this.dailyMatchesCache = dailyMatches;
      this.lastUpdate = new Date();

      console.log(
        `✅ Lista atualizada: ${sortedMatches.length} partidas`
      );

      return dailyMatches;
    } catch (error) {
      console.error("Erro ao gerar lista diária:", error);
      throw error;
    }
  }

  /**
   * Retorna cache ou regenera
   */
  async getDailyMatches(
    skipCache: boolean = false
  ): Promise<DailyMatches> {
    if (!skipCache && this.dailyMatchesCache) {
      return this.dailyMatchesCache;
    }

    return this.generateDailyMatches();
  }

  /**
   * Retorna info do cache
   */
  getCacheInfo(): {
    cached: boolean;
    totalMatches: number;
    lastUpdate: Date;
  } {
    return {
      cached: !!this.dailyMatchesCache,
      totalMatches: this.dailyMatchesCache?.totalCount || 0,
      lastUpdate: this.lastUpdate,
    };
  }

  /**
   * Limpa cache
   */
  clearCache(): void {
    this.dailyMatchesCache = null;
    this.footyStats.clearCache();
  }
}
