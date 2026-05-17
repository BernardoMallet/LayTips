/**
 * Integração com FootyStats API
 * https://footystats.org/api
 */

import axios from "axios";
import type {
  Match,
  TeamStats,
  SimpleMatch,
} from "@laytips/shared-types";

const API_BASE_URL = "https://api.footystats.org/v1";

interface FootyStatsTeamStats {
  team_id: number;
  team_name: string;
  goals_for: number;
  goals_against: number;
  goals_for_65: number;
  goals_against_65: number;
  ht_goals_percentage: number;
  over_15_percentage: number;
  btts_percentage: number;
  last_10: FootyStatsMatch[];
}

interface FootyStatsMatch {
  date: string;
  home_team: string;
  away_team: string;
  home_goals: number;
  away_goals: number;
  league: string;
}

interface FootyStatsFixture {
  fixture_id: number;
  date: string;
  time: string;
  home_team: string;
  away_team: string;
  league: string;
  season: number;
}

export class FootyStatsService {
  private apiKey: string;
  private cache: Map<
    string,
    { data: any; timestamp: number }
  > = new Map();

  private readonly CACHE_DURATION =
    5 * 60 * 1000; // 5 minutos

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    if (!apiKey) {
      throw new Error(
        "FOOTYSTATS_API_KEY não configurada"
      );
    }
  }

  private getHeaders() {
    return {
      "X-API-Key": this.apiKey,
      "Content-Type": "application/json",
    };
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Busca os jogos de hoje
   */
  async getFixturesToday(): Promise<FootyStatsFixture[]> {
    const cacheKey = "fixtures-today";
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const today = new Date()
        .toISOString()
        .split("T")[0];

      const response = await axios.get(
        `${API_BASE_URL}/fixtures`,
        {
          params: { date: today },
          headers: this.getHeaders(),
        }
      );

      const fixtures = response.data.data || [];
      this.cache.set(cacheKey, {
        data: fixtures,
        timestamp: Date.now(),
      });

      return fixtures;
    } catch (error) {
      console.error(
        "Erro ao buscar fixtures de hoje:",
        error
      );
      throw error;
    }
  }

  /**
   * Busca estatísticas de uma equipe
   */
  async getTeamStats(
    teamId: number,
    teamName: string
  ): Promise<TeamStats> {
    const cacheKey = `team-stats-${teamId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/teams/${teamId}/stats`,
        {
          headers: this.getHeaders(),
        }
      );

      const data: FootyStatsTeamStats =
        response.data.data;

      const lastMatches: SimpleMatch[] = data.last_10.map(
        (m) => ({
          date: m.date,
          homeTeam: m.home_team,
          awayTeam: m.away_team,
          homeGoals: m.home_goals,
          awayGoals: m.away_goals,
          league: m.league,
        })
      );

      // Calcula distribuição por minuto (aproximada)
      const scoredTimeline = data.last_10.map(
        (m, idx) =>
          m.home_team === teamName
            ? m.home_goals
            : m.away_goals
      );
      const concededTimeline = data.last_10.map(
        (m, idx) =>
          m.home_team === teamName
            ? m.away_goals
            : m.home_goals
      );

      const stats: TeamStats = {
        goalsAvg65:
          data.goals_for_65 / data.last_10.length,
        goalsAvg70:
          (data.goals_for / data.last_10.length) * 0.9, // Estimativa
        concededAvg65:
          data.goals_against_65 /
          data.last_10.length,
        concededAvg70:
          (data.goals_against / data.last_10.length) *
          0.9,
        htGoalRate: data.ht_goals_percentage,
        over15Rate: data.over_15_percentage,
        scoredFrequency:
          (scoredTimeline.filter((g) => g > 0).length /
            data.last_10.length) *
          100,
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

      this.cache.set(cacheKey, {
        data: stats,
        timestamp: Date.now(),
      });

      return stats;
    } catch (error) {
      console.error(
        `Erro ao buscar stats da equipe ${teamId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Limpa o cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
