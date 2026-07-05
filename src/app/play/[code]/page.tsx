"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type GameStateResponse = {
  code: string;
  status: string;
  round: number;
  bothGuessedThisRound: boolean;
  winnerId: string | null;
};

export default function GameRoomPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = params.code;

  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [joined, setJoined] = useState(false);
  const [playerId, setPlayerId] = useState(
    () => "player-" + Math.random().toString(36).slice(2, 8)
  );
  const [name, setName] = useState("");
  const [guess, setGuess] = useState<number[]>([1, 1, 1, 1, 1]);
  const [messages, setMessages] = useState<GameStateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  const lastState = messages[messages.length - 1];

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

  useEffect(() => {
    const c = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        setError(null);
        c.subscribe(`/topic/games/${code}`, (message) => {
          const body = JSON.parse(message.body) as GameStateResponse;
          setMessages((prev) => [...prev, body]);
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame.headers["message"], frame.body);
        setError("Connection error with game server.");
      },
    });

    c.activate();
    setClient(c);

    return () => {
      c.deactivate();
    };
  }, [code]);

  const handleJoin = () => {
    if (!client || !connected || joined) return;
    const payload = {
      playerId,
      name: name || playerId,
    };
    client.publish({
      destination: `/app/games/${code}/join`,
      body: JSON.stringify(payload),
    });
    setJoined(true);
    setError(null);
  };

  const handleGuessChange = (index: number, value: number) => {
    setGuess((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSendGuess = () => {
    if (!client || !connected || !joined) return;
    const payload = {
      playerId,
      guess,
    };
    client.publish({
      destination: `/app/games/${code}/guess`,
      body: JSON.stringify(payload),
    });
    setError(null);
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
      {!joined && (
        <section className="max-w-md space-y-3 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <h2 className="text-sm font-medium text-slate-100">Join this game</h2>
          <p className="text-xs text-slate-400">
            Enter a name and join. Open this room in another browser/tab with a
            different player ID to simulate your friend.
          </p>
          <label className="block text-xs text-slate-200">
            Display name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={playerId}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
            />
          </label>
          <label className="block text-xs text-slate-200">
            Player ID (debug)
            <input
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            />
          </label>
          <button
            onClick={handleJoin}
            disabled={!connected}
            className="mt-2 w-full rounded-md bg-sky-600 px-3 py-2 text-xs font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {connected ? "Join game" : "Connecting..."}
          </button>
        </section>
      )}

      {/* Guess section */}
      {joined && (
        <section className="space-y-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-slate-100">
              Your guess (5 numbers)
            </h2>
            <span className="text-xs text-slate-400">
              Player: <span className="font-mono">{playerId}</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {guess.map((value, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 text-xs"
              >
                <span className="text-slate-400">#{idx + 1}</span>
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    handleGuessChange(idx, Number(e.target.value))
                  }
                  className="w-16 rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-center text-sm text-slate-100"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSendGuess}
            disabled={!connected || !joined}
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
      )}

      {/* Raw messages (debug) */}
      <section className="max-h-64 overflow-auto rounded-lg border border-slate-700 bg-slate-900/60 p-3">
        <h2 className="text-xs font-semibold text-slate-300">Raw updates</h2>
        <pre className="mt-1 text-[11px] text-slate-400">
          {messages.length === 0
            ? "No messages yet. Join and send a guess to see updates."
            : JSON.stringify(messages, null, 2)}
        </pre>
      </section>
    </div>
  );
}
