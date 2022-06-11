<template>
  <div class="grid grid-cols-2 gap-4 mt-2">
    <div id="status" class="p-4 mb-4 text-center bg-gray-800 rounded-lg">
      <span v-if="game.status == GAME_OVER">
        <span v-if="game.winnerId == player.id">WON</span>
        <span v-else-if="!game.winnerId">DRAW</span>
        <span v-else>LOST</span>
      </span>

      <span v-else-if="canMakePlay">Your Turn</span>
      <span v-else>Wait for Opponent</span>
    </div>

    <button
      :disabled="game.status != GAME_OVER"
      @click="reset()"
      class="p-4 mb-4 text-center bg-gray-800 rounded-lg"
      :class="
        game.status === GAME_OVER
          ? 'hover:cursor-pointer hover:ring-amber-600 hover:ring-4'
          : 'hover:cursor-not-allowed'
      "
    >
      RESET
    </button>
  </div>

  <div id="board" class="flex flex-col items-center my-4">
    <div v-for="(row, rowIndex) in game.board" :key="rowIndex" class="flex">
      <div
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        class="flex items-center justify-center w-24 h-24 text-4xl border-2 cursor-pointer border-amber-600 hover:bg-gray-700 material-icons-outlined"
        :class="
          canMakePlay && isEmptyCell(rowIndex, colIndex) && game.status != GAME_OVER
            ? 'hover:cursor-pointer'
            : 'hover:cursor-not-allowed'
        "
        @click="makePlay(rowIndex, colIndex)"
      >
        {{ cell === "X" ? "close" : cell === "O" ? "circle" : "" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { Socket } from "socket.io-client";

import { Game, Player } from "../../../../common/types";
import { PLAY, GAME_OVER, RESET } from "../../../../common/constants";

const props = defineProps<{ game: Game; player: Player }>();
const socket = inject("socket") as Socket;

const canMakePlay = computed(() => props.game.currentTurnPlayerId == props.player.id);
const isEmptyCell = (rowIndex: number, colIndex: number) => !props.game.board[rowIndex][colIndex];

const makePlay = (rowIndex: number, colIndex: number) =>
  socket.emit(PLAY, {
    gameId: props.game.id,
    playerId: props.player.id,
    rowIndex,
    colIndex,
  });

const reset = () => socket.emit(RESET, { gameId: props.game.id });
</script>
