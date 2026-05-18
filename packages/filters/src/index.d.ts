/**
 * Motor de Filtros - Implementação dos métodos Lay 0x0 e Lay Favorito
 */
import type { Match, TeamStats, MethodType } from "@laytips/shared-types";
/**
 * Critérios para qualificação Lay 0x0
 */
interface Lay00Criteria {
    goalsAvg65Threshold: number;
    htGoalRateThreshold: number;
    over15RateThreshold: number;
}
/**
 * Critérios para qualificação Lay Favorito
 */
interface LayFavoriteCriteria {
    favoriteGoalsAvg70Threshold: number;
    opponentConcededAvg65Threshold: number;
    scoredFrequencyThreshold?: number;
    over15Threshold?: number;
    oddThreshold?: number;
}
/**
 * Critérios padrão documentados
 */
export declare const DEFAULT_LAY_00_CRITERIA: Lay00Criteria;
export declare const DEFAULT_LAY_FAVORITE_CRITERIA: LayFavoriteCriteria;
/**
 * Verifica se uma partida atende aos critérios Lay 0x0
 *
 * Critérios:
 * - Uma das equipes com média >= 0.85 gols até 65 minutos
 * - Ambas as equipes com >= 80% HT Goals
 * - Ambas as equipes com >= 85% Over 1.5
 */
export declare function checkLay00(homeStats: TeamStats, awayStats: TeamStats, criteria?: Lay00Criteria): boolean;
/**
 * Verifica se uma partida atende aos critérios Lay Favorito
 *
 * Critérios:
 * - Favorito: média >= 0.85 gols até 70 min
 * - Adversário: média >= 0.85 gols sofridos até 65 min
 * - Opcionais: frequência 8/10, over 1.5 > 75%, odd < 2.20
 */
export declare function checkLayFavorite(homeStats: TeamStats, awayStats: TeamStats, criteria?: LayFavoriteCriteria): boolean;
/**
 * Calcula a confiança da recomendação (0-100)
 */
export declare function calculateConfidence(homeStats: TeamStats, awayStats: TeamStats, method: MethodType): number;
/**
 * Analisa uma partida e determina qual método se aplica
 */
export declare function analyzeMatch(homeStats: TeamStats, awayStats: TeamStats): MethodType | null;
/**
 * Ordena jogos conforme documentado:
 * 1. Horário
 * 2. Prioridade do método (LAY_FAVORITE > LAY_00)
 * 3. Maior média ofensiva
 */
export declare function sortMatches(matches: Match[]): Match[];
/**
 * Processa matches e aplica filtros
 */
export declare function filterAndSortMatches(matches: Match[]): Match[];
export {};
//# sourceMappingURL=index.d.ts.map