<script setup>
const route = useRoute();

const { data: page } = await useAsyncData(`writing-${route.path}`, () => {
  return queryCollection("writing").path(route.path).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Log entry not found in the database.",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogImage: page.value.cover,
});
</script>

<template>
  <article v-if="page" class="max-w-none pt-8">
    <NuxtLink
      to="/"
      class="inline-flex items-center font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-16"
    >
      <- Back to Logs
    </NuxtLink>

    <header class="mb-20">
      <div class="flex flex-wrap gap-4 mb-8">
        <span
          v-for="tag in page.tags"
          :key="tag"
          class="font-mono text-xs uppercase tracking-widest text-zinc-400"
        >
          #{{ tag }}
        </span>
      </div>

      <h1
        class="font-heading text-6xl sm:text-7xl md:text-8xl text-ghost dark:text-ghost-dark tracking-wide mb-8 leading-none"
      >
        {{ page.title }}
      </h1>

      <time class="font-mono text-sm text-zinc-500 block">
        [ {{ page.date }} ]
      </time>
    </header>

    <div
      class="prose prose-zinc dark:prose-invert prose-lg prose-headings:font-heading prose-headings:font-black prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 max-w-none"
    >
      <ContentRenderer :value="page" />
    </div>
  </article>
</template>
