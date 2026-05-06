<script setup>
import { Search, X } from "lucide-vue-next";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4"
  >
    <div
      @click="$emit('close')"
      class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
    ></div>
    <div
      class="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
    >
      <div
        class="flex items-center px-4 py-4 border-b border-zinc-100 dark:border-zinc-800"
      >
        <Search :size="20" class="text-zinc-400 shrink-0" />
        <input
          type="text"
          placeholder="Search articles, CTFs, or infrastructure..."
          class="flex-1 bg-transparent border-none outline-none px-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 font-sans text-sm sm:text-base"
          autofocus
        />
        <button
          @click="$emit('close')"
          class="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded shrink-0"
        >
          <X :size="20" />
        </button>
      </div>
      <div
        class="p-4 sm:p-8 min-h-[50vh] sm:min-h-[300px] flex flex-col items-center justify-center text-zinc-500 font-sans text-sm sm:text-base text-center"
      >
        Search functionality will be implemented soon.
      </div>
    </div>
  </div>
</template>
