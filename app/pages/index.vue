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
  <div class="pt-8">
    <h1
      class="font-heading text-7xl sm:text-8xl md:text-9xl mb-20 text-ghost dark:text-ghost-dark tracking-wide"
    >
      LOGS
    </h1>

    <div class="flex flex-col gap-16">
      <NuxtLink
        v-for="post in posts"
        :key="post.path"
        :to="post.path"
        class="group block"
      >
        <time class="font-mono text-sm text-zinc-400 mb-3 block">
          {{ post.date }}
        </time>
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
        <div class="flex gap-4">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="font-mono text-xs uppercase tracking-widest text-zinc-400"
          >
            #{{ tag }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
