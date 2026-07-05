"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function JoinGamePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleJoin = () => {
    if (!code.trim()) return;
    router.push(`/play/${code.trim()}`);
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold mb-4">Join Game by Code</h1>
      <label className="block text-sm text-slate-200">
        Room code
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100"
        />
      </label>
      <button
        onClick={handleJoin}
        className="mt-3 rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
      >
        Join
      </button>
    </div>
  );
}
