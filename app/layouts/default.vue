<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Menu, X, Search, Clock, Tag, List } from "lucide-vue-next";
import { useRoute } from "vue-router";
import AppSidebar from "~/components/AppSidebar.vue";

const route = useRoute();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const isSearchOpen = ref(false);

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const { data: recentArticles } = await useAsyncData("layout-recent", () => {
  return queryCollection("writing").order("date", "DESC").limit(3).all();
});

const { data: allWritings } = await useAsyncData("layout-tags", () => {
  return queryCollection("writing").all();
});

const trendingTags = computed(() => {
  if (!allWritings.value) return [];
  const tags = allWritings.value.flatMap((p) => p.tags || []);
  const counts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((t) => t[0]);
});

const currentCollection = computed(() => {
  if (route.path.startsWith("/ctf/") && route.path.length > 5) return "ctf";
  if (route.path.startsWith("/infrastructure/") && route.path.length > 16)
    return "infrastructure";
  if (route.path.startsWith("/writing/") && route.path.length > 9)
    return "writing";
  return null;
});

const { data: currentDoc, refresh } = await useAsyncData("layout-doc", () => {
  if (currentCollection.value) {
    return queryCollection(currentCollection.value).path(route.path).first();
  }
  return null;
});

const activeId = ref("");
let observer = null;

const setupObserver = () => {
  if (observer) observer.disconnect();
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
};

watch(
  () => route.path,
  () => {
    refresh();
    setupObserver();
  },
);

onMounted(() => {
  setupObserver();
});

onUnmounted(() => {
  observer?.disconnect();
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
  <div class="min-h-screen flex transition-colors duration-300">
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-zinc-950/80 z-40 lg:hidden backdrop-blur-sm"
    ></div>

    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 lg:ml-72 flex flex-col min-h-screen w-full">
      <header
        class="h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-transparent"
      >
        <div class="flex items-center gap-4">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 -ml-2 text-zinc-900 dark:text-zinc-100"
          >
            <Menu v-if="!isSidebarOpen" :size="24" />
            <X v-else :size="24" />
          </button>

          <nav
            aria-label="Breadcrumb"
            class="hidden sm:flex font-mono text-xs text-zinc-400 uppercase tracking-widest"
          >
            <ol class="flex items-center gap-2">
              <li>
                <NuxtLink
                  to="/"
                  class="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >szuryuu</NuxtLink
                >
              </li>
              <li v-if="$route.path !== '/'">
                <span class="text-zinc-600 dark:text-zinc-500">/</span>
              </li>
              <li v-if="$route.path !== '/'">
                <NuxtLink
                  :to="$route.path"
                  class="text-zinc-900 dark:text-zinc-100"
                  >{{ $route.path.split("/")[1] || "blog" }}</NuxtLink
                >
              </li>
            </ol>
          </nav>
        </div>

        <button
          @click="toggleSearch"
          class="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors text-zinc-500 dark:text-zinc-400"
          aria-label="Search"
        >
          <Search :size="16" />
          <span class="text-sm font-sans hidden sm:inline-block"
            >Search...</span
          >
          <kbd
            class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-300/50 dark:bg-zinc-700/50 text-[10px] font-mono font-bold text-zinc-600 dark:text-zinc-300"
          >
            <span class="text-xs">Ctrl</span> K
          </kbd>
        </button>
      </header>

      <div
        class="flex flex-1 w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-12 gap-12 lg:gap-16"
      >
        <main class="flex-1 min-w-0 max-w-4xl w-full mx-auto">
          <slot />
        </main>

        <aside
          class="hidden xl:flex w-64 shrink-0 sticky top-28 self-start flex-col gap-8"
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
                to="/tags"
                class="px-2 py-1 bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 transition-colors"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>

          <template v-if="currentDoc?.body?.toc?.links?.length">
            <div class="w-full h-px bg-zinc-200 dark:bg-zinc-800/50"></div>

            <div
              class="flex flex-col gap-4 border-l-2 border-zinc-200 dark:border-zinc-800 pl-4"
            >
              <div class="flex items-center gap-2">
                <List :size="14" class="text-emerald-500" />
                <h3
                  class="font-mono text-xs uppercase tracking-widest text-zinc-900 dark:text-zinc-100 font-bold"
                >
                  Contents
                </h3>
              </div>
              <nav class="flex flex-col gap-2.5 text-sm font-sans">
                <a
                  v-for="link in currentDoc.body.toc.links"
                  :key="link.id"
                  :href="`#${link.id}`"
                  class="transition-colors group block relative pl-3"
                  :class="
                    activeId === link.id
                      ? 'text-zinc-900 dark:text-zinc-100 font-medium'
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
            </div>
          </template>
        </aside>
      </div>

      <footer
        class="py-12 text-center font-mono text-xs text-zinc-400 uppercase tracking-widest"
      >
        &copy; {{ new Date().getFullYear() }} szuryuu
      </footer>
    </div>

    <div
      v-if="isSearchOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
    >
      <div
        @click="toggleSearch"
        class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
      ></div>
      <div
        class="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 mx-4"
      >
        <div
          class="flex items-center px-4 py-4 border-b border-zinc-100 dark:border-zinc-800"
        >
          <Search :size="20" class="text-zinc-400" />
          <input
            type="text"
            placeholder="Search articles, CTFs, or infrastructure..."
            class="flex-1 bg-transparent border-none outline-none px-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 font-sans"
            autofocus
          />
          <button
            @click="toggleSearch"
            class="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded"
          >
            <X :size="20" />
          </button>
        </div>
        <div
          class="p-4 min-h-[300px] flex flex-col items-center justify-center text-zinc-500 font-sans"
        >
          Search functionality will be implemented soon.
        </div>
      </div>
    </div>
  </div>
</template>
