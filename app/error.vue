<script setup>
import { ArrowLeft } from "lucide-vue-next";

const props = defineProps({
  error: Object,
});

const handleClearError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300"
  >
    <div
      class="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
      style="
        background-image: radial-gradient(
          circle at 2px 2px,
          currentColor 1px,
          transparent 0
        );
        background-size: 24px 24px;
      "
    ></div>

    <div
      class="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto"
    >
      <div class="mb-8 relative">
        <h1
          class="font-heading text-[8rem] sm:text-[12rem] font-black leading-none text-zinc-200 dark:text-zinc-800/80 tracking-tighter select-none"
        >
          {{ error.statusCode }}
        </h1>
      </div>

      <h2
        class="font-heading text-2xl sm:text-3xl text-zinc-900 dark:text-zinc-100 font-bold mb-4"
      >
        Page Not Found
      </h2>

      <p
        class="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base mb-10 max-w-md"
      >
        {{
          error.statusMessage || "The page you are looking for does not exist."
        }}
      </p>

      <button
        @click="handleClearError"
        class="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
      >
        <ArrowLeft
          class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
        />
        <span class="mt-1">Back to Home</span>
      </button>
    </div>
  </div>
</template>
