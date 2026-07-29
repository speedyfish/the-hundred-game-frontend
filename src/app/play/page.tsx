"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlayPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleJoinByCode = () => {
    const trimmed = code.trim();
    if (!trimmed) return;
    router.push(`/play/${trimmed}?needsJoin=0`);
  };

  const [open, setOpen] = useState<boolean>(false);

  const handleContinue = () => {
    setOpen(false);
    router.push("/play-online");
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Play Online</h1>
        <p className="mt-2 text-sm text-slate-300">
          Join an existing room by code, or create a new game from the home page
          or “Create Game” section.
        </p>
      </div>

      <div className="space-y-3 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <h2 className="text-sm font-medium text-slate-100">
          Join by room code
        </h2>
        <p className="text-xs text-slate-400">
          Ask your friend for the room code or link, then enter the code here.
        </p>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button
            onClick={handleJoinByCode}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            Join
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        To create a new room, go to <strong>Create Game</strong> from the home
        page.
      </p>
    </div>
  );
}
