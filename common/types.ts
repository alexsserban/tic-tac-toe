export type Cell = string | null;

export interface Game {
  id: string;
  status: string;
  players: Player[];
  winnerId: string;
  board: Cell[][];
  currentTurnPlayerId: string;
}

export interface Player {
  id: string;
  name: string;
  symbol: "X" | "0" | "";
}
