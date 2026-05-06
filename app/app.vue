<script setup>
useHead({
  script: [
    {
      innerHTML: `
        if (localStorage.getItem('theme-preference') === 'dark' || (!('theme-preference' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      `,
      type: "text/javascript",
    },
  ],
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
