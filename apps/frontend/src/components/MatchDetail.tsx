import React, { useState } from "react";
import type { Match } from "@laytips/shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { RaceVisualization } from "./RaceVisualization";

interface MatchDetailProps {
  match: Match;
  onClose?: () => void;
}

export const MatchDetail: React.FC<MatchDetailProps> = ({
  match,
  onClose,
}) => {
  const getMethodBadge = (method: string) =>
    method === "LAY_FAVORITE"
      ? { label: "💰 Lay Favorito", color: "bg-amber-100" }
      : { label: "⚽ Lay 0x0", color: "bg-blue-100" };

  const badge = getMethodBadge(match.method);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                {match.homeTeam} × {match.awayTeam}
              </CardTitle>
              <div className="text-sm text-slate-500 mt-2">
                {match.league}
              </div>
            </div>
            <span className={`px-3 py-1 rounded font-semibold ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-slate-600 mb-1">
                Data/Hora
              </div>
              <div className="text-lg font-semibold">
                {match.kickoff.toLocaleDateString("pt-BR")}
              </div>
              <div className="text-sm">
                {match.kickoff.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            <div>
              <div className="text-xs text-slate-600 mb-1">
                Confiança da Análise
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {match.confidence}%
                </span>
                <div className="w-24 bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${match.confidence}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <RaceVisualization
          stats={match.homeStats}
          teamName={match.homeTeam}
        />
        <RaceVisualization
          stats={match.awayStats}
          teamName={match.awayTeam}
        />
      </div>

      {/* Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Critérios Atendidos
          </CardTitle>
        </CardHeader>

        <CardContent>
          {match.method === "LAY_00" && match.criteria.lay00 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {match.criteria.lay00.goalsAvg65Met
                    ? "✅"
                    : "❌"}
                </span>
                <span>
                  Média gols 65': ≥ 0.85
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {match.criteria.lay00.htGoalRateMet
                    ? "✅"
                    : "❌"}
                </span>
                <span>HT Goals: ≥ 80%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {match.criteria.lay00.over15RateMet
                    ? "✅"
                    : "❌"}
                </span>
                <span>Over 1.5: ≥ 85%</span>
              </div>
            </div>
          )}

          {match.method === "LAY_FAVORITE" &&
            match.criteria.layFavorite && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {match.criteria.layFavorite
                      .favoriteGoalsAvg70Met
                      ? "✅"
                      : "❌"}
                  </span>
                  <span>
                    Favorito gols 70': ≥ 0.85
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {match.criteria.layFavorite
                      .opponentConcededAvg65Met
                      ? "✅"
                      : "❌"}
                  </span>
                  <span>
                    Adversário sofre 65': ≥ 0.85
                  </span>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      {onClose && (
        <Button onClick={onClose} variant="outline" className="w-full">
          Fechar
        </Button>
      )}
    </div>
  );
};
