<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tag = computed(() => String(route.params.slug || ""));
</script>

<template>
  <ListLayout
    :title="`#${tag.toUpperCase()}`"
    :collection="['writing', 'ctf', 'infrastructure', 'projects']"
    :tag-filter="tag"
    empty-message="No transmissions found for this tag."
  />
</template>
