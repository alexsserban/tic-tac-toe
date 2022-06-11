<template>
  <div v-if="!game.status">
    <button @click="createGame()" class="w-full p-4 mt-4 text-lg bg-gray-800 rounded-lg">New Game</button>

    <p class="m-4 text-center">OR</p>

    <div class="grid grid-cols-3 gap-4">
      <input
        type="text"
        v-model="gameId"
        placeholder="Game ID"
        class="col-span-2 p-2 text-lg text-center text-gray-900 rounded-lg outline-none bg-slate-100 ring-amber-600 focus:ring-4 placeholder:text-center"
      />

      <button @click="joinGame()" class="p-4 text-lg bg-gray-800 rounded-lg">Join Game</button>
    </div>
  </div>

  <div v-else-if="game.status == WAITING_FOR_OPPONENT">
    <h2>Welcome {{ player.name }}</h2>
    <h3>Status: Waiting opponent</h3>
    <h4>Game ID: {{ game.id }}</h4>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from "vue";
import { Socket } from "socket.io-client";

import { Game, Player } from "../../../../common/types";
import { CREATE_GAME, WAITING_FOR_OPPONENT, JOIN_GAME } from "../../../../common/constants";

const props = defineProps<{ game: Game; player: Player }>();
const socket = inject("socket") as Socket;

const gameId = ref("");
const createGame = () => socket.emit(CREATE_GAME, { ...props.player, symbol: "X" });
const joinGame = () => socket.emit(JOIN_GAME, { player: { ...props.player, symbol: "O" }, gameId: gameId.value });
</script>
