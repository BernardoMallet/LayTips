import React from "react";
import type { TeamStats } from "@laytips/shared-types";
import { buildRACEData } from "@laytips/race-engine";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface RaceVisualizationProps {
  stats: TeamStats;
  teamName: string;
}

export const RaceVisualization: React.FC<
  RaceVisualizationProps
> = ({ stats, teamName }) => {
  const raceData = buildRACEData(stats);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{teamName}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visualization */}
        <div>
          <div className="text-2xl font-mono font-bold text-center mb-2">
            {raceData.visualization}
          </div>
          <div className="text-xs text-slate-600 text-center">
            Últimos 10 jogos: 🟢 Marcou | 🔴 Sofreu | ⚪ Ambos | ⚫ Nenhum
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-green-50 p-2 rounded">
            <div className="text-xs text-slate-600">Marcou</div>
            <div className="font-semibold">
              {raceData.summary.scoredCount}/10
            </div>
            <div className="text-xs text-slate-500">
              {raceData.summary.scoredRate.toFixed(0)}%
            </div>
          </div>

          <div className="bg-red-50 p-2 rounded">
            <div className="text-xs text-slate-600">Sofreu</div>
            <div className="font-semibold">
              {raceData.summary.concededCount}/10
            </div>
            <div className="text-xs text-slate-500">
              Média/jogo: {raceData.summary.goalsPerGame.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-slate-100 p-2 rounded text-sm">
          <div className="text-xs text-slate-600 mb-1">
            Sequência
          </div>
          <div className="font-mono font-bold">
            {raceData.summary.currentStreak}
          </div>
        </div>

        {/* Time Distribution */}
        <div className="text-xs">
          <div className="font-semibold mb-2">
            Distribuição por faixa de minuto
          </div>

          <div className="space-y-1 text-slate-600">
            <div>
              <span className="font-semibold">Marcados:</span>
              {" "}
              0-15: {raceData.timeDistribution.scored["0-15"]} |
              16-30: {raceData.timeDistribution.scored["16-30"]} |
              31-45: {raceData.timeDistribution.scored["31-45"]}
            </div>
            <div>
              <span className="font-semibold">Sofridos:</span>
              {" "}
              0-15: {raceData.timeDistribution.conceded["0-15"]} |
              16-30: {raceData.timeDistribution.conceded["16-30"]} |
              31-45: {raceData.timeDistribution.conceded["31-45"]}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
