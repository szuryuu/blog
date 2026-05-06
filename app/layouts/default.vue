<script setup>
import { ref } from "vue";
import { Menu, X, Search } from "lucide-vue-next";
import AppSidebar from "~/components/AppSidebar.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const isSearchOpen = ref(false);
const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
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
        class="h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-30 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl"
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

      <main class="flex-1 max-w-4xl w-full mx-auto p-6 lg:p-12">
        <slot />
      </main>

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
