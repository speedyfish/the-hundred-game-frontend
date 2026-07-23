"use client";

import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { GameStateResponse } from "@/services/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export function useGameSocket(code: string) {
  const [client, setClient] = useState<Client | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<GameStateResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("websocket time");
    const c = new Client({
      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("connected to websocket");
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

  const join = (playerId: string, name: string) => {
    if (!client || !connected) return;
    client.publish({
      destination: `/app/games/${code}/join`,
      body: JSON.stringify({ playerId, name }),
    });
    setError(null);
  };

  const sendGuess = (playerId: string, guessStrings: string[]) => {
    if (!client || !connected) return;

    if (guessStrings.some((v) => v.trim() === "")) {
      setError("Please fill all 5 numbers.");
      return;
    }

    const numericGuess = guessStrings.map((v) => (v === "" ? 0 : Number(v)));

    const payload = {
      playerId,
      guess: numericGuess,
    };

    client.publish({
      destination: `/app/games/${code}/guess`,
      body: JSON.stringify(payload),
    });
    setError(null);
  };

  return {
    connected,
    messages,
    error,
    join,
    sendGuess,
  };
}
