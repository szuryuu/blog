import { ref, watchEffect, onMounted } from "vue";

export const useTheme = () => {
  const isDark = ref(true);

  onMounted(() => {
    const storedTheme = localStorage.getItem("theme-preference");
    if (storedTheme) {
      isDark.value = storedTheme === "dark";
    } else {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  });

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  watchEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark.value) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme-preference", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme-preference", "light");
      }
    }
  });

  return { isDark, toggleTheme };
};
