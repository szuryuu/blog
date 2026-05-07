<script setup>
import { ref } from "vue";
import { Copy, Check } from "lucide-vue-next";

const props = defineProps({
  code: {
    type: String,
    default: "",
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array,
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
});

const copied = ref(false);

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {}
};
</script>

<template>
  <div
    class="my-8 rounded-2xl bg-zinc-900 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm"
  >
    <div
      class="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-800/30"
    >
      <span
        class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest select-none"
      >
        {{ filename || language || "Code" }}
      </span>

      <button
        @click="copyCode"
        class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all border border-zinc-700/50"
        :class="{
          'text-emerald-400 border-emerald-900/50 bg-emerald-900/20 hover:bg-emerald-900/20 hover:text-emerald-400':
            copied,
        }"
      >
        <Check v-if="copied" class="w-3.5 h-3.5" />
        <Copy v-else class="w-3.5 h-3.5" />
        <span class="text-[10px] font-mono uppercase tracking-wider">{{
          copied ? "Copied" : "Copy"
        }}</span>
      </button>
    </div>

    <pre
      :class="[
        props.class,
        'p-4 sm:p-6 !my-0 overflow-x-auto text-sm text-zinc-100 bg-transparent',
      ]"
    ><slot /></pre>
  </div>
</template>
