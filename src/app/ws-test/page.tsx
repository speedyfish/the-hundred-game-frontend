"use client";

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type GameStateResponse = {
  code: string;
  status: string;
  round: number;
  bothGuessedThisRound: boolean;
  winnerId: string | null;
};

export default function WsTestPage() {
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<GameStateResponse[]>([]);
  const [code, setCode] = useState("ABC123");
  const [playerId, setPlayerId] = useState("player1");
  const [name, setName] = useState("Alice");
  const [guess, setGuess] = useState<number[]>([1, 1, 1, 1, 1]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const c = new Client({
      webSocketFactory: () => new SockJS("http://localhost:5000/ws"),
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true);
        c.subscribe(`/topic/games/${code}`, (message) => {
          const body = JSON.parse(message.body) as GameStateResponse;
          setMessages((prev) => [...prev, body]);
        });
      },
      onStompError: (frame) => {
        console.error("Broker error", frame.headers["message"], frame.body);
      },
    });

    c.activate();
    setClient(c);

    return () => {
      c.deactivate();
    };
  }, [code]);

  const sendJoin = () => {
    if (!client || !connected) return;
    client.publish({
      destination: `/app/games/${code}/join`,
      body: JSON.stringify({ playerId, name }),
    });
    setJoined(true);
  };

  const sendGuess = () => {
    if (!client || !connected || !joined) return;
    client.publish({
      destination: `/app/games/${code}/guess`,
      body: JSON.stringify({ playerId, guess }),
    });
  };

  const updateGuessAtIndex = (index: number, value: number) => {
    setGuess((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const lastState = messages[messages.length - 1];

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#0f172a",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          background: "#020617",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          border: "1px solid #1f2937",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 600 }}>
              WebSocket Test
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                color: "#9ca3af",
                fontSize: "0.9rem",
              }}
            >
              Join a game and send a 5-number guess. Open in two tabs to see
              real-time updates.
            </p>
          </div>
          <div
            style={{
              padding: "4px 10px",
              borderRadius: "999px",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: connected
                ? "rgba(34,197,94,0.1)"
                : "rgba(239,68,68,0.1)",
              color: connected ? "#22c55e" : "#f97316",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: connected ? "#22c55e" : "#f97316",
              }}
            />
            {connected ? "Connected" : "Connecting..."}
          </div>
        </header>

        {/* Game / player config */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.3fr 1fr",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#020617",
              border: "1px solid #1f2937",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#9ca3af",
              }}
            >
              Game
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: "0.85rem", color: "#d1d5db" }}>
                Game code
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setMessages([]);
                    setJoined(false);
                  }}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #374151",
                    background: "#020617",
                    color: "#e5e7eb",
                    fontSize: "0.9rem",
                  }}
                />
              </label>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b7280" }}>
                Use the same code in two tabs to see them sync.
              </p>
            </div>
          </div>

          <div
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              background: "#020617",
              border: "1px solid #1f2937",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "#9ca3af",
              }}
            >
              Player
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: "0.85rem", color: "#d1d5db" }}>
                Player ID
                <input
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #374151",
                    background: "#020617",
                    color: "#e5e7eb",
                    fontSize: "0.9rem",
                  }}
                />
              </label>
              <label style={{ fontSize: "0.85rem", color: "#d1d5db" }}>
                Display name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "6px 8px",
                    borderRadius: 6,
                    border: "1px solid #374151",
                    background: "#020617",
                    color: "#e5e7eb",
                    fontSize: "0.9rem",
                  }}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <button
            onClick={sendJoin}
            disabled={!connected || joined}
            style={{
              alignSelf: "flex-start",
              padding: "8px 14px",
              borderRadius: 999,
              border: "none",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: !connected || joined ? "not-allowed" : "pointer",
              opacity: !connected || joined ? 0.6 : 1,
              background:
                "linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #22c55e 100%)",
              color: "#020617",
            }}
          >
            {joined ? "Joined" : "Join game"}
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #1f2937",
              background: "#020617",
            }}
          >
            <span style={{ fontSize: "0.85rem", color: "#9ca3af" }}>
              Your guess (5 numbers)
            </span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {guess.map((value, idx) => (
                <input
                  key={idx}
                  type="number"
                  value={value}
                  onChange={(e) =>
                    updateGuessAtIndex(idx, Number(e.target.value))
                  }
                  style={{
                    width: 56,
                    padding: "4px 6px",
                    borderRadius: 6,
                    border: "1px solid #374151",
                    background: "#020617",
                    color: "#e5e7eb",
                    fontSize: "0.9rem",
                    textAlign: "center",
                  }}
                />
              ))}
            </div>
            <button
              onClick={sendGuess}
              disabled={!connected || !joined}
              style={{
                alignSelf: "flex-start",
                marginTop: 4,
                padding: "6px 12px",
                borderRadius: 999,
                border: "none",
                fontSize: "0.85rem",
                fontWeight: 500,
                cursor: !connected || !joined ? "not-allowed" : "pointer",
                opacity: !connected || !joined ? 0.6 : 1,
                background:
                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #3b82f6 100%)",
                color: "#e5e7eb",
              }}
            >
              Send guess
            </button>
          </div>
        </section>

        {/* Current state summary */}
        {lastState && (
          <section
            style={{
              marginBottom: 20,
              padding: "10px 12px",
              borderRadius: 10,
              background: "#020617",
              border: "1px solid #1f2937",
              fontSize: "0.9rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span>
                Game: <strong>{lastState.code}</strong>
              </span>
              <span>
                Round: <strong>{lastState.round}</strong>
              </span>
              <span>
                Status:{" "}
                <strong
                  style={{
                    color:
                      lastState.status === "FINISHED"
                        ? "#22c55e"
                        : lastState.status === "IN_PROGRESS"
                          ? "#3b82f6"
                          : "#f59e0b",
                  }}
                >
                  {lastState.status}
                </strong>
              </span>
            </div>
            <p
              style={{
                margin: "6px 0 0",
                color: "#9ca3af",
                fontSize: "0.85rem",
              }}
            >
              Both guessed this round:{" "}
              <strong>{lastState.bothGuessedThisRound ? "yes" : "no"}</strong>
            </p>
            {lastState.status === "FINISHED" && (
              <p style={{ margin: "4px 0 0", color: "#e5e7eb" }}>
                {lastState.winnerId
                  ? `Winner: ${lastState.winnerId}`
                  : "Result: draw"}
              </p>
            )}
          </section>
        )}

        {/* Raw messages */}
        <section
          style={{
            padding: "10px 12px",
            borderRadius: 10,
            background: "#020617",
            border: "1px solid #1f2937",
            maxHeight: 260,
            overflow: "auto",
          }}
        >
          <h2
            style={{
              margin: "0 0 6px",
              fontSize: "0.95rem",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#9ca3af",
            }}
          >
            Raw messages
          </h2>
          <pre
            style={{
              margin: 0,
              fontSize: "0.8rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              color: "#9ca3af",
            }}
          >
            {messages.length === 0
              ? "No messages yet. Join the game and send a guess."
              : JSON.stringify(messages, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}
