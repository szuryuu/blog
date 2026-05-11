<script setup>
import { Tag } from "lucide-vue-next";

const { data: allTags } = await useAsyncData("all-tags", () =>
  $fetch("/api/tags"),
);

useSeoMeta({
  title: "Tags",
  description: "Kumpulan topik dan tagar artikel.",
});
</script>

<template>
  <div class="pt-8">
    <h1
      class="font-heading text-6xl sm:text-7xl md:text-8xl mb-12 text-ghost dark:text-ghost-dark tracking-wide leading-none"
    >
      EXPLORE TAGS
    </h1>

    <div v-if="allTags && allTags.length > 0" class="flex flex-wrap gap-4">
      <span
        v-for="tag in allTags"
        :key="tag"
        class="flex items-center gap-2 px-4 py-3 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
      >
        <Tag :size="14" />
        {{ tag }}
      </span>
    </div>
    <div v-else class="max-w-2xl">
      <p class="text-zinc-500 font-sans text-lg leading-relaxed">
        No tags found in the database.
      </p>
    </div>
  </div>
</template>
