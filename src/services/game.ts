// src/services/game.ts
import { apiClient } from "./api-client";
import { GameStateResponse } from "./types";

export const GameService = {
  createGame: (playerId: string, name: string) =>
    apiClient<GameStateResponse>("/api/games", {
      method: "POST",
      body: JSON.stringify({ playerId, name }),
    }),
  matchmake: (playerId: string, name: string) =>
    apiClient<GameStateResponse>("/api/matchmaking", {
      method: "POST",
      body: JSON.stringify({ playerId, name }),
    }),
};
