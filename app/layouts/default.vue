<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Menu, X, Search, Clock, Tag, List, ArrowUp } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import AppSidebar from "~/components/AppSidebar.vue";

const route = useRoute();
const router = useRouter();
const nuxtApp = useNuxtApp();

const isSidebarOpen = ref(false);
const isTocOpen = ref(false);
const isSearchOpen = ref(false);
const showBackToTop = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const handleGlobalKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    isSearchOpen.value = true;
  }
};

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const { data: recentArticles } = await useAsyncData(
  "layout-recent",
  () => queryCollection("writing").order("date", "DESC").limit(3).all(),
  {
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

const { data: trendingTags } = await useAsyncData(
  "layout-tags",
  () => $fetch("/api/tags", { params: { limit: 5 } }),
  {
    getCachedData: (key) =>
      nuxtApp.payload.data[key] || nuxtApp.static.data[key],
  },
);

const currentCollection = computed(() => {
  if (route.path.startsWith("/ctf/")) return "ctf";
  if (route.path.startsWith("/infrastructure/")) return "infrastructure";
  if (route.path.startsWith("/writing/")) return "writing";
  if (route.path.startsWith("/project/")) return "projects";
  return null;
});

const { data: currentDoc } = await useAsyncData(
  () => `layout-doc-${route.path}`,
  () =>
    currentCollection.value
      ? queryCollection(currentCollection.value).path(route.path).first()
      : null,
  { watch: [() => route.path] },
);

const activeId = ref("");
let observer = null;

const setupObserver = () => {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeId.value = entry.target.id;
      });
    },
    { rootMargin: "-120px 0px -60% 0px" },
  );
  document.querySelectorAll("main h2, main h3").forEach((h) => {
    if (h.id) observer.observe(h);
  });
};

const scrollToHeading = (id) => {
  activeId.value = id;
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: "smooth" });
    router.push({ hash: `#${id}` }).catch(() => {});
  }
};

onMounted(() => {
  setupObserver();
  window.addEventListener("keydown", handleGlobalKeydown);
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
  window.removeEventListener("keydown", handleGlobalKeydown);
  window.removeEventListener("scroll", handleScroll);
});

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
</script>

<template>
  <div
    class="min-h-screen flex transition-colors duration-300 w-full overflow-x-clip"
  >
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-zinc-950/80 z-40 lg:hidden backdrop-blur-sm"
    ></div>
    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div v-if="isTocOpen" class="fixed inset-0 z-50 xl:hidden flex justify-end">
      <div
        @click="isTocOpen = false"
        class="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm"
      ></div>
      <aside
        class="relative w-72 h-full bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col shadow-2xl"
      >
        <div
          class="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800"
        >
          <div class="flex items-center gap-2 text-emerald-500">
            <List :size="18" />
            <h3
              class="font-mono text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold"
            >
              Contents
            </h3>
          </div>
          <button
            @click="isTocOpen = false"
            class="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X :size="20" />
          </button>
        </div>
        <nav
          class="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-sm font-sans"
        >
          <a
            v-for="link in currentDoc?.body?.toc?.links"
            :key="link.id"
            :href="`#${link.id}`"
            @click.prevent="
              scrollToHeading(link.id);
              isTocOpen = false;
            "
            class="transition-colors group block relative pl-3"
            :class="
              activeId === link.id
                ? 'text-zinc-900 dark:text-zinc-100 font-medium'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            "
          >
            <span
              class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 bg-emerald-500 transition-all duration-300"
              :class="activeId === link.id ? 'h-full' : 'h-0 group-hover:h-1/2'"
            ></span>
            <span
              :class="link.depth === 3 ? 'ml-3 text-xs' : ''"
              class="line-clamp-2 leading-snug"
            >
              {{ link.text }}
            </span>
          </a>
        </nav>
      </aside>
    </div>

    <div class="flex-1 lg:ml-72 flex flex-col min-h-screen w-full min-w-0">
      <header
        class="h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-transparent"
      >
        <div class="flex items-center gap-4">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 text-zinc-900 dark:text-zinc-100"
          >
            <Menu v-if="!isSidebarOpen" :size="24" />
            <X v-else :size="24" />
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="currentDoc?.body?.toc?.links?.length"
            @click="isTocOpen = true"
            class="xl:hidden flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400"
          >
            <List :size="16" />
          </button>
          <button
            @click="toggleSearch"
            class="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400"
          >
            <Search :size="16" />
            <span class="text-sm font-sans hidden sm:inline-block"
              >Search...</span
            >
            <kbd
              class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-300/50 dark:bg-zinc-700/50 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300"
            >
              Ctrl K
            </kbd>
          </button>
        </div>
      </header>

      <div
        class="flex flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-12 gap-12 lg:gap-16"
      >
        <main class="flex-1 min-w-0 max-w-4xl w-full mx-auto flex flex-col">
          <slot />
          <footer
            class="mt-auto pt-12 pb-4 font-mono text-xs text-zinc-400 uppercase tracking-widest text-left"
          >
            &copy; {{ new Date().getFullYear() }} szuryuu
          </footer>
        </main>
        <aside
          class="hidden xl:flex w-64 shrink-0 sticky top-28 self-start flex-col gap-8 h-fit"
        >
          <div
            class="flex flex-col gap-4 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4"
          >
            <div class="flex items-center gap-2">
              <Clock :size="14" class="text-emerald-500" />
              <h3
                class="font-mono text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold"
              >
                Recent Updates
              </h3>
            </div>
            <div class="flex flex-col gap-4">
              <NuxtLink
                v-for="article in recentArticles"
                :key="article.path"
                :to="article.path"
                class="group flex flex-col gap-1"
              >
                <span
                  class="text-sm font-sans text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors line-clamp-2 leading-snug"
                >
                  {{ article.title }}
                </span>
                <span
                  class="text-[10px] font-mono text-zinc-400 dark:text-zinc-500"
                >
                  {{ formatDate(article.date) }}
                </span>
              </NuxtLink>
            </div>
          </div>
          <div class="w-full h-px bg-zinc-200 dark:bg-zinc-800/50"></div>
          <div
            class="flex flex-col gap-4 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4"
          >
            <div class="flex items-center gap-2">
              <Tag :size="14" class="text-emerald-500" />
              <h3
                class="font-mono text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold"
              >
                Trending Tags
              </h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <NuxtLink
                v-for="tag in trendingTags"
                :key="tag"
                :to="`/tags/${encodeURIComponent(tag.toLowerCase())}`"
                class="px-3 py-1 bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-full text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 transition-colors"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>

      <button
        v-if="showBackToTop"
        @click="scrollToTop"
        class="fixed bottom-8 right-8 z-40 p-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300"
        aria-label="Back to top"
      >
        <ArrowUp :size="20" />
      </button>
    </div>
    <GlobalSearch :is-open="isSearchOpen" @close="isSearchOpen = false" />
  </div>
</template>
