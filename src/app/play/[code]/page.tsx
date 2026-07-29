"use client";

import { use, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useGameSocket } from "@/hooks/useGameSocket";
import CustomModal from "@/app/components/common/CustomModal";
import { getOrCreateIdentity } from "@/lib/playerIdentity";
import GameRoom from "@/app/components/pages/play/GameRoom";

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
  const hasInitializedRef = useRef(false);

  const handleContinueName = () => {
    if (!name.trim()) return;
    join(playerId, name.trim());
    setShowNameModal(false);
  };

  useEffect(() => {
    if (!connected) return;
    if (hasInitializedRef.current) return;
    if (typeof window === "undefined") return;

    const { name: storedName, playerId: storedPlayerId } =
      getOrCreateIdentity();

    if (!storedName) {
      alert("Please enter your name to continue.");
    }

    if (!storedPlayerId) {
      alert("Please enter your player ID to continue.");
    }
    const needsJoin = searchParams.get("needsJoin") ?? "1";

    setName(storedName);
    setPlayerId(storedPlayerId);

    // if we don't have a name yet, show modal
    if (!storedName) {
      setShowNameModal(true);
    } else if (needsJoin === "1") {
      join(playerId, name.trim());
    }
    hasInitializedRef.current = true;
  }, [connected, searchParams]);

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
    <>
      <GameRoom
        handleBackHome={handleBackHome}
        code={code}
        connected={connected}
        handleSendGuess={handleSendGuess}
        lastState={lastState}
        guess={guess}
        error={error}
        handleGuessChange={handleGuessChange}
      />
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
        openModal={showNameModal}
        setOpenModal={setShowNameModal}
        onConfirm={handleContinueName}
        setValue={setName}
        value={name}
      />
    </>
  );
}
