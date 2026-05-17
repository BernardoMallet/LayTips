import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";
import type {
  APIFootballFixture,
  Match,
  TeamStats,
  DailyMatches,
  SimpleMatch,
} from "@laytips/shared-types";
import {
  analyzeMatch,
  calculateConfidence,
  sortMatches,
} from "@laytips/filters";

const API_BASE_URL = "https://api-football-v1.p.rapidapi.com/v3";

@Injectable()
export class ApiFootballService {
  private cache: Map<string, { data: any; timestamp: number }> =
    new Map();

  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  constructor(private readonly httpService: HttpService) {}

  private getAuthHeaders() {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST ||
      "api-football-v1.p.rapidapi.com";

    if (!apiKey) {
      throw new Error("RAPIDAPI_KEY not configured");
    }

    return {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
    };
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getFixturesToday(): Promise<APIFootballFixture[]> {
    const cacheKey = "fixtures-today";

    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const today = new Date().toISOString().split("T")[0];

      const response = await lastValueFrom(
        this.httpService.get(`${API_BASE_URL}/fixtures`, {
          params: {
            date: today,
            timezone: "America/Sao_Paulo",
          },
          headers: this.getAuthHeaders(),
        })
      );

      const fixtures = response.data.response || [];
      this.cache.set(cacheKey, { data: fixtures, timestamp: Date.now() });

      return fixtures;
    } catch (error) {
      console.error("Erro ao buscar fixtures:", error);
      throw error;
    }
  }

  async getTeamLastMatches(
    teamId: number,
    limit: number = 10
  ): Promise<APIFootballFixture[]> {
    const cacheKey = `team-matches-${teamId}`;

    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const response = await lastValueFrom(
        this.httpService.get(`${API_BASE_URL}/fixtures`, {
          params: {
            team: teamId,
            last: limit,
            timezone: "America/Sao_Paulo",
          },
          headers: this.getAuthHeaders(),
        })
      );

      const matches = response.data.response || [];
      this.cache.set(cacheKey, {
        data: matches,
        timestamp: Date.now(),
      });

      return matches;
    } catch (error) {
      console.error(
        `Erro ao buscar últimas partidas do time ${teamId}:`,
        error
      );
      throw error;
    }
  }

  async getTeamStats(teamId: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${API_BASE_URL}/teams/statistics`, {
          params: {
            team: teamId,
            season: new Date().getFullYear(),
          },
          headers: this.getAuthHeaders(),
        })
      );

      return response.data.response || {};
    } catch (error) {
      console.error(
        `Erro ao buscar estatísticas do time ${teamId}:`,
        error
      );
      throw error;
    }
  }

  async getFixtureEvents(fixtureId: number): Promise<any> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${API_BASE_URL}/fixtures/events`, {
          params: {
            fixture: fixtureId,
          },
          headers: this.getAuthHeaders(),
        })
      );

      return response.data.response || [];
    } catch (error) {
      console.error(
        `Erro ao buscar eventos da partida ${fixtureId}:`,
        error
      );
      throw error;
    }
  }
}
