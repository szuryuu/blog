<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Pin, ChevronDown, X, Check, Filter } from "lucide-vue-next";

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
  tagFilter: {
    type: String,
    default: null,
  },
});

const { data: posts } = await useAsyncData(
  `list-${Array.isArray(props.collection) ? props.collection.join("-") : props.collection}-${props.tagFilter || "all"}`,
  () => {
    const cols = Array.isArray(props.collection)
      ? props.collection.join(",")
      : props.collection;

    return $fetch("/api/posts", {
      params: {
        collections: cols,
        tag: props.tagFilter || "all",
      },
    });
  },
  { watch: [() => props.tagFilter, () => props.collection] },
);

const isDropdownOpen = ref(false);
const activeTags = ref([]);
const dropdownRef = ref(null);

const availableTags = computed(() => {
  if (!posts.value) return [];
  const tags = new Set();
  for (const post of posts.value) {
    const pTags = [...(post.tags || []), ...(post.tech || [])];
    pTags.forEach((t) => tags.add(t));
  }
  return Array.from(tags).sort();
});

const toggleTag = (tag) => {
  const index = activeTags.value.indexOf(tag);
  if (index > -1) {
    activeTags.value.splice(index, 1);
  } else {
    activeTags.value.push(tag);
  }
};

const clearTags = () => {
  activeTags.value = [];
};

const filteredPosts = computed(() => {
  if (!posts.value) return [];
  if (activeTags.value.length === 0) return posts.value;

  return posts.value.filter((post) => {
    const postTags = [...(post.tags || []), ...(post.tech || [])];
    return activeTags.value.every((t) => postTags.includes(t));
  });
});

const pinnedPosts = computed(() => {
  return filteredPosts.value.filter((post) => post.featured);
});

const allRegularPosts = computed(() => {
  return filteredPosts.value.filter((post) => !post.featured);
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

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
});

useSeoMeta({
  title: props.title,
  description: `Archive of ${props.title.toLowerCase()} entries.`,
});
</script>

<template>
  <div class="pt-8 w-full min-w-0">
    <h1
      class="font-heading text-6xl sm:text-7xl md:text-8xl mb-10 text-ghost dark:text-ghost-dark tracking-wide leading-none uppercase break-words w-full"
    >
      {{ title }}
    </h1>

    <div
      v-if="availableTags.length > 0"
      class="mb-14 relative"
      ref="dropdownRef"
    >
      <div class="flex flex-wrap items-center gap-3">
        <button
          @click.stop="isDropdownOpen = !isDropdownOpen"
          class="flex items-center gap-3 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 z-20"
        >
          <Filter :size="14" />
          <span>Filter Signals</span>
          <ChevronDown
            :size="14"
            class="transition-transform duration-300"
            :class="{ 'rotate-180': isDropdownOpen }"
          />
        </button>

        <div
          v-if="activeTags.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <button
            v-for="tag in activeTags"
            :key="tag"
            @click="toggleTag(tag)"
            class="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg font-mono text-[10px] uppercase tracking-widest hover:bg-emerald-500/20 transition-colors"
          >
            <span>{{ tag }}</span>
            <X :size="10" />
          </button>
          <button
            @click="clearTags"
            class="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 ml-2"
          >
            Clear All
          </button>
        </div>
      </div>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <div
          v-if="isDropdownOpen"
          class="absolute top-full left-0 mt-3 w-72 max-h-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
        >
          <div
            class="p-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50"
          >
            <span
              class="font-mono text-[10px] uppercase tracking-widest text-zinc-400 font-bold"
              >Select Tags</span
            >
          </div>
          <div class="overflow-y-auto p-2 flex flex-col gap-1">
            <button
              v-for="tag in availableTags"
              :key="tag"
              @click="toggleTag(tag)"
              class="flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors font-mono text-[10px] uppercase tracking-widest"
              :class="[
                activeTags.includes(tag)
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
              ]"
            >
              <span>{{ tag }}</span>
              <Check
                v-if="activeTags.includes(tag)"
                :size="12"
                class="text-emerald-500"
              />
            </button>
          </div>
        </div>
      </Transition>
    </div>

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

    <div
      v-else-if="pinnedPosts.length === 0 && regularPosts.length === 0"
      class="max-w-2xl w-full"
    >
      <p class="text-zinc-500 font-sans text-lg leading-relaxed mb-4">
        Zero matches found for the selected tag configuration.
      </p>
      <button
        @click="clearTags"
        class="text-xs font-mono uppercase tracking-widest text-emerald-500 hover:text-emerald-600 transition-colors underline underline-offset-4"
      >
        Reset Filter
      </button>
    </div>
  </div>
</template>
