import crypto from "crypto";
import { WAITING_FOR_OPPONENT } from "../../../common/constants";
import { Player, Cell, Game } from "../../../common/types";

let games: Game[] = [];

const createGame = (player: Player) => ({
  id: crypto.randomBytes(16).toString("hex"),
  players: [player],
  status: WAITING_FOR_OPPONENT,
  hostId: player.id,
  winnerId: null,
});

const addGame = (newGame: Game) => (games = [...games, newGame]);
const getGameById = (gameId: string) => games.find((game) => game.id === gameId);

const updateGame = (gameId: string, data: any) => {
  const gameIndex = games.findIndex((game) => game.id === gameId);
  games[gameIndex] = { ...games[gameIndex], ...data };
  return games[gameIndex];
};

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const getGameResult = ({ board, player }: { board: Cell[][]; player: Player }) => {
  const currentPlayerWon = WINNING_COMBINATIONS.some((combination) =>
    combination.every((index) => {
      const row = Math.floor(index / 3);
      return board[row][index - row * 3] === player.symbol;
    })
  );

  const isGameOver = board.every((row: Cell[]) => row.every((cell: Cell) => cell !== null)) || currentPlayerWon;
  return { isGameOver, currentPlayerWon };
};

export { createGame, addGame, getGameById, updateGame, getGameResult };
