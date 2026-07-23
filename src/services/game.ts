// src/services/game.ts
import { apiClient } from "./api-client";
import { GameStateResponse } from "./types";

export type CreateGameResponse = {
  code: string;
};

export const GameService = {
  createGame: () =>
    apiClient<CreateGameResponse>("/api/games", {
      method: "POST",
    }),
  matchmake: (playerId: string, name: string) =>
    apiClient<GameStateResponse>("/api/matchmaking", {
      method: "POST",
      body: JSON.stringify({ playerId, name }),
    }),
};
