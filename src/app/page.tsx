"use client";

import { useRouter } from "next/navigation";
import Example from "./components/common/CustomModal";

import { useState } from "react";
import CustomModal from "./components/common/CustomModal";
import useMatchMaking from "@/hooks/useMatchMaking";
import { GameStateResponse } from "@/services/types";
import { match } from "assert";

type Card = {
  title: string;
  description: string;
  href: string;
  accent: string;
};

const cards: Card[] = [
  {
    title: "Create Game",
    description: "Start a new room and share the link or code with a friend.",
    href: "/create",
    accent: "from-sky-500 to-sky-400",
  },
  {
    title: "Join by Code",
    description: "Enter a room code you received from a friend.",
    href: "/join",
    accent: "from-emerald-500 to-emerald-400",
  },
  {
    title: "Play Online",
    description: "Find an opponent online (or extend this later).",
    href: "/play",
    accent: "from-purple-500 to-purple-400",
  },
  {
    title: "Tutorial",
    description: "Learn how the game works and see examples.",
    href: "/play-online",
    accent: "from-amber-500 to-amber-400",
  },
];

const NAME_KEY = "hundredgame:name";
const PLAYER_ID_KEY = "hundredgame:playerId";

export default function HomePage() {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>(
    "player-" + Math.random().toString(36).slice(2, 8)
  );
  const [name, setName] = useState<string>("");
  const { matchmake, loading, error } = useMatchMaking();

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (trimmed == "") return;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(NAME_KEY, trimmed);
      window.localStorage.setItem(PLAYER_ID_KEY, playerId);
    }

    const state: GameStateResponse | null = await matchmake(name, playerId);

    if (!state) {
      console.error("Matchmaking failed.");
      return;
    }

    setOpen(false);

    console.log("this is the code used", state.code);

    router.push(`/play/${state.code}?needsJoin=0`);
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-semibold">The Hundred Game</h1>
        <p className="mt-2 text-slate-300">
          A 1v1 number game. Create a room, share it with a friend, and try to
          sync your guesses.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={() => {
              if (!open && card.href === "/play-online") {
                setOpen(true);
                return;
              }

              return router.push(card.href);
            }}
            className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition hover:border-slate-600 hover:bg-slate-900"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 -top-10 h-20 bg-gradient-to-r ${card.accent} opacity-0 blur-2xl transition group-hover:opacity-40`}
            />
            <h2 className="relative text-lg font-medium">{card.title}</h2>
            <p className="relative mt-1 text-sm text-slate-300">
              {card.description}
            </p>
          </button>
        ))}
      </section>
      <CustomModal
        open={open}
        setOpen={setOpen}
        onConfirm={handleContinue}
        setValue={setName}
        value={name}
      />
    </div>
  );
}
