/**
 * Tipos compartilhados da aplicação LayTips
 */
export type MethodType = "LAY_00" | "LAY_FAVORITE";
export type GoalTimeBucket = "0-15" | "16-30" | "31-45" | "46-60" | "61-75" | "76-90";
/**
 * Estatísticas de uma equipe
 */
export interface TeamStats {
    /**
     * Média de gols marcados até os minutos especificados
     */
    goalsAvg65: number;
    goalsAvg70: number;
    /**
     * Média de gols sofridos até os minutos especificados
     */
    concededAvg65: number;
    concededAvg70: number;
    /**
     * Taxa de gols no primeiro tempo (%)
     */
    htGoalRate: number;
    /**
     * Taxa de jogos com over 1.5 gols (%)
     */
    over15Rate: number;
    /**
     * Frequência de jogos em que a equipe marcou (%)
     */
    scoredFrequency: number;
    /**
     * Timeline dos últimos 10 jogos: gols marcados por minuto
     */
    scoredTimeline: number[];
    /**
     * Timeline dos últimos 10 jogos: gols sofridos por minuto
     */
    concededTimeline: number[];
    /**
     * Distribuição de gols por faixa de minuto
     */
    scoredDistribution: Record<GoalTimeBucket, number>;
    concededDistribution: Record<GoalTimeBucket, number>;
    /**
     * Últimos 10 jogos (para exibir RACE)
     */
    lastMatches: SimpleMatch[];
}
/**
 * Informações simples de um jogo
 */
export interface SimpleMatch {
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeGoals: number;
    awayGoals: number;
    league: string;
}
/**
 * Partida com análise completa
 */
export interface Match {
    id: string;
    /**
     * ID da API-Football
     */
    fixtureId: number;
    homeTeam: string;
    awayTeam: string;
    /**
     * Data e hora do início do jogo
     */
    kickoff: Date;
    /**
     * Campeonato/liga
     */
    league: string;
    /**
     * Método identificado
     */
    method: MethodType;
    /**
     * Confiança da recomendação (0-100)
     */
    confidence: number;
    /**
     * Estatísticas da equipe mandante
     */
    homeStats: TeamStats;
    /**
     * Estatísticas da equipe visitante
     */
    awayStats: TeamStats;
    /**
     * Critérios atendidos
     */
    criteria: {
        lay00?: {
            goalsAvg65Met: boolean;
            htGoalRateMet: boolean;
            over15RateMet: boolean;
        };
        layFavorite?: {
            favoriteGoalsAvg70Met: boolean;
            opponentConcededAvg65Met: boolean;
            scoredFrequencyMet?: boolean;
            over15Met?: boolean;
            oddQualityMet?: boolean;
        };
    };
    /**
     * Timestamp da coleta de dados
     */
    collectedAt: Date;
}
/**
 * Lista diária de jogos processados
 */
export interface DailyMatches {
    date: Date;
    matches: Match[];
    totalCount: number;
    updatedAt: Date;
}
/**
 * Resposta da API-Football para fixtures
 */
export interface APIFootballFixture {
    fixture: {
        id: number;
        date: string;
        timestamp: number;
        timezone: string;
        week: number;
        status: {
            long: string;
            short: string;
            elapsed: number;
        };
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
        season: number;
        round: string;
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
        };
        away: {
            id: number;
            name: string;
            logo: string;
        };
    };
    goals: {
        home: number | null;
        away: number | null;
    };
    score: {
        halftime: {
            home: number | null;
            away: number | null;
        };
        fulltime: {
            home: number | null;
            away: number | null;
        };
        extratime: {
            home: number | null;
            away: number | null;
        };
        penalty: {
            home: number | null;
            away: number | null;
        };
    };
    events: Array<{
        time: {
            elapsed: number;
            extra: number | null;
        };
        type: string;
        detail: string;
        comments: string | null;
        player: {
            id: number;
            name: string;
        };
        assist: {
            id: number | null;
            name: string | null;
        };
        team: {
            id: number;
            name: string;
            logo: string;
        };
    }>;
}
/**
 * Resposta da API-Football para estatísticas
 */
export interface APIFootballStats {
    fixture: {
        id: number;
        date: string;
    };
    league: {
        id: number;
        season: number;
    };
    teams: {
        home: {
            id: number;
            name: string;
            statistics: {
                shotsOn: number | null;
                shotsOff: number | null;
                shotsTotal: number | null;
                passes: number | null;
                accuracy: number | null;
            };
        };
        away: {
            id: number;
            name: string;
            statistics: {
                shotsOn: number | null;
                shotsOff: number | null;
                shotsTotal: number | null;
                passes: number | null;
                accuracy: number | null;
            };
        };
    };
    statistics: Array<{
        team: {
            id: number;
            name: string;
            logo: string;
        };
        statistics: {
            type: string;
            value: number | null;
        }[];
    }>;
}
//# sourceMappingURL=index.d.ts.map