"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameService } from "@/services/game";

export default function CreateGamePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const { code } = await GameService.createGame();
      setCode(code);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error creating game.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoToGame = () => {
    if (!code) return;
    router.push(`/play/${code}`);
  };

  const handleCopyLink = async () => {
    if (!code || typeof window === "undefined") return;
    const origin = window.location.origin;
    const link = `${origin}/play/${code}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-md space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Create Game</h1>
        <p className="mt-2 text-sm text-slate-300">
          Create a new room and share the link or code with your friend.
        </p>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create game"}
      </button>

      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {code && (
        <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <div>
            <h2 className="text-sm font-medium text-slate-100">Room created</h2>
            <p className="mt-1 text-xs text-slate-400">
              Share this link or code with your friend.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Room code</span>
              <span className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-sm font-mono">
                {code}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopyLink}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-100 hover:border-sky-500 hover:bg-slate-800"
              >
                {copied ? "Copied link!" : "Copy join link"}
              </button>
              <button
                onClick={handleGoToGame}
                className="w-full rounded-md bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-500"
              >
                Go to room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
