export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  ssr: true,
  nitro: {
    preset: "github-pages",
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },

  app: {
    baseURL: "/blog/",
    head: {
      htmlAttrs: { lang: "id" },
      titleTemplate: "%s | szuryuu",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Catatan teknis, infrastruktur, dan DevSecOps.",
        },
        { name: "format-detection", content: "telephone=no" },
      ],
    },
  },

  modules: ["@nuxt/content", "@nuxt/fonts", "@nuxt/image"],

  fonts: {
    families: [
      { name: "Londrina Solid", provider: "google" },
      { name: "Inter", provider: "google" },
    ],
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [import("@tailwindcss/vite").then((m) => m.default())],
  },
});