<script setup>
import { ref, computed } from "vue";
import { Pin } from "lucide-vue-next";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  collection: {
    type: [String, Array],
    required: true,
  },
  emptyMessage: {
    type: String,
    default: "No transmission found.",
  },
});

const { data: posts } = await useAsyncData(
  `list-${Array.isArray(props.collection) ? props.collection.join("-") : props.collection}`,
  async () => {
    if (Array.isArray(props.collection)) {
      const promises = props.collection.map((col) =>
        queryCollection(col)
          .all()
          .catch(() => []),
      );
      const results = await Promise.all(promises);
      const allPosts = results.flat().filter(Boolean);

      return allPosts.sort((a, b) => {
        const dateA = a.date
          ? new Date(a.date).getTime()
          : a.year
            ? new Date(`${a.year}-12-31`).getTime()
            : 0;
        const dateB = b.date
          ? new Date(b.date).getTime()
          : b.year
            ? new Date(`${b.year}-12-31`).getTime()
            : 0;

        if (dateB !== dateA) return dateB - dateA;
        return (a.order || 99) - (b.order || 99);
      });
    }

    const query = queryCollection(props.collection);
    if (props.collection === "projects" || props.collection === "project") {
      return query.order("order", "ASC").all();
    }
    return query.order("date", "DESC").all();
  },
);

const pinnedPosts = computed(() => {
  if (!posts.value) return [];
  return posts.value.filter((post) => post.featured);
});

const allRegularPosts = computed(() => {
  if (!posts.value) return [];
  return posts.value.filter((post) => !post.featured);
});

const displayLimit = ref(10);

const regularPosts = computed(() => {
  return allRegularPosts.value.slice(0, displayLimit.value);
});

const hasMore = computed(() => {
  return displayLimit.value < allRegularPosts.value.length;
});

const loadMore = () => {
  displayLimit.value += 10;
};

useSeoMeta({
  title: props.title,
  description: `Archive of ${props.title.toLowerCase()} entries.`,
});
</script>

<template>
  <div class="pt-8 w-full min-w-0">
    <h1
      class="font-heading text-6xl sm:text-7xl md:text-8xl mb-12 text-ghost dark:text-ghost-dark tracking-wide leading-none uppercase break-words w-full"
    >
      {{ title }}
    </h1>

    <div v-if="pinnedPosts.length > 0" class="mb-16 w-full min-w-0">
      <div class="flex items-center gap-4 mb-8">
        <span
          class="font-mono text-xs uppercase tracking-widest text-zinc-500 shrink-0"
        >
          Pinned
        </span>
        <div class="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
      </div>
      <div class="group/list flex flex-col gap-12 w-full min-w-0">
        <NuxtLink
          v-for="post in pinnedPosts"
          :key="post.path"
          :to="post.path"
          class="group block w-full min-w-0 transition-all duration-500 hover:!opacity-100 group-hover/list:opacity-30 hover:translate-x-2"
        >
          <div class="flex items-start justify-between gap-4 mb-3 w-full">
            <div class="flex flex-wrap items-center gap-4">
              <time v-if="post.date" class="font-mono text-sm text-zinc-400">
                {{ post.date }}
              </time>
              <span v-if="post.year" class="font-mono text-sm text-zinc-400">
                {{ post.year }}
              </span>
              <span
                v-if="post.type"
                class="font-mono text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full"
              >
                {{ post.type }}
              </span>
            </div>
            <div
              class="flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5"
            >
              <span
                class="font-mono text-[10px] uppercase tracking-widest font-bold"
                >Pinned</span
              >
              <Pin class="w-3.5 h-3.5" />
            </div>
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
          <div class="flex flex-wrap gap-2 mt-auto w-full">
            <span
              v-for="tag in post.tags || post.tech"
              :key="tag"
              class="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 max-w-full truncate"
            >
              #{{ tag }}
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div
      v-if="regularPosts.length > 0"
      class="group/list flex flex-col gap-16 w-full min-w-0"
    >
      <NuxtLink
        v-for="post in regularPosts"
        :key="post.path"
        :to="post.path"
        class="group block w-full min-w-0 transition-all duration-500 hover:!opacity-100 group-hover/list:opacity-30 hover:translate-x-2"
      >
        <div class="flex flex-wrap items-center gap-4 mb-3 w-full">
          <time v-if="post.date" class="font-mono text-sm text-zinc-400">
            {{ post.date }}
          </time>
          <span v-if="post.year" class="font-mono text-sm text-zinc-400">
            {{ post.year }}
          </span>
          <span
            v-if="post.type"
            class="font-mono text-[10px] uppercase tracking-widest text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full"
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
        <div class="flex flex-wrap gap-2 mt-auto w-full">
          <span
            v-for="tag in post.tags || post.tech"
            :key="tag"
            class="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 max-w-full truncate"
          >
            #{{ tag }}
          </span>
        </div>
      </NuxtLink>
    </div>

    <div v-if="hasMore" class="mt-16 flex justify-center w-full">
      <button
        @click="loadMore"
        class="px-6 py-3 font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-xl transition-colors"
      >
        Load More Transmissions
      </button>
    </div>

    <div v-if="!posts || posts.length === 0" class="max-w-2xl w-full">
      <p class="text-zinc-500 font-sans text-lg leading-relaxed">
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>
