"use client";

import { use, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useGameSocket } from "@/hooks/useGameSocket";
import CustomModal from "@/app/components/common/CustomModal";

type GameStateResponse = {
  code: string;
  status: string;
  round: number;
  bothGuessedThisRound: boolean;
  winnerId: string | null;
  currentGuesses: Record<string, number[]>;
  history: any[];
};

const NAME_KEY = "hundredgame:name";
const PLAYER_ID_KEY = "hundredgame:playerId";

export default function GameRoomPage() {
  const router = useRouter();

  const params = useParams<{ code: string }>();
  const code = params.code;

  const searchParams = useSearchParams();

  const [playerId, setPlayerId] = useState("");
  const [name, setName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [guess, setGuess] = useState<string[]>(["", "", "", "", ""]);

  const { connected, messages, error, join, sendGuess } = useGameSocket(code);

  const lastState: GameStateResponse = messages[messages.length - 1];

  const handleContinueName = () => {
    if (!name.trim()) return;
    join(playerId, name.trim());
    setShowNameModal(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (typeof window === "undefined") return;

    const storedName = window.localStorage.getItem(NAME_KEY) ?? "";
    const storedPlayerId =
      window.localStorage.getItem(PLAYER_ID_KEY) ??
      "player-" + Math.random().toString(36).slice(2, 8);
    const needsJoin = searchParams.get("needsJoin") ?? "1";

    setName(storedName);
    setPlayerId(storedPlayerId);

    // if we don't have a name yet, show modal
    if (!storedName) {
      setShowNameModal(true);
    } else if (needsJoin === "1") {
      join(playerId, name.trim());
    }
  }, [connected, searchParams, join]);

  const handleSendGuess = () => {
    console.log("sending guess", guess);
    sendGuess(playerId, guess);
  };

  const handleGuessChange = (index: number, value: string) => {
    // Optionally strip non-digits:
    const cleaned = value.replace(/[^\d-]/g, ""); // allow digits and minus if you want
    setGuess((prev) => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
  };

  const handleBackHome = () => {
    router.push("/");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Room {code}</h1>
          <p className="mt-1 text-sm text-slate-300">
            Share this code with your friend so they can join this room.
          </p>
        </div>
        <button
          onClick={handleBackHome}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-500"
        >
          Back to home
        </button>
      </div>

      {/* Connection + game status */}
      <div className="flex flex-wrap items-center gap-4">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
            connected
              ? "bg-emerald-900/40 text-emerald-300"
              : "bg-amber-900/40 text-amber-300"
          }`}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{
              backgroundColor: connected ? "#22c55e" : "#fbbf24",
            }}
          />
          {connected ? "Connected to server" : "Connecting..."}
        </div>

        {lastState && (
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span>
              Status:{" "}
              <strong
                className={
                  lastState.status === "FINISHED"
                    ? "text-emerald-400"
                    : lastState.status === "IN_PROGRESS"
                      ? "text-sky-400"
                      : "text-amber-300"
                }
              >
                {lastState.status}
              </strong>
            </span>
            <span>
              Round: <strong>{lastState.round}</strong>
            </span>
            <span>
              Both guessed:{" "}
              <strong>{lastState.bothGuessedThisRound ? "yes" : "no"}</strong>
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Join section */}
      {lastState && lastState.status == "WAITING_FOR_SECOND_PLAYER" && (
        <section className="max-w-md space-y-3 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <h2>You are just waiting bro</h2>
        </section>
      )}

      <h1>hahah {messages.length}</h1>

      {/* Guess section */}

      <section className="space-y-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-slate-100">Your guess</h2>
          <span>{guess.reduce((acc, cur) => acc + Number(cur), 0)}</span>
          <span className="text-xs text-slate-400">
            Player: <span className="font-mono">{playerId}</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          {guess.map((value, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1 text-xs">
              <span className="text-slate-400">#{idx + 1}</span>
              <input
                type="text"
                inputMode="numeric"
                value={value}
                onChange={(e) => handleGuessChange(idx, e.target.value)}
                className="w-16 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-center text-sm text-slate-100"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSendGuess}
          disabled={!connected}
          className="mt-2 w-full rounded-md bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send guess
        </button>

        {lastState && lastState.status === "FINISHED" && (
          <div className="mt-3 rounded-md bg-emerald-900/40 px-3 py-2 text-xs text-emerald-100">
            {lastState.winnerId
              ? `Game finished. Winner: ${lastState.winnerId}`
              : "Game finished in a draw."}
          </div>
        )}
      </section>

      {/* Raw messages (debug) */}
      <section className="max-h-200 overflow-auto rounded-lg border border-slate-700 bg-slate-900/60 p-3">
        <h2 className="text-xs font-semibold text-slate-300">Raw updates</h2>
        <pre className="mt-1 text-[11px] text-slate-400">
          {messages.length === 0
            ? "No messages yet. Join and send a guess to see updates."
            : JSON.stringify(messages, null, 2)}
        </pre>
      </section>

      <CustomModal
        open={showNameModal}
        setOpen={setShowNameModal}
        onConfirm={handleContinueName}
        setValue={setName}
        value={name}
      />
    </div>
  );
}
