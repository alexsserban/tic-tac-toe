import express, { Express, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import crypto from "crypto";
import dotenv from "dotenv";
import cors from "cors";

import { addGame, getGameById, updateGame, getGameResult } from "./src/game";

import {
  CREATE_GAME,
  JOIN_GAME,
  PLAY,
  RESET,
  SYNC_GAME,
  SYNC_PLAYER,
  WAITING_FOR_OPPONENT,
  GAME_IN_PROGRESS,
  GAME_OVER,
} from "../../common/constants";

import { Player } from "../../common/types";

dotenv.config();

const main = async () => {
  if (!process.env.PORT) return console.error("PORT not available");
  if (!process.env.FRONTEND) return console.error("FRONTEND not available");

  const port = process.env.PORT;
  const origin = process.env.FRONTEND;

  const app: Express = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin,
      methods: ["GET", "POST"],
    },
  });

  app.use(express.json());
  app.use(cors({ origin }));

  app.get("/", (req: Request, res: Response) => {
    res.send("Tic Tac Toe");
  });

  io.on("connection", (socket) => {
    console.log(`Connected user - Socket ID: ${socket.id}`);

    // First player (host) creates a new game
    socket.on(CREATE_GAME, (player: Player) => {
      const id = crypto.randomBytes(16).toString("hex");
      const updatedPlayer: Player = { ...player, id: socket.id };

      const game = {
        id,
        status: WAITING_FOR_OPPONENT,
        players: [updatedPlayer],
        currentTurnPlayerId: "",
        board: [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)],
        winnerId: "",
      };

      addGame(game);

      socket.emit(SYNC_PLAYER, updatedPlayer);
      socket.join(game.id);
      io.in(game.id).emit(SYNC_GAME, game);
    });

    // Second player joins the game with gameID
    socket.on(JOIN_GAME, ({ player, gameId }: { player: Player; gameId: string }) => {
      const game = getGameById(gameId);
      if (!game) return;

      if (game.status === WAITING_FOR_OPPONENT) {
        const randomPlayerIndex = crypto.randomInt(2);
        const updatedPlayer: Player = { ...player, id: socket.id };
        const players = [game.players[0], updatedPlayer];

        const data = {
          players,
          status: GAME_IN_PROGRESS,
          currentTurnPlayerId: players[randomPlayerIndex].id,
        };

        const updatedGame = updateGame(game.id, data);

        socket.emit(SYNC_PLAYER, updatedPlayer);
        socket.join(game.id);
        io.in(game.id).emit(SYNC_GAME, updatedGame);
      }
    });

    // New move by a player
    socket.on(PLAY, ({ gameId, playerId, rowIndex, colIndex }) => {
      const game = getGameById(gameId);
      if (!game) return;

      const player = game.players.find((player: Player) => player.id === playerId);
      if (!player) return;

      if (
        game.status === GAME_IN_PROGRESS &&
        !game.board[rowIndex][colIndex] &&
        game.currentTurnPlayerId === player.id
      ) {
        game.board[rowIndex][colIndex] = player.symbol;

        const { isGameOver, currentPlayerWon } = getGameResult({
          board: game.board,
          player,
        });

        const winnerId = currentPlayerWon ? player.id : null;

        let data;
        if (isGameOver) data = { board: game.board, winnerId, status: GAME_OVER };
        else {
          const nextPlayer = game.players.find((player: Player) => player.id != playerId) as Player;
          data = { board: game.board, currentTurnPlayerId: nextPlayer.id };
        }

        const updatedGame = updateGame(game.id, data);
        io.in(game.id).emit(SYNC_GAME, updatedGame);
      }
    });

    // Reset game and start a new one
    socket.on(RESET, ({ gameId }) => {
      const game = getGameById(gameId);
      if (!game) return;

      const randomPlayerIndex = crypto.randomInt(2);

      const data = {
        status: GAME_IN_PROGRESS,
        board: [Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)],
        currentTurnPlayerId: game.players[randomPlayerIndex].id,
        winnerId: "",
      };

      const updatedGame = updateGame(game.id, data);
      io.in(game.id).emit(SYNC_GAME, updatedGame);
    });
  });

  server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
  });
};

main();
