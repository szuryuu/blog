<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { ArrowLeft, ArrowRight, Calendar, Clock, Grid } from "lucide-vue-next";

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

const { data: allPosts } = await useAsyncData("writing-all", () => {
  return queryCollection("writing").order("date", "DESC").all();
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
  ogImage: page.value.cover,
});

const scrollProgress = ref(0);
const activeId = ref("");
let observer = null;

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

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id;
        }
      });
    },
    { rootMargin: "-10% 0px -80% 0px", threshold: 0.1 },
  );

  setTimeout(() => {
    document.querySelectorAll(".prose h2, .prose h3").forEach((heading) => {
      if (heading.id) observer.observe(heading);
    });
  }, 500);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  observer?.disconnect();
});
</script>

<template>
  <article v-if="page" class="max-w-none pt-8 relative">
    <div class="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div class="h-1 w-full bg-zinc-200 dark:bg-zinc-900/50">
        <div
          class="h-full bg-emerald-500/80 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          :style="{ width: scrollProgress + '%' }"
        ></div>
      </div>
    </div>

    <NuxtLink
      to="/"
      class="inline-flex items-center font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-12"
    >
      <- Back to Logs
    </NuxtLink>

    <header class="relative flex mb-10 gap-8">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-full -z-10"
      >
        <NuxtImg
          v-if="page.cover"
          :src="page.cover"
          :alt="page.title"
          class="w-full h-full object-cover opacity-20 grayscale"
          width="1920"
          height="1080"
          format="webp"
          preload
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-zinc-50/90 dark:via-zinc-950/90 to-transparent"
        ></div>
      </div>
      <div class="w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 pt-32">
        <div class="flex items-center gap-4 mb-8">
          <span
            class="font-mono text-xs uppercase tracking-widest text-zinc-500"
          >
            Log Entry
          </span>
          <div
            class="h-px flex-1 bg-gradient-to-r from-zinc-300 dark:from-zinc-700 to-transparent"
          ></div>
        </div>
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in page.tags"
            :key="tag"
            class="px-2 py-1 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
          >
            #{{ tag }}
          </span>
        </div>
        <h1
          class="font-heading text-5xl sm:text-6xl md:text-7xl text-zinc-900 dark:text-zinc-100 tracking-wide mb-6 leading-none"
        >
          {{ page.title }}
        </h1>
        <p
          class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl font-sans mb-10 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4"
        >
          {{ page.description }}
        </p>
        <div
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

    <div class="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
      <div class="flex-1 min-w-0 w-full">
        <details
          v-if="page?.body?.toc?.links?.length"
          class="block lg:hidden mb-10 p-5 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl text-zinc-900 dark:text-zinc-100"
        >
          <summary
            class="font-mono font-bold cursor-pointer outline-none uppercase tracking-widest text-xs opacity-70"
          >
            Table of Contents
          </summary>
          <nav class="mt-5 flex flex-col gap-3 text-sm font-sans">
            <a
              v-for="link in page.body.toc.links"
              :key="link.id"
              :href="`#${link.id}`"
              class="transition-colors text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              :class="[
                link.depth === 3 ? 'ml-4 text-xs' : '',
                link.depth > 3 ? 'ml-8 text-xs' : '',
              ]"
            >
              {{ link.text }}
            </a>
          </nav>
        </details>

        <main
          class="prose prose-zinc dark:prose-invert prose-lg prose-headings:font-heading prose-headings:font-black prose-a:text-emerald-500 dark:prose-a:text-emerald-400 hover:prose-a:text-emerald-600 dark:hover:prose-a:text-emerald-300 prose-img:rounded-xl max-w-none text-zinc-700 dark:text-zinc-300"
        >
          <ContentRenderer :value="page" />
        </main>
      </div>

      <aside class="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
        <div
          class="p-6 border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/50 rounded-2xl"
        >
          <div class="flex items-center gap-2 mb-6">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <h3
              class="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold"
            >
              Table of Contents
            </h3>
          </div>

          <nav
            v-if="page?.body?.toc?.links?.length"
            class="flex flex-col gap-3 text-sm font-sans"
          >
            <a
              v-for="link in page.body.toc.links"
              :key="link.id"
              :href="`#${link.id}`"
              class="transition-colors group block relative pl-4"
              :class="
                activeId === link.id
                  ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
              "
            >
              <span
                class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-emerald-500 transition-all duration-300"
                :class="
                  activeId === link.id ? 'h-full' : 'h-0 group-hover:h-1/2'
                "
              ></span>
              <span
                :class="[
                  link.depth === 3 ? 'ml-3 text-xs' : '',
                  link.depth > 3 ? 'ml-6 text-xs' : '',
                ]"
                class="line-clamp-2 leading-snug"
              >
                {{ link.text }}
              </span>
            </a>
          </nav>
          <p
            v-else
            class="text-xs font-mono text-zinc-500 uppercase tracking-widest"
          >
            No structure defined.
          </p>
        </div>
      </aside>
    </div>

    <div
      class="mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row justify-between gap-6 pb-24"
    >
      <NuxtLink
        v-if="prevArticle"
        :to="prevArticle.path"
        class="group flex-1 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
      >
        <div
          class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3"
        >
          <ArrowLeft
            class="w-3 h-3 group-hover:-translate-x-1 transition-transform"
          />
          Previous Entry
        </div>
        <h3 class="font-heading text-2xl text-zinc-900 dark:text-zinc-100">
          {{ prevArticle.title }}
        </h3>
      </NuxtLink>
      <div v-else class="flex-1"></div>

      <NuxtLink
        to="/"
        class="flex items-center justify-center gap-2 px-6 py-4 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <Grid class="w-4 h-4" />
        All Logs
      </NuxtLink>

      <NuxtLink
        v-if="nextArticle"
        :to="nextArticle.path"
        class="group flex-1 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-right"
      >
        <div
          class="flex items-center justify-end gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3"
        >
          Next Entry
          <ArrowRight
            class="w-3 h-3 group-hover:translate-x-1 transition-transform"
          />
        </div>
        <h3 class="font-heading text-2xl text-zinc-900 dark:text-zinc-100">
          {{ nextArticle.title }}
        </h3>
      </NuxtLink>
      <div v-else class="flex-1"></div>
    </div>
  </article>
</template>
