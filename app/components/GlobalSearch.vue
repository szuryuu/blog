<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { Search, X, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const searchQuery = ref("");
const debouncedQuery = ref("");
const searchInput = ref(null);
const searchContainer = ref(null);

let timeout = null;

watch(searchQuery, (newVal) => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => {
    debouncedQuery.value = newVal;
  }, 300);
});

watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await nextTick();
      searchInput.value?.focus();
    } else {
      searchQuery.value = "";
      debouncedQuery.value = "";
    }
  },
);

const { data: filteredResults } = await useAsyncData(
  "search-data",
  () => {
    if (!debouncedQuery.value.trim()) return Promise.resolve([]);
    return $fetch("/api/search", { params: { q: debouncedQuery.value } });
  },
  { watch: [debouncedQuery] },
);

const handleEscape = (e) => {
  if (e.key === "Escape" && props.isOpen) {
    emit("close");
  }
};

const handleTab = (e) => {
  if (!props.isOpen || e.key !== "Tab") return;
  if (!searchContainer.value) return;

  const focusable = searchContainer.value.querySelectorAll(
    "input, button, a[href]",
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleEscape);
  window.addEventListener("keydown", handleTab);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);
  window.removeEventListener("keydown", handleTab);
});
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4"
  >
    <div
      @click="$emit('close')"
      class="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
    ></div>
    <div
      ref="searchContainer"
      class="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col"
    >
      <div
        class="flex items-center px-4 py-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0"
      >
        <Search :size="20" class="text-zinc-400 shrink-0" />
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          placeholder="Search articles, CTFs, or infrastructure..."
          class="flex-1 bg-transparent border-none outline-none px-4 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 font-sans text-sm sm:text-base"
        />
        <button
          @click="$emit('close')"
          class="p-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded shrink-0"
        >
          <X :size="20" />
        </button>
      </div>

      <div
        class="flex flex-col w-full max-h-[50vh] sm:max-h-[400px] overflow-y-auto"
      >
        <div
          v-if="!debouncedQuery"
          class="p-8 text-center text-zinc-500 font-sans text-sm sm:text-base"
        >
          Type to start searching...
        </div>

        <div
          v-else-if="!filteredResults || filteredResults.length === 0"
          class="p-8 text-center text-zinc-500 font-sans text-sm sm:text-base"
        >
          No results found for "{{ debouncedQuery }}".
        </div>

        <div v-else class="flex flex-col p-2 gap-1">
          <NuxtLink
            v-for="post in filteredResults"
            :key="post.path"
            :to="post.path"
            @click="$emit('close')"
            class="group flex flex-col gap-1 p-4 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors w-full min-w-0"
          >
            <div class="flex items-start justify-between gap-4 w-full min-w-0">
              <span
                class="font-heading text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors truncate"
              >
                {{ post.title }}
              </span>
              <ChevronRight
                class="w-4 h-4 text-zinc-400 group-hover:text-emerald-500 transition-colors shrink-0 mt-1"
              />
            </div>
            <span
              class="text-sm font-sans text-zinc-500 dark:text-zinc-400 truncate w-full"
            >
              {{ post.description }}
            </span>
            <div class="flex flex-wrap gap-2 mt-2 w-full">
              <span
                v-for="tag in post.tags || post.tech"
                :key="tag"
                class="font-mono text-[9px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
