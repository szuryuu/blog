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
  <article v-if="page" class="max-w-none">
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-2 font-mono text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
    >
      <span><- Return to Terminal</span>
    </NuxtLink>

    <header class="mb-12 border-b-2 border-zinc-200 dark:border-zinc-800 pb-8">
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in page.tags"
          :key="tag"
          class="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs uppercase tracking-widest"
        >
          {{ tag }}
        </span>
      </div>

      <h1
        class="font-heading text-4xl sm:text-5xl font-black text-zinc-900 dark:text-zinc-100 mb-4 leading-tight"
      >
        {{ page.title }}
      </h1>

      <time class="font-mono text-sm text-zinc-500 dark:text-zinc-400">
        {{ page.date }}
      </time>
    </header>

    <div
      class="prose prose-zinc dark:prose-invert prose-headings:font-heading prose-headings:font-black max-w-none"
    >
      <ContentRenderer :value="page" />
    </div>
  </article>
</template>
