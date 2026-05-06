<script setup>
const { data: posts } = await useAsyncData("projects-list", () => {
  return queryCollection("projects").order("order", "ASC").all();
});

useSeoMeta({
  title: "Project Documentation",
  description: "Dokumentasi dan catatan proyek teknis.",
});
</script>

<template>
  <div class="pt-8">
    <h1
      class="font-heading text-6xl sm:text-7xl md:text-8xl mb-12 text-ghost dark:text-ghost-dark tracking-wide leading-none"
    >
      PROJECTS
    </h1>

    <div v-if="posts && posts.length > 0" class="flex flex-col gap-16">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group block"
      >
        <div class="flex items-center gap-4 mb-4">
          <span v-if="post.year" class="font-mono text-sm text-zinc-400">{{
            post.year
          }}</span>
          <span
            v-if="post.type"
            class="font-mono text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded"
            >{{ post.type }}</span
          >
        </div>
        <h2
          class="text-4xl sm:text-5xl font-heading text-zinc-900 dark:text-zinc-100 group-hover:text-ghost dark:group-hover:text-ghost-dark transition-all duration-300 mb-4"
        >
          {{ post.title }}
        </h2>
        <p
          class="text-zinc-500 font-sans text-lg max-w-2xl leading-relaxed mb-6"
        >
          {{ post.description }}
        </p>
        <div v-if="post.tech" class="flex flex-wrap gap-3">
          <span
            v-for="t in post.tech"
            :key="t"
            class="font-mono text-xs uppercase tracking-widest text-zinc-400"
          >
            #{{ t }}
          </span>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="max-w-2xl">
      <p class="text-zinc-500 font-sans text-lg leading-relaxed">
        No documentation found.
      </p>
    </div>
  </div>
</template>
