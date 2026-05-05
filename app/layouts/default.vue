<script setup>
import { ref } from "vue";
import { Menu, X } from "lucide-vue-next";
import AppSidebar from "~/components/AppSidebar.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
  <div
    class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex font-sans transition-colors duration-300"
  >
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <AppSidebar :is-open="isSidebarOpen" @close="isSidebarOpen = false" />

    <div class="flex-1 lg:ml-72 flex flex-col min-h-screen w-full">
      <header
        class="h-16 border-b-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 lg:px-8 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30"
      >
        <div class="flex items-center gap-4">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 -ml-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <Menu v-if="!isSidebarOpen" :size="24" />
            <X v-else :size="24" />
          </button>
          <div class="font-mono text-sm text-zinc-500">~/szuryuu/blog</div>
        </div>
      </header>

      <main class="flex-1 max-w-4xl w-full mx-auto p-6 lg:p-12">
        <slot />
      </main>

      <footer
        class="py-8 text-center border-t-2 border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-500"
      >
        &copy; {{ new Date().getFullYear() }} szuryuu. All systems operational.
      </footer>
    </div>
  </div>
</template>
