<script setup>
const { data: posts } = await useAsyncData("writing-list", () => {
  return queryCollection("writing").order("date", "DESC").all();
});

useSeoMeta({
  title: "Terminal Logs",
  description: "Catatan teknis, infrastruktur, dan DevSecOps.",
});
</script>

<template>
  <div>
    <h1
      class="font-heading text-5xl font-black mb-10 tracking-wide text-zinc-900 dark:text-zinc-100"
    >
      Latest Executions
    </h1>

    <div class="space-y-6">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="block group bg-white dark:bg-zinc-900 border-2 border-zinc-900 dark:border-zinc-700 p-6 sm:p-8 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[-8px_8px_0px_0px_rgba(24,24,27,1)] dark:hover:shadow-[-8px_8px_0px_0px_rgba(228,228,231,1)] transition-all duration-200"
      >
        <div
          class="flex flex-col sm:flex-row sm:items-baseline justify-between mb-4 gap-2"
        >
          <h2
            class="text-2xl font-bold font-heading text-zinc-900 dark:text-zinc-100 group-hover:underline decoration-4 underline-offset-4"
          >
            {{ post.title }}
          </h2>
          <time
            class="font-mono text-xs text-zinc-500 dark:text-zinc-400 shrink-0"
          >
            {{ post.date }}
          </time>
        </div>

        <p class="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
          {{ post.description }}
        </p>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-xs font-mono font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300"
          >
            {{ tag }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
