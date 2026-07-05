"use client";

import { useRouter } from "next/navigation";

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
    href: "/tutorial",
    accent: "from-amber-500 to-amber-400",
  },
];

export default function HomePage() {
  const router = useRouter();

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
            onClick={() => router.push(card.href)}
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
    </div>
  );
}
