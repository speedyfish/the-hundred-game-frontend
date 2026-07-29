const GameRoom = ({
  handleBackHome,
  code,
  connected,
  handleSendGuess,
  lastState,
  guess,
  error,
  handleGuessChange,
}) => {
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

      {/* Guess section */}

      <section className="space-y-4 rounded-lg border border-slate-700 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-medium text-slate-100">Your guess</h2>
          <span>{guess.reduce((acc, cur) => acc + Number(cur), 0)}</span>
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
    </div>
  );
};

export default GameRoom;
