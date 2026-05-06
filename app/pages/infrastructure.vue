<script setup>
const { data: posts } = await useAsyncData("infrastructure-list", () => {
  return queryCollection("infrastructure").order("date", "DESC").all();
});

useSeoMeta({
  title: "Infrastructure Logs",
  description: "Log pemantauan dan arsitektur infrastruktur.",
});
</script>

<template>
  <div class="pt-8">
    <h1
      class="font-heading text-6xl sm:text-7xl md:text-8xl mb-12 text-ghost dark:text-ghost-dark tracking-wide leading-none"
    >
      INFRASTRUCTURE
    </h1>

    <div v-if="posts && posts.length > 0" class="flex flex-col gap-16">
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
    <div v-else class="max-w-2xl">
      <p class="text-zinc-500 font-sans text-lg leading-relaxed">
        Menunggu transmisi data lebih lanjut.
      </p>
    </div>
  </div>
</template>
