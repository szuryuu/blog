<script setup>
useSeoMeta({
  title: "Infrastructure Logs",
  description: "Log pemantauan dan arsitektur infrastruktur.",
});
</script>

<template>
  <div>
    <h1
      class="font-heading text-5xl font-black mb-6 tracking-wide text-zinc-900 dark:text-zinc-100"
    >
      Infrastructure Logs
    </h1>

    <div
      class="bg-zinc-100 dark:bg-zinc-900 border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center"
    >
      <p class="text-zinc-600 dark:text-zinc-400 font-mono">
        > STATUS: CLUSTER_INITIALIZING. <br />
        > Logs will appear here.
      </p>
    </div>
  </div>
</template>
