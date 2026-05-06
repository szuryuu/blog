import { ref, onMounted } from "vue";

export const useTheme = () => {
  const isDark = ref(false);

  onMounted(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });

  const toggleTheme = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme-preference", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme-preference", "light");
    }
  };

  return { isDark, toggleTheme };
};
