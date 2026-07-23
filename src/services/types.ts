// src/services/types.ts
export type GameStatus =
  "WAITING_FOR_SECOND_PLAYER" | "IN_PROGRESS" | "FINISHED";

export type GameStateResponse = {
  code: string;
  status: GameStatus;
  round: number;
  bothGuessedThisRound: boolean;
  winnerId: string | null;
  currentGuesses: Record<string, number[]>; // playerId -> list of 5 ints
  history: {
    round: number;
    player1Id: string;
    player1Guess: number[];
    player2Id: string;
    player2Guess: number[];
    roundWinnerId: string | null;
  }[];
};
