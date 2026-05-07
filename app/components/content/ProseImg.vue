<script setup>
import { computed } from "vue";
import { useRuntimeConfig } from "#imports";

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  alt: {
    type: String,
    default: "",
  },
  width: {
    type: [String, Number],
    default: undefined,
  },
  height: {
    type: [String, Number],
    default: undefined,
  },
});

const config = useRuntimeConfig();

const refinedSrc = computed(() => {
  const base = config.app.baseURL;
  if (base && base !== "/" && props.src?.startsWith(base)) {
    return props.src.slice(base.length - 1);
  }
  return props.src;
});
</script>

<template>
  <NuxtImg
    :src="refinedSrc"
    :alt="alt"
    :width="width"
    :height="height"
    format="webp"
    loading="lazy"
    class="rounded-2xl my-8 w-full object-cover border border-zinc-200 dark:border-zinc-800"
  />
</template>
