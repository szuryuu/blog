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
  <div class="pt-8 w-full min-w-0">
    <h1
      class="font-heading text-6xl sm:text-7xl md:text-8xl mb-12 text-ghost dark:text-ghost-dark tracking-wide leading-none break-words w-full"
    >
      PROJECTS
    </h1>

    <div
      v-if="posts && posts.length > 0"
      class="flex flex-col gap-16 w-full min-w-0"
    >
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group block w-full min-w-0"
      >
        <div class="flex flex-wrap items-center gap-4 mb-4 w-full">
          <span
            v-if="post.year"
            class="font-mono text-sm text-zinc-400 shrink-0"
            >{{ post.year }}</span
          >
          <span
            v-if="post.type"
            class="font-mono text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full shrink-0"
          >
            {{ post.type }}
          </span>
        </div>
        <h2
          class="text-4xl sm:text-5xl font-heading text-zinc-900 dark:text-zinc-100 group-hover:text-ghost dark:group-hover:text-ghost-dark transition-all duration-300 mb-4 break-words w-full"
        >
          {{ post.title }}
        </h2>
        <p
          class="text-zinc-500 font-sans text-lg max-w-2xl leading-relaxed mb-6 break-words w-full"
        >
          {{ post.description }}
        </p>
        <div v-if="post.tech" class="flex flex-wrap gap-2 mt-auto w-full">
          <span
            v-for="t in post.tech"
            :key="t"
            class="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 max-w-full truncate shrink-0"
          >
            #{{ t }}
          </span>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="max-w-2xl w-full">
      <p class="text-zinc-500 font-sans text-lg leading-relaxed">
        No documentation found.
      </p>
    </div>
  </div>
</template>
