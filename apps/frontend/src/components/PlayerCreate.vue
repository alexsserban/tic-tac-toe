<template>
  <input
    type="text"
    v-model="name"
    placeholder="Player name"
    class="w-full p-2 text-lg text-gray-900 rounded-lg outline-none bg-slate-100 ring-amber-600 focus:ring-4"
  />

  <button @click="createPlayer" type="submit" class="w-full p-4 mt-4 text-lg bg-gray-800 rounded-lg">Next</button>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits(["create-player"]);

const name = ref("");
const createPlayer = () => emits("create-player", name.value);
</script>
