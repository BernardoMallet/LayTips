/**
 * Motor de Filtros - Implementação dos métodos Lay 0x0 e Lay Favorito
 */

import type { Match, TeamStats, MethodType, DailyMatches } from "@laytips/shared-types";

/**
 * Critérios para qualificação Lay 0x0
 */
interface Lay00Criteria {
  goalsAvg65Threshold: number; // >= 0.85
  htGoalRateThreshold: number; // >= 80%
  over15RateThreshold: number; // >= 85%
}

/**
 * Critérios para qualificação Lay Favorito
 */
interface LayFavoriteCriteria {
  favoriteGoalsAvg70Threshold: number; // >= 0.85
  opponentConcededAvg65Threshold: number; // >= 0.85
  // Critérios complementares (opcionais)
  scoredFrequencyThreshold?: number; // >= 80% (8/10)
  over15Threshold?: number; // >= 75%
  oddThreshold?: number; // <= 2.20
}

/**
 * Critérios padrão documentados
 */
export const DEFAULT_LAY_00_CRITERIA: Lay00Criteria = {
  goalsAvg65Threshold: 0.85,
  htGoalRateThreshold: 80,
  over15RateThreshold: 85,
};

export const DEFAULT_LAY_FAVORITE_CRITERIA: LayFavoriteCriteria = {
  favoriteGoalsAvg70Threshold: 0.85,
  opponentConcededAvg65Threshold: 0.85,
  scoredFrequencyThreshold: 80,
  over15Threshold: 75,
  oddThreshold: 2.2,
};

/**
 * Verifica se uma partida atende aos critérios Lay 0x0
 *
 * Critérios:
 * - Uma das equipes com média >= 0.85 gols até 65 minutos
 * - Ambas as equipes com >= 80% HT Goals
 * - Ambas as equipes com >= 85% Over 1.5
 */
export function checkLay00(
  homeStats: TeamStats,
  awayStats: TeamStats,
  criteria = DEFAULT_LAY_00_CRITERIA
): boolean {
  // Uma das equipes com gols até 65 min >= 0.85
  const goalsAvg65Met =
    homeStats.goalsAvg65 >= criteria.goalsAvg65Threshold ||
    awayStats.goalsAvg65 >= criteria.goalsAvg65Threshold;

  if (!goalsAvg65Met) return false;

  // Ambas com HT Goals >= 80%
  const htGoalRateMet =
    homeStats.htGoalRate >= criteria.htGoalRateThreshold &&
    awayStats.htGoalRate >= criteria.htGoalRateThreshold;

  if (!htGoalRateMet) return false;

  // Ambas com Over 1.5 >= 85%
  const over15RateMet =
    homeStats.over15Rate >= criteria.over15RateThreshold &&
    awayStats.over15Rate >= criteria.over15RateThreshold;

  return over15RateMet;
}

/**
 * Determina qual equipe é favorita (maior média ofensiva)
 */
function determineFavorite(
  homeStats: TeamStats,
  awayStats: TeamStats
): "home" | "away" {
  return homeStats.goalsAvg70 >= awayStats.goalsAvg70 ? "home" : "away";
}

/**
 * Verifica se uma partida atende aos critérios Lay Favorito
 *
 * Critérios:
 * - Favorito: média >= 0.85 gols até 70 min
 * - Adversário: média >= 0.85 gols sofridos até 65 min
 * - Opcionais: frequência 8/10, over 1.5 > 75%, odd < 2.20
 */
export function checkLayFavorite(
  homeStats: TeamStats,
  awayStats: TeamStats,
  criteria = DEFAULT_LAY_FAVORITE_CRITERIA
): boolean {
  const isFavoriteHome =
    homeStats.goalsAvg70 >= awayStats.goalsAvg70;

  const favoriteStats = isFavoriteHome ? homeStats : awayStats;
  const opponentStats = isFavoriteHome ? awayStats : homeStats;

  // Favorito: goalsAvg70 >= 0.85
  const favoriteGoalsAvg70Met =
    favoriteStats.goalsAvg70 >=
    criteria.favoriteGoalsAvg70Threshold;

  if (!favoriteGoalsAvg70Met) return false;

  // Adversário: concededAvg65 >= 0.85
  const opponentConcededAvg65Met =
    opponentStats.concededAvg65 >=
    criteria.opponentConcededAvg65Threshold;

  if (!opponentConcededAvg65Met) return false;

  // Critérios opcionais (reforçam a recomendação)
  let bonusScore = 0;

  if (
    criteria.scoredFrequencyThreshold &&
    favoriteStats.scoredFrequency >=
      criteria.scoredFrequencyThreshold
  ) {
    bonusScore += 10;
  }

  if (
    criteria.over15Threshold &&
    favoriteStats.over15Rate >= criteria.over15Threshold
  ) {
    bonusScore += 10;
  }

  // Criterios básicos satisfeitos - pode haver bonus score
  return true;
}

/**
 * Calcula a confiança da recomendação (0-100)
 */
export function calculateConfidence(
  homeStats: TeamStats,
  awayStats: TeamStats,
  method: MethodType
): number {
  let score = 50; // Base

  if (method === "LAY_00") {
    // Quanto maior o goalsAvg65, melhor
    const avgGoalsScore = Math.min(
      (Math.max(homeStats.goalsAvg65, awayStats.goalsAvg65) /
        0.85) *
        15,
      15
    );
    score += avgGoalsScore;

    // HT Goals
    const htScore = Math.min(
      (Math.max(homeStats.htGoalRate, awayStats.htGoalRate) /
        80) *
        15,
      15
    );
    score += htScore;

    // Over 1.5
    const overScore = Math.min(
      (Math.max(homeStats.over15Rate, awayStats.over15Rate) /
        85) *
        20,
      20
    );
    score += overScore;
  } else if (method === "LAY_FAVORITE") {
    const isFavoriteHome =
      homeStats.goalsAvg70 >= awayStats.goalsAvg70;
    const favoriteStats = isFavoriteHome ? homeStats : awayStats;
    const opponentStats = isFavoriteHome ? awayStats : homeStats;

    // Favorito goals
    const favGoalsScore = Math.min(
      (favoriteStats.goalsAvg70 / 0.85) * 20,
      20
    );
    score += favGoalsScore;

    // Opponent conceded
    const oppScore = Math.min(
      (opponentStats.concededAvg65 / 0.85) * 20,
      20
    );
    score += oppScore;

    // Bonus
    if (favoriteStats.scoredFrequency >= 80) {
      score += 10;
    }
    if (favoriteStats.over15Rate >= 75) {
      score += 10;
    }
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Analisa uma partida e determina qual método se aplica
 */
export function analyzeMatch(
  homeStats: TeamStats,
  awayStats: TeamStats
): MethodType | null {
  // Verifica ambos os métodos
  const isLay00 = checkLay00(homeStats, awayStats);
  const isLayFavorite = checkLayFavorite(homeStats, awayStats);

  // Prioridade: Lay Favorito > Lay 0x0
  if (isLayFavorite) {
    return "LAY_FAVORITE";
  }

  if (isLay00) {
    return "LAY_00";
  }

  return null;
}

/**
 * Ordena jogos conforme documentado:
 * 1. Horário
 * 2. Prioridade do método (LAY_FAVORITE > LAY_00)
 * 3. Maior média ofensiva
 */
export function sortMatches(matches: Match[]): Match[] {
  return [...matches].sort((a, b) => {
    // 1. Por horário
    if (a.kickoff.getTime() !== b.kickoff.getTime()) {
      return a.kickoff.getTime() - b.kickoff.getTime();
    }

    // 2. Por prioridade do método
    const methodPriority: Record<MethodType, number> = {
      LAY_FAVORITE: 1,
      LAY_00: 2,
    };

    if (methodPriority[a.method] !== methodPriority[b.method]) {
      return (
        methodPriority[a.method] - methodPriority[b.method]
      );
    }

    // 3. Por maior média ofensiva
    const maxGoalsA = Math.max(
      a.homeStats.goalsAvg70,
      a.awayStats.goalsAvg70
    );
    const maxGoalsB = Math.max(
      b.homeStats.goalsAvg70,
      b.awayStats.goalsAvg70
    );

    return maxGoalsB - maxGoalsA;
  });
}

/**
 * Processa matches e aplica filtros
 */
export function filterAndSortMatches(
  matches: Match[]
): Match[] {
  // Ordena conforme regra
  return sortMatches(matches);
}
