// src/services/game.ts
import { apiClient } from "./api-client";

export type CreateGameResponse = {
  code: string;
};

export const GameService = {
  createGame: () => apiClient<CreateGameResponse>("/api/games"),
};
