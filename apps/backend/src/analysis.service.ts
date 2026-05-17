import { Injectable } from "@nestjs/common";
import type {
  Match,
  TeamStats,
  DailyMatches,
  SimpleMatch,
  APIFootballFixture,
} from "@laytips/shared-types";
import { ApiFootballService } from "./api-football.service";
import {
  analyzeMatch,
  calculateConfidence,
  sortMatches,
} from "@laytips/filters";
import { buildRACEData } from "@laytips/race-engine";

@Injectable()
export class AnalysisService {
  private dailyMatchesCache: DailyMatches | null = null;

  constructor(
    private readonly apiFootballService: ApiFootballService
  ) {}

  /**
   * Busca os últimos 10 jogos de uma equipe e calcula as estatísticas
   */
  private async calculateTeamStats(
    teamId: number,
    teamName: string,
    limit: number = 10
  ): Promise<TeamStats> {
    try {
      const matches =
        await this.apiFootballService.getTeamLastMatches(
          teamId,
          limit
        );

      const lastMatches: SimpleMatch[] = matches.map(
        (match: APIFootballFixture) => ({
          date: match.fixture.date,
          homeTeam: match.teams.home.name,
          awayTeam: match.teams.away.name,
          homeGoals: match.goals.home || 0,
          awayGoals: match.goals.away || 0,
          league: match.league.name,
        })
      );

      // Simula cálculo de gols marcados/sofridos (em produção, parse eventos)
      const isHome = Math.random() > 0.5;

      const scoredTimeline = matches.map((m: APIFootballFixture) =>
        isHome ? (m.goals.home || 0) : (m.goals.away || 0)
      );
      const concededTimeline = matches.map((m: APIFootballFixture) =>
        isHome ? (m.goals.away || 0) : (m.goals.home || 0)
      );

      const goalsAvg65 =
        scoredTimeline.reduce((a, b) => a + b, 0) / limit;
      const goalsAvg70 = goalsAvg65; // Simplificado
      const concededAvg65 =
        concededTimeline.reduce((a, b) => a + b, 0) / limit;
      const concededAvg70 = concededAvg65; // Simplificado

      const matchesWithGoals = scoredTimeline.filter(
        (g) => g > 0
      ).length;
      const htGoalRate = (matchesWithGoals / limit) * 100;

      const matchesWithOver15 = matches.filter(
        (m: APIFootballFixture) =>
          (m.goals.home || 0) + (m.goals.away || 0) >= 2
      ).length;
      const over15Rate = (matchesWithOver15 / limit) * 100;

      return {
        goalsAvg65,
        goalsAvg70,
        concededAvg65,
        concededAvg70,
        htGoalRate,
        over15Rate,
        scoredFrequency: (matchesWithGoals / limit) * 100,
        scoredTimeline,
        concededTimeline,
        scoredDistribution: {
          "0-15": 0,
          "16-30": 0,
          "31-45": 0,
          "46-60": 0,
          "61-75": 0,
          "76-90": 0,
        },
        concededDistribution: {
          "0-15": 0,
          "16-30": 0,
          "31-45": 0,
          "46-60": 0,
          "61-75": 0,
          "76-90": 0,
        },
        lastMatches,
      };
    } catch (error) {
      console.error(
        `Erro ao calcular stats do time ${teamId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Processa uma partida individual e extrai todas as estatísticas
   */
  private async processMatch(
    fixture: APIFootballFixture
  ): Promise<Match | null> {
    try {
      const homeTeamId = fixture.teams.home.id;
      const awayTeamId = fixture.teams.away.id;

      const homeStats = await this.calculateTeamStats(
        homeTeamId,
        fixture.teams.home.name
      );
      const awayStats = await this.calculateTeamStats(
        awayTeamId,
        fixture.teams.away.name
      );

      const method = analyzeMatch(homeStats, awayStats);

      if (!method) {
        return null; // Partida não se qualifica
      }

      const match: Match = {
        id: `${fixture.fixture.id}-${Date.now()}`,
        fixtureId: fixture.fixture.id,
        homeTeam: fixture.teams.home.name,
        awayTeam: fixture.teams.away.name,
        kickoff: new Date(fixture.fixture.date),
        league: fixture.league.name,
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
        `Erro ao processar partida ${fixture.fixture.id}:`,
        error
      );
      return null;
    }
  }

  /**
   * Gera a lista diária de partidas elegíveis
   */
  async generateDailyMatches(): Promise<DailyMatches> {
    try {
      const fixtures =
        await this.apiFootballService.getFixturesToday();

      const processedMatches: Match[] = [];

      // Processa cada partida
      for (const fixture of fixtures) {
        const match = await this.processMatch(fixture);
        if (match) {
          processedMatches.push(match);
        }
      }

      // Ordena conforme regra: horário, método, média ofensiva
      const sortedMatches = sortMatches(processedMatches);

      const dailyMatches: DailyMatches = {
        date: new Date(),
        matches: sortedMatches,
        totalCount: sortedMatches.length,
        updatedAt: new Date(),
      };

      this.dailyMatchesCache = dailyMatches;
      return dailyMatches;
    } catch (error) {
      console.error("Erro ao gerar lista diária:", error);
      throw error;
    }
  }

  /**
   * Retorna o cache ou regenera se expirou
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
   * Limpa o cache (útil para testes ou atualização forçada)
   */
  clearCache(): void {
    this.dailyMatchesCache = null;
  }
}
