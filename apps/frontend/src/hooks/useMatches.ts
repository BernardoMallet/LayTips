import { useState, useEffect } from "react";
import type { DailyMatches } from "@laytips/shared-types";
import { matchesApi } from "../services/api";

interface UseMatchesOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const useMatches = (
  options: UseMatchesOptions = {}
) => {
  const {
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000, // 5 min
  } = options;

  const [matches, setMatches] = useState<DailyMatches | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatches = async (
    skipCache: boolean = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      const data = await matchesApi.getMatchesToday(skipCache);
      setMatches(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao buscar partidas"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();

    if (autoRefresh) {
      const interval = setInterval(
        () => fetchMatches(),
        refreshInterval
      );
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  return { matches, loading, error, refetch: fetchMatches };
};
