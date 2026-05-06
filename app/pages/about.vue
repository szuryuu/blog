<script setup>
import { ExternalLink } from "lucide-vue-next";

useSeoMeta({
  title: "About",
  description: "Tentang blog ini dan penulisnya.",
});
</script>

<template>
  <div class="pt-8">
    <h1
      class="font-heading text-6xl sm:text-7xl md:text-8xl mb-12 text-ghost dark:text-ghost-dark tracking-wide leading-none"
    >
      ABOUT
    </h1>

    <div class="max-w-2xl">
      <p
        class="text-zinc-600 dark:text-zinc-400 font-sans text-lg leading-relaxed mb-10"
      >
        Blog ini adalah repositori publik yang berisi catatan teknis, eksplorasi
        infrastruktur, writeup CTF, dan dokumentasi proyek. Ruang ini didesain
        sebagai arsip personal yang mencerminkan perjalanan dan pemikiran dalam
        bidang software engineering serta keamanan sistem.
      </p>

      <a
        href="https://szuryuu.github.io"
        target="_blank"
        class="inline-flex items-center gap-3 px-6 py-4 bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95"
      >
        <span>View Full Profile</span>
        <ExternalLink class="w-4 h-4" />
      </a>
    </div>
  </div>
</template>
