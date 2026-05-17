/**
 * Motor RACE - Visualização de histórico de gols e desempenho
 */

import type { TeamStats, GoalTimeBucket, SimpleMatch } from "@laytips/shared-types";

export interface RACEIndicator {
  /**
   * Se a equipe marcou na partida
   */
  scored: boolean;

  /**
   * Se a equipe sofreu gols na partida
   */
  conceded: boolean;

  /**
   * Gols marcados nessa partida
   */
  goalsScored: number;

  /**
   * Gols sofridos nessa partida
   */
  goalsConceded: number;

  /**
   * Data do jogo
   */
  date: string;

  /**
   * Adversário
   */
  opponent: string;

  /**
   * Placar
   */
  score: string;
}

export interface RACEData {
  /**
   * Últimos 10 jogos
   */
  lastMatches: RACEIndicator[];

  /**
   * Emojis para visualização: [🟢🟢🔴...]
   */
  visualization: string;

  /**
   * Estatísticas gerais
   */
  summary: {
    /**
     * Total de jogos com gol
     */
    scoredCount: number;

    /**
     * Total de jogos tendo sofrido gol
     */
    concededCount: number;

    /**
     * Taxa de gols marcados (%)
     */
    scoredRate: number;

    /**
     * Média de gols por jogo
     */
    goalsPerGame: number;

    /**
     * Sequência atual de jogos (W/D/L ou G/NG)
     */
    currentStreak: string;
  };

  /**
   * Distribuição por faixa de minuto
   */
  timeDistribution: {
    scored: Record<GoalTimeBucket, number>;
    conceded: Record<GoalTimeBucket, number>;
  };
}

/**
 * Determina se um jogo tem gol em uma faixa de minuto
 */
function getGoalTimeDistribution(
  timeline: number[],
  bucket: GoalTimeBucket
): number {
  // Se timeline.length === 1 e timeline[0] === num de gols,
  // significam gols totais. Aqui esperamos minutos exatos.
  // Para simplificar, retornamos quantos gols estão no bucket
  const [start, end] = bucket.split("-").map(Number);
  return timeline.filter(
    (minute) => minute >= start && minute <= end
  ).length;
}

/**
 * Gera a visualização RACE em emojis
 */
function generateRACEVisualization(
  lastMatches: RACEIndicator[]
): string {
  return (
    "[" +
    lastMatches
      .map((match) => {
        if (match.scored && !match.conceded) {
          return "🟢"; // Marcou e não sofreu
        } else if (!match.scored && match.conceded) {
          return "🔴"; // Sofreu e não marcou
        } else if (match.scored && match.conceded) {
          return "⚪"; // Marcou e sofreu
        } else {
          return "⚫"; // Nem marcou nem sofreu
        }
      })
      .join("") +
    "]"
  );
}

/**
 * Gera streak de jogos (últimos resultados)
 */
function generateStreak(matches: RACEIndicator[]): string {
  // Toma os últimos 5 jogos
  const recent = matches.slice(-5);

  return recent
    .map((match) => {
      if (match.scored && !match.conceded) return "W"; // Vitória (marcou sem sofrer)
      if (!match.scored && match.conceded) return "L"; // Derrota (sofreu sem marcar)
      if (match.scored && match.conceded) return "D"; // Empate (marcou e sofreu)
      return "N"; // Sem gols
    })
    .join("");
}

/**
 * Constrói os dados RACE a partir de stats da equipe
 */
export function buildRACEData(stats: TeamStats): RACEData {
  const lastMatches = stats.lastMatches.map(
    (match, idx): RACEIndicator => {
      const isHome = Math.random() > 0.5; // Simplificado; em produção, comparar com dados reais
      const goalsScored = stats.scoredTimeline[idx] || 0;
      const goalsConceded = stats.concededTimeline[idx] || 0;

      return {
        scored: goalsScored > 0,
        conceded: goalsConceded > 0,
        goalsScored,
        goalsConceded,
        date: match.date,
        opponent: isHome ? match.awayTeam : match.homeTeam,
        score: `${goalsScored}-${goalsConceded}`,
      };
    }
  );

  const scoredCount = lastMatches.filter((m) => m.scored).length;
  const concededCount = lastMatches.filter(
    (m) => m.conceded
  ).length;
  const totalGoals = lastMatches.reduce(
    (sum, m) => sum + m.goalsScored,
    0
  );

  return {
    lastMatches,
    visualization: generateRACEVisualization(lastMatches),
    summary: {
      scoredCount,
      concededCount,
      scoredRate: (scoredCount / lastMatches.length) * 100,
      goalsPerGame: totalGoals / lastMatches.length,
      currentStreak: generateStreak(lastMatches),
    },
    timeDistribution: {
      scored: {
        "0-15": getGoalTimeDistribution(
          stats.scoredTimeline,
          "0-15"
        ),
        "16-30": getGoalTimeDistribution(
          stats.scoredTimeline,
          "16-30"
        ),
        "31-45": getGoalTimeDistribution(
          stats.scoredTimeline,
          "31-45"
        ),
        "46-60": getGoalTimeDistribution(
          stats.scoredTimeline,
          "46-60"
        ),
        "61-75": getGoalTimeDistribution(
          stats.scoredTimeline,
          "61-75"
        ),
        "76-90": getGoalTimeDistribution(
          stats.scoredTimeline,
          "76-90"
        ),
      },
      conceded: {
        "0-15": getGoalTimeDistribution(
          stats.concededTimeline,
          "0-15"
        ),
        "16-30": getGoalTimeDistribution(
          stats.concededTimeline,
          "16-30"
        ),
        "31-45": getGoalTimeDistribution(
          stats.concededTimeline,
          "31-45"
        ),
        "46-60": getGoalTimeDistribution(
          stats.concededTimeline,
          "46-60"
        ),
        "61-75": getGoalTimeDistribution(
          stats.concededTimeline,
          "61-75"
        ),
        "76-90": getGoalTimeDistribution(
          stats.concededTimeline,
          "76-90"
        ),
      },
    },
  };
}

/**
 * Formata RACE para exibição no console/debug
 */
export function formatRACEForDisplay(raceData: RACEData): string {
  return `
RACE Visualization
${raceData.visualization}

Summary:
- Scored: ${raceData.summary.scoredCount}/10 (${raceData.summary.scoredRate.toFixed(0)}%)
- Conceded: ${raceData.summary.concededCount}/10
- Goals/Game: ${raceData.summary.goalsPerGame.toFixed(2)}
- Streak: ${raceData.summary.currentStreak}

Scored Distribution:
  0-15min: ${raceData.timeDistribution.scored["0-15"]} | 16-30: ${raceData.timeDistribution.scored["16-30"]} | 31-45: ${raceData.timeDistribution.scored["31-45"]}
  46-60min: ${raceData.timeDistribution.scored["46-60"]} | 61-75: ${raceData.timeDistribution.scored["61-75"]} | 76-90: ${raceData.timeDistribution.scored["76-90"]}

Conceded Distribution:
  0-15min: ${raceData.timeDistribution.conceded["0-15"]} | 16-30: ${raceData.timeDistribution.conceded["16-30"]} | 31-45: ${raceData.timeDistribution.conceded["31-45"]}
  46-60min: ${raceData.timeDistribution.conceded["46-60"]} | 61-75: ${raceData.timeDistribution.conceded["61-75"]} | 76-90: ${raceData.timeDistribution.conceded["76-90"]}
  `.trim();
}
