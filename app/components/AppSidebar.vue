<script setup>
import {
  Terminal,
  Shield,
  Network,
  Github,
  Linkedin,
  Instagram,
  MapPin,
} from "lucide-vue-next";

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["close"]);
</script>

<template>
  <aside
    :class="[
      'w-72 fixed inset-y-0 left-0 bg-zinc-950 border-r-2 border-zinc-800 flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <div class="p-8 flex flex-col items-center border-b-2 border-zinc-800">
      <img
        src="/hero.png"
        alt="Profile"
        class="w-32 h-32 rounded-full border-4 border-zinc-100 object-cover mb-4"
      />
      <NuxtLink
        @click="$emit('close')"
        to="/"
        class="font-heading text-3xl font-black text-zinc-100 tracking-wider hover:text-zinc-300 transition-colors"
      >
        szuryuu
      </NuxtLink>
      <p class="text-zinc-400 font-mono text-sm mt-2 text-center">
        DevSecOps & Infrastructure
      </p>
      <div
        class="flex items-center gap-1.5 mt-3 text-xs text-zinc-500 font-mono uppercase tracking-widest"
      >
        <MapPin :size="14" />
        <span>Sleman, ID</span>
      </div>
    </div>

    <nav class="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
      <NuxtLink
        @click="$emit('close')"
        to="/"
        class="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md font-mono text-sm transition-all border-2 border-transparent hover:border-zinc-700"
      >
        <Terminal :size="18" />
        <span>Terminal (Home)</span>
      </NuxtLink>
      <NuxtLink
        @click="$emit('close')"
        to="/ctf"
        class="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md font-mono text-sm transition-all border-2 border-transparent hover:border-zinc-700"
      >
        <Shield :size="18" />
        <span>CTF Writeups</span>
      </NuxtLink>
      <NuxtLink
        @click="$emit('close')"
        to="/infrastructure"
        class="flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-md font-mono text-sm transition-all border-2 border-transparent hover:border-zinc-700"
      >
        <Network :size="18" />
        <span>Infrastructure Logs</span>
      </NuxtLink>
    </nav>

    <div class="p-6 border-t-2 border-zinc-800 flex justify-center gap-2">
      <a
        href="https://github.com/szuryuu"
        target="_blank"
        class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
      >
        <Github :size="20" />
      </a>
      <a
        href="https://www.linkedin.com/in/shafwan-ilham-dzaky/"
        target="_blank"
        class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
      >
        <Linkedin :size="20" />
      </a>
      <a
        href="https://www.instagram.com/szuryuu/"
        target="_blank"
        class="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
      >
        <Instagram :size="20" />
      </a>
    </div>
  </aside>
</template>
