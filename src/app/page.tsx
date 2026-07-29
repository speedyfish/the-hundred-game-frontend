"use client";

import { useRouter } from "next/navigation";
import Example from "./components/common/CustomModal";

import { useEffect, useState } from "react";
import CustomModal from "./components/common/CustomModal";
import useMatchMaking from "@/hooks/useMatchMaking";
import { GameStateResponse } from "@/services/types";
import { match } from "assert";
import HomeCard from "./components/pages/HomeCard";
import { getOrCreateIdentity, setStoredIdentity } from "@/lib/playerIdentity";
import { GameService } from "@/services/game";

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
    href: "/play",
    accent: "from-emerald-500 to-emerald-400",
  },
  {
    title: "Play Online",
    description: "Play with a random opponent.",
    href: "/play-online",
    accent: "from-purple-500 to-purple-400",
  },
  {
    title: "Tutorial",
    description: "Learn how the game works and see examples.",
    href: "/play-online",
    accent: "from-amber-500 to-amber-400",
  },
];

export default function HomePage() {
  const router = useRouter();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [playerId, setPlayerId] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const { name: storedName, playerId: storedPlayerId } =
      getOrCreateIdentity();
    setPlayerId(storedName);
    setName(storedPlayerId);
  }, []);

  const { matchmake, loading, error } = useMatchMaking();

  const handleContinue = async () => {
    const trimmed = name.trim();
    if (trimmed == "") return;

    let newPlayerId = playerId;
    if (!newPlayerId) {
      alert("No player ID found. Generating a new one.");
      newPlayerId = "player-" + Math.random().toString(36).slice(2, 8);
    }

    console.log("Setting player ID to:", newPlayerId);

    setPlayerId(newPlayerId);
    setStoredIdentity(trimmed, newPlayerId);

    const state: GameStateResponse | null = await matchmake(name, playerId);

    if (!state) {
      console.error("Matchmaking failed.");
      return;
    }

    setOpenModal(false);

    router.push(`/play/${state.code}?needsJoin=0`);
  };

  const handleCardClick = async (href: string) => {
    if (href === "/play-online" || href === "/create") {
      if (name.length === 0) {
        setOpenModal(true);
        return;
      } else if (href === "/play-online") {
        alert(`Starting matchmaking for ${playerId}...`);
        const state: GameStateResponse | null = await matchmake(name, playerId);
        console.log("state of matchmaking", state);
        if (!state) {
          console.error("Matchmaking failed.");
          return;
        }
        router.push(`/play/${state.code}?needsJoin=0`);
        return;
      } else if (href === "/create") {
        console.log("aramaki");
        const { code } = await GameService.createGame(name, playerId);
        router.push(`/play/${code}?needsJoin=0`);
        return;
      }
    }
    router.push(href);
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-3xl font-semibold">The Hundred Game</h1>
        <p className="mt-2 ">
          A 1v1 number game. Just add numbers to a 100. More fun than you think.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <HomeCard
            key={card.title}
            card={card}
            onClick={() => handleCardClick(card.href)}
          />
        ))}
      </section>
      <CustomModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onConfirm={handleContinue}
        setValue={setName}
        value={name}
      />
    </div>
  );
}
