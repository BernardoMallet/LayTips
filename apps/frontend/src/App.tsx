import React, { useState } from "react";
import { useMatches } from "./hooks/useMatches";
import { MatchCard } from "./components/MatchCard";
import { MatchDetail } from "./components/MatchDetail";
import type { Match } from "@laytips/shared-types";
import { Button } from "./components/ui/Button";

export const App: React.FC = () => {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(
    null
  );
  const { matches, loading, error, refetch } = useMatches({
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 min
  });

  if (error && !matches) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-red-900 mb-2">
            Erro ao conectar
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-red-600 mb-4">
            Verifique se o backend está rodando em{" "}
            <code>http://localhost:3001</code>
          </p>
          <Button onClick={() => refetch(true)}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (selectedMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <Button
            onClick={() => setSelectedMatch(null)}
            variant="outline"
            className="mb-6"
          >
            ← Voltar
          </Button>
          <MatchDetail match={selectedMatch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                ⚽ LayTips Radar
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Radar Diário de Jogos para Lay Trading
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400 mb-2">
                Última atualização
              </div>
              <div className="text-sm font-mono text-slate-300">
                {matches
                  ? new Date(matches.updatedAt)
                      .toLocaleTimeString("pt-BR")
                  : "--:--:--"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="bg-blue-900 rounded-lg p-4 text-white">
            <div className="text-sm text-blue-200">Total de Jogos</div>
            <div className="text-3xl font-bold">
              {matches?.totalCount || 0}
            </div>
          </div>

          <div className="bg-amber-900 rounded-lg p-4 text-white">
            <div className="text-sm text-amber-200">
              Lay Favorito
            </div>
            <div className="text-3xl font-bold">
              {matches?.matches.filter(
                (m) => m.method === "LAY_FAVORITE"
              ).length || 0}
            </div>
          </div>

          <div className="bg-green-900 rounded-lg p-4 text-white">
            <div className="text-sm text-green-200">
              Lay 0x0
            </div>
            <div className="text-3xl font-bold">
              {matches?.matches.filter(
                (m) => m.method === "LAY_00"
              ).length || 0}
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {loading && !matches && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⏳</div>
              <p className="text-slate-400">
                Carregando partidas...
              </p>
            </div>
          )}

          {matches && matches.matches.length === 0 && (
            <div className="text-center py-12 bg-slate-800 rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-slate-400">
                Nenhuma partida elegível encontrada
              </p>
              <Button
                onClick={() => refetch(true)}
                className="mt-4"
              >
                Buscar novamente
              </Button>
            </div>
          )}

          {matches?.matches.map((match) => (
            <div
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className="cursor-pointer"
            >
              <MatchCard match={match} />
            </div>
          ))}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => refetch(true)}
            variant="outline"
            disabled={loading}
          >
            {loading ? "Atualizando..." : "🔄 Atualizar Agora"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
