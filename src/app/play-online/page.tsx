"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameService } from "@/services/game";

export default function PlayOnlinePage() {
  const router = useRouter();
  const [playerId, setPlayerId] = useState(
    () => "player-" + Math.random().toString(36).slice(2, 8)
  );
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMatchmake = async () => {
    if (!name.trim()) {
      setError("Please enter a name.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const state = await GameService.matchmake(playerId, name.trim());

      // navigate to game room page with the code we got back
      router.push(`/play/${state.code}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unknown error during matchmaking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Play Online</h1>
      <p className="text-sm text-slate-300 mb-4">
        Enter your name and click Matchmake to be paired with another player.
      </p>

      <label className="block text-sm text-slate-200">
        Name
        <input
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label className="block text-xs text-slate-400 mt-2">
        Player ID (debug)
        <input
          className="mt-1 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-300 text-xs"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
        />
      </label>

      <button
        onClick={handleMatchmake}
        disabled={loading}
        className="mt-4 w-full rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Matching..." : "Matchmake"}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </main>
  );
}
