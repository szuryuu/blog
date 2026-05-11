<script setup>
import { Moon, Sun } from "lucide-vue-next";

const colorMode = useColorMode();

const toggleTheme = () => {
  colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
};
</script>

<template>
  <button
    @click="toggleTheme"
    class="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-2xl transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
    aria-label="Toggle Theme"
  >
    <ClientOnly>
      <Moon v-if="colorMode.value === 'light'" :size="20" />
      <Sun v-else :size="20" />
      <template #fallback>
        <div class="w-5 h-5"></div>
      </template>
    </ClientOnly>
  </button>
</template>
