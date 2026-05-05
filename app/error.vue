<script setup>
const props = defineProps({
  error: Object,
});

const handleClearError = () => clearError({ redirect: "/" });
</script>

<template>
  <div
    class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-6 font-sans transition-colors duration-300"
  >
    <div
      class="max-w-lg w-full bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-8 sm:p-12 shadow-[-8px_8px_0px_0px_rgba(24,24,27,1)] dark:shadow-[-8px_8px_0px_0px_rgba(228,228,231,1)] text-center transition-all"
    >
      <h1
        class="font-heading text-8xl font-black mb-2 text-zinc-900 dark:text-zinc-100"
      >
        {{ error.statusCode }}
      </h1>

      <div class="h-1 w-16 bg-zinc-900 dark:bg-zinc-100 mx-auto mb-6"></div>

      <p
        class="font-mono text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed"
      >
        > EXCEPTION_CAUGHT: <br />
        {{
          error.statusMessage ||
          "An unexpected anomaly occurred in the system. Path unresolved."
        }}
      </p>

      <button
        @click="handleClearError"
        class="w-full px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 font-mono font-bold uppercase tracking-wider hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors border-2 border-transparent active:scale-95"
      >
        Reboot System
      </button>
    </div>
  </div>
</template>
