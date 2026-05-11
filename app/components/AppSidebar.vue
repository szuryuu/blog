<script setup>
import {
  Home,
  Terminal,
  Shield,
  Network,
  FolderOpen,
  Tag,
  User,
  Github,
  Linkedin,
  Instagram,
  MapPin,
} from "lucide-vue-next";
import ThemeToggle from "./ThemeToggle.vue";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);

const categories = [
  { label: "Writing", path: "/writing", icon: Terminal },
  { label: "CTF", path: "/ctf", icon: Shield },
  { label: "Infrastructure", path: "/infrastructure", icon: Network },
  { label: "Projects", path: "/project-documentation", icon: FolderOpen },
];

const explore = [
  { label: "Tags", path: "/tags", icon: Tag },
  { label: "About", path: "/about", icon: User },
];
</script>

<template>
  <aside
    :class="[
      'w-72 fixed inset-y-0 left-0 bg-zinc-100 dark:bg-zinc-900 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="p-10 flex flex-col items-center">
      <img
        src="/hero.png"
        alt="Profile"
        class="w-28 h-28 rounded-3xl object-cover mb-6 grayscale hover:grayscale-0 transition-all duration-500"
      />
      <NuxtLink
        @click="$emit('close')"
        to="/"
        class="font-heading text-5xl tracking-wider transition-colors duration-300"
      >
        szuryuu
      </NuxtLink>
      <div
        class="flex items-center gap-2 mt-4 text-xs text-zinc-500 font-mono uppercase tracking-widest"
      >
        <MapPin :size="14" />
        <span>Sleman, ID</span>
      </div>
    </div>

    <nav class="flex-1 py-8 px-6 flex flex-col gap-6 overflow-y-auto">
      <div class="flex flex-col gap-2">
        <NuxtLink
          @click="$emit('close')"
          to="/"
          class="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-2xl font-mono text-sm transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
          exact-active-class="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        >
          <Home :size="18" />
          <span>Home</span>
        </NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <span
          class="px-4 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1"
        >
          Categories
        </span>
        <NuxtLink
          v-for="item in categories"
          :key="item.path"
          @click="$emit('close')"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-2xl font-mono text-sm transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
          active-class="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>

      <div class="flex flex-col gap-2">
        <span
          class="px-4 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1"
        >
          Explore
        </span>
        <NuxtLink
          v-for="item in explore"
          :key="item.path"
          @click="$emit('close')"
          :to="item.path"
          class="flex items-center gap-4 px-4 py-3 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-2xl font-mono text-sm transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
          active-class="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </div>
    </nav>

    <div
      class="p-8 flex items-center justify-center gap-4 border-t-2 border-zinc-200 dark:border-zinc-800/50"
    >
      <a
        href="https://github.com/szuryuu"
        target="_blank"
        class="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-2xl transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
      >
        <Github :size="20" />
      </a>
      <a
        href="https://www.linkedin.com/in/shafwan-ilham-dzaky/"
        target="_blank"
        class="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-2xl transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
      >
        <Linkedin :size="20" />
      </a>
      <a
        href="https://www.instagram.com/szuryuu/"
        target="_blank"
        class="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-2xl transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
      >
        <Instagram :size="20" />
      </a>
      <div class="w-px h-6 bg-zinc-300 dark:bg-zinc-700"></div>
      <ThemeToggle />
    </div>
  </aside>
</template>
