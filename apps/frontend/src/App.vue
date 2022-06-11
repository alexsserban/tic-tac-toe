<template>
  <div class="flex items-center justify-center min-h-screen text-white bg-gray-800">
    <div class="w-1/4 p-6 bg-gray-900 rounded-lg">
      <h1 class="mb-6 text-4xl font-semibold text-center">Tic Tac Toe</h1>

      <PlayerCreate v-if="!player.name" @create-player="createPlayer" />

      <div v-else>
        <GameLobby v-if="![GAME_IN_PROGRESS, GAME_OVER].includes(game.status)" :game="game" :player="player" />
        <GameBoard v-else :game="game" :player="player" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, provide } from "vue";
import { io } from "socket.io-client";

import PlayerCreate from "./components/PlayerCreate.vue";
import GameLobby from "./components/GameLobby.vue";
import GameBoard from "./components/GameBoard.vue";

import { Game, Player } from "../../../common/types";
import { SYNC_PLAYER, SYNC_GAME, GAME_IN_PROGRESS, GAME_OVER } from "../../../common/constants";

const player = reactive<Player>({ id: "", name: "", symbol: "" });
const game = reactive<Game>({
  id: "",
  status: "",
  players: [player],
  winnerId: "",
  currentTurnPlayerId: "",
  board: [],
});

const createPlayer = (name: string) => (player.name = name);

onMounted(() => {
  const socket = io(import.meta.env.VITE_API, {
    path: "/socket.io/",
  });

  provide("socket", socket);

  // Update game state
  socket.on(SYNC_GAME, (data: Game) => {
    game.id = data.id;
    game.status = data.status;
    game.players = data.players;
    game.winnerId = data.winnerId;
    game.currentTurnPlayerId = data.currentTurnPlayerId;
    game.board = data.board;
  });

  // Update player
  socket.on(SYNC_PLAYER, (playerData: Player) => {
    player.id = playerData.id;
  });
});
</script>
