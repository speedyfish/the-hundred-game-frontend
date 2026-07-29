// lib/playerIdentity.ts
const NAME_KEY = "hundredgame:name";
const PLAYER_ID_KEY = "hundredgame:playerId";

export function getOrCreateIdentity() {
  if (typeof window === "undefined") {
    return { playerId: "", name: "" };
  }

  let playerId = window.localStorage.getItem(PLAYER_ID_KEY);
  if (!playerId) {
    playerId = "player-" + Math.random().toString(36).slice(2, 8);
    window.localStorage.setItem(PLAYER_ID_KEY, playerId);
  }

  const name = window.localStorage.getItem(NAME_KEY) ?? "";

  return { playerId, name };
}

export function setStoredIdentity(name: string, playerId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NAME_KEY, name);
  window.localStorage.setItem(PLAYER_ID_KEY, playerId);
}
