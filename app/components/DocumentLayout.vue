<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Grid,
  Github,
  ExternalLink,
} from "lucide-vue-next";

const props = defineProps({
  collection: {
    type: String,
    required: true,
  },
  backLink: {
    type: String,
    required: true,
  },
  backText: {
    type: String,
    required: true,
  },
  allLink: {
    type: String,
    required: true,
  },
  allLinkText: {
    type: String,
    required: true,
  },
  layoutType: {
    type: String,
    default: "article",
  },
});

const route = useRoute();

const { data: page } = await useAsyncData(
  `${props.collection}-${route.path}`,
  () => {
    return queryCollection(props.collection).path(route.path).first();
  },
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Log entry not found in the database.",
    fatal: true,
  });
}

const { data: allPosts } = await useAsyncData(`${props.collection}-all`, () => {
  return queryCollection(props.collection)
    .order(
      props.layoutType === "project" ? "order" : "date",
      props.layoutType === "project" ? "ASC" : "DESC",
    )
    .all();
});

const currentIndex = computed(
  () => allPosts.value?.findIndex((p) => p.path === route.path) ?? -1,
);
const prevArticle = computed(() =>
  currentIndex.value > 0 ? allPosts.value?.[currentIndex.value - 1] : null,
);
const nextArticle = computed(() =>
  currentIndex.value < (allPosts.value?.length ?? 0) - 1
    ? allPosts.value?.[currentIndex.value + 1]
    : null,
);

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogImage: props.layoutType === "project" ? page.value.image : page.value.cover,
});

const scrollProgress = ref(0);

function onScroll() {
  const el = document.documentElement;
  const scrolled = el.scrollTop;
  const total = el.scrollHeight - el.clientHeight;
  scrollProgress.value = total > 0 ? (scrolled / total) * 100 : 0;
}

function getReadingTime(body) {
  const text = JSON.stringify(body ?? "");
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <article v-if="page" class="max-w-none relative w-full">
    <div class="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div class="h-1 w-full bg-zinc-200 dark:bg-zinc-900/50">
        <div
          class="h-full bg-emerald-500/80 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          :style="{ width: scrollProgress + '%' }"
        ></div>
      </div>
    </div>

    <header
      class="relative mb-12 rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900"
    >
      <div class="absolute inset-0 z-0">
        <NuxtImg
          v-if="layoutType === 'project' ? page.image : page.cover"
          :src="layoutType === 'project' ? page.image : page.cover"
          :alt="page.title"
          class="w-full h-full object-cover opacity-20 grayscale"
          width="1920"
          height="1080"
          format="webp"
          preload
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-100 dark:from-zinc-900 via-zinc-100/50 dark:via-zinc-900/50 to-transparent"
        ></div>
      </div>
      <div class="relative z-10 w-full px-6 sm:px-10 pb-12 pt-24">
        <div
          v-if="layoutType === 'article'"
          class="flex items-center gap-4 mb-8"
        >
          <span
            class="font-mono text-xs uppercase tracking-widest text-zinc-500"
          >
            Log Entry
          </span>
          <div
            class="h-px flex-1 bg-gradient-to-r from-zinc-300 dark:from-zinc-700 to-transparent"
          ></div>
        </div>

        <div
          v-if="layoutType === 'project'"
          class="flex flex-wrap items-center gap-4 mb-6"
        >
          <span v-if="page.year" class="font-mono text-sm text-zinc-500">{{
            page.year
          }}</span>
          <span
            v-if="page.type"
            class="font-mono text-xs uppercase tracking-widest text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full"
          >
            {{ page.type }}
          </span>
          <span
            v-if="page.status"
            class="font-mono text-xs uppercase tracking-widest text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full"
          >
            {{ page.status }}
          </span>
        </div>

        <div v-if="layoutType === 'article'" class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in page.tags"
            :key="tag"
            class="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
          >
            #{{ tag }}
          </span>
        </div>

        <h1
          class="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-zinc-900 dark:text-zinc-100 tracking-wide mb-6 leading-none"
        >
          {{ page.title }}
        </h1>

        <p
          class="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans mb-10 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4"
        >
          {{ page.description }}
        </p>

        <template v-if="layoutType === 'project'">
          <div
            v-if="page.github || page.live"
            class="flex flex-wrap gap-4 mb-10"
          >
            <a
              v-if="page.github"
              :href="page.github"
              target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm font-mono hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
            >
              <Github class="w-4 h-4" />
              Repository
            </a>
            <a
              v-if="page.live"
              :href="page.live"
              target="_blank"
              class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-lg text-sm font-mono hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              <ExternalLink class="w-4 h-4" />
              Live Demo
            </a>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="t in page.tech"
              :key="t"
              class="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-full text-[10px] font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400"
            >
              {{ t }}
            </span>
          </div>
        </template>

        <div
          v-if="layoutType === 'article'"
          class="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-500 uppercase tracking-wider"
        >
          <span class="flex items-center gap-2">
            <Calendar class="w-3.5 h-3.5" />
            {{ formatDate(page.date) }}
          </span>
          <span class="flex items-center gap-2">
            <Clock class="w-3.5 h-3.5" />
            {{ getReadingTime(page.body) }}
          </span>
        </div>
      </div>
    </header>

    <div class="w-full min-w-0 flex-1 px-0 sm:px-4">
      <main
        class="prose prose-zinc dark:prose-invert prose-base sm:prose-lg prose-headings:font-heading prose-headings:font-black prose-h1:text-4xl sm:prose-h1:text-5xl prose-h2:text-3xl sm:prose-h2:text-4xl prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-800 prose-h2:pb-2 prose-h2:mb-6 prose-h2:mt-12 prose-h3:text-2xl sm:prose-h3:text-3xl prose-h4:text-xl sm:prose-h4:text-2xl prose-a:text-emerald-500 dark:prose-a:text-emerald-400 hover:prose-a:text-emerald-600 dark:hover:prose-a:text-emerald-300 prose-img:rounded-xl prose-pre:bg-zinc-900 prose-pre:text-zinc-100 prose-pre:rounded-xl dark:prose-pre:bg-zinc-900 dark:prose-pre:border dark:prose-pre:border-zinc-800 prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-zinc-200/50 dark:prose-code:bg-zinc-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none [&_pre_code]:bg-transparent dark:[&_pre_code]:bg-transparent [&_pre_code]:text-inherit dark:[&_pre_code]:text-inherit [&_pre_code]:p-0 prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-zinc-300 dark:prose-th:border-zinc-700 prose-th:p-3 prose-th:bg-zinc-100 dark:prose-th:bg-zinc-800 prose-td:border prose-td:border-zinc-300 dark:prose-td:border-zinc-700 prose-td:p-3 max-w-none text-zinc-700 dark:text-zinc-300 break-words overflow-x-auto"
      >
        <ContentRenderer :value="page" />
      </main>
    </div>

    <div
      class="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between gap-6 pb-12"
    >
      <NuxtLink
        v-if="prevArticle"
        :to="prevArticle.path"
        class="group flex-1 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:bg-zinc-900/50 hover:dark:bg-zinc-900 transition-colors"
      >
        <div
          class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3"
        >
          <ArrowLeft
            class="w-3 h-3 group-hover:-translate-x-1 transition-transform"
          />
          Previous Entry
        </div>
        <h3
          class="font-heading text-2xl text-zinc-900 dark:text-zinc-100 line-clamp-2"
        >
          {{ prevArticle.title }}
        </h3>
      </NuxtLink>
      <div v-else class="flex-1"></div>

      <NuxtLink
        :to="allLink"
        class="flex items-center justify-center gap-2 px-6 py-4 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
      >
        <Grid class="w-4 h-4" />
        {{ allLinkText }}
      </NuxtLink>

      <NuxtLink
        v-if="nextArticle"
        :to="nextArticle.path"
        class="group flex-1 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:bg-zinc-900/50 hover:dark:bg-zinc-900 transition-colors text-right"
      >
        <div
          class="flex items-center justify-end gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3"
        >
          Next Entry
          <ArrowRight
            class="w-3 h-3 group-hover:translate-x-1 transition-transform"
          />
        </div>
        <h3
          class="font-heading text-2xl text-zinc-900 dark:text-zinc-100 line-clamp-2"
        >
          {{ nextArticle.title }}
        </h3>
      </NuxtLink>
      <div v-else class="flex-1"></div>
    </div>
  </article>
</template>
