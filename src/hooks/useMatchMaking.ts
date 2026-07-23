import { GameService } from "@/services/game";
import { GameStateResponse } from "@/services/types";
import { useRouter } from "next/router";
import { useState } from "react";

type MatchMakingResult = {
  matchmake: (
    name: string,
    playerId: string
  ) => Promise<GameStateResponse | null>;
  loading: boolean;
  error: string | null;
};

const useMatchMaking = (): MatchMakingResult => {
  //   const router = useRouter();
  //   const playerId: string = "player-" + Math.random().toString(36).slice(2, 8);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  //   if (!name.trim()) {
  //     setError("Please enter a name.");
  //     return;
  //   }

  const matchmake = async (
    name: string,
    playerId: string
  ): Promise<GameStateResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const state = await GameService.matchmake(playerId, name);

      return state;

      // navigate to game room page with the code we got back
      // router.push(`/play/${state.code}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unknown error during matchmaking."
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    matchmake,
    loading,
    error,
  };
};

export default useMatchMaking;
