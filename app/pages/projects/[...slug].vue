<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import {
  ArrowLeft,
  ArrowRight,
  Grid,
  Github,
  ExternalLink,
} from "lucide-vue-next";

const route = useRoute();

const { data: page } = await useAsyncData(`project-${route.path}`, () => {
  return queryCollection("projects").path(route.path).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Project documentation not found in the database.",
    fatal: true,
  });
}

const { data: allPosts } = await useAsyncData("projects-all", () => {
  return queryCollection("projects").order("order", "ASC").all();
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
  ogImage: page.value.image,
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
      to="/project-documentation"
      class="inline-flex items-center font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-12"
    >
      <- Back to Projects
    </NuxtLink>

    <header class="mb-16">
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <span v-if="page.year" class="font-mono text-sm text-zinc-500">{{
          page.year
        }}</span>
        <span
          v-if="page.type"
          class="font-mono text-xs uppercase tracking-widest text-zinc-500 bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-1 rounded"
        >
          {{ page.type }}
        </span>
        <span
          v-if="page.status"
          class="font-mono text-xs uppercase tracking-widest text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-1 rounded"
        >
          {{ page.status }}
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

      <div v-if="page.github || page.live" class="flex flex-wrap gap-4 mb-10">
        <a
          v-if="page.github"
          :href="page.github"
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm font-mono hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
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
          class="px-2 py-1 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
        >
          {{ t }}
        </span>
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
        to="/project-documentation"
        class="flex items-center justify-center gap-2 px-6 py-4 text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
      >
        <Grid class="w-4 h-4" />
        All Projects
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
