import React from "react";
import type { Match } from "@laytips/shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { cn } from "./lib/utils";

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  onClick,
}) => {
  const getMethodColor = (method: string) =>
    method === "LAY_FAVORITE" ? "bg-amber-50" : "bg-blue-50";

  const getMethodLabel = (method: string) =>
    method === "LAY_FAVORITE" ? "💰 Lay Favorito" : "⚽ Lay 0x0";

  const getMethodBadgeColor = (method: string) =>
    method === "LAY_FAVORITE"
      ? "bg-amber-200 text-amber-900"
      : "bg-blue-200 text-blue-900";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg",
        getMethodColor(match.method)
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {match.homeTeam} × {match.awayTeam}
          </CardTitle>
          <span
            className={cn(
              "px-2 py-1 rounded text-xs font-semibold",
              getMethodBadgeColor(match.method)
            )}
          >
            {getMethodLabel(match.method)}
          </span>
        </div>
        <div className="text-sm text-slate-500">
          {match.league} • {match.kickoff.toLocaleTimeString()}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-600 mb-1">
              Equipe Mandante
            </div>
            <div className="text-sm font-semibold">
              Gols avg: {match.homeStats.goalsAvg70.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">
              HT: {match.homeStats.htGoalRate.toFixed(0)}% | Over:
              {match.homeStats.over15Rate.toFixed(0)}%
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-600 mb-1">
              Equipe Visitante
            </div>
            <div className="text-sm font-semibold">
              Gols avg: {match.awayStats.goalsAvg70.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500">
              HT: {match.awayStats.htGoalRate.toFixed(0)}% | Over:
              {match.awayStats.over15Rate.toFixed(0)}%
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs">
            <span className="font-semibold">Confiança:</span>{" "}
            <span
              className={cn(
                "font-bold",
                match.confidence >= 75
                  ? "text-green-600"
                  : match.confidence >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
              )}
            >
              {match.confidence}%
            </span>
          </div>
          <div className="text-xs text-slate-500">
            {match.kickoff.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
