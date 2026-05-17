import axios from "axios";
import type { DailyMatches, Match } from "@laytips/shared-types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const matchesApi = {
  async getMatchesToday(
    refresh: boolean = false
  ): Promise<DailyMatches> {
    const response = await apiClient.get(
      "/matches/today",
      {
        params: { refresh },
      }
    );
    return response.data;
  },

  async getMatchDetail(matchId: string): Promise<Match> {
    const response = await apiClient.get(
      "/matches/detail",
      {
        params: { id: matchId },
      }
    );
    return response.data.match;
  },

  async getHealth(): Promise<any> {
    const response = await apiClient.get("/health");
    return response.data;
  },
};
