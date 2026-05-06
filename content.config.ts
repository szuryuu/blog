import { defineContentConfig, defineCollection, z } from "@nuxt/content";

// Ekstrak skema artikel agar bisa digunakan ulang untuk writing, ctf, dan infrastructure
const articleSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().min(2).max(300),
  date: z.string(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export default defineContentConfig({
  collections: {
    projects: defineCollection({
      type: "page",
      source: "project/**/*.md",
      schema: z.object({
        title: z.string().min(2).max(100),
        type: z.string().min(2).max(100),
        year: z.string().length(4),
        description: z.string().min(2).max(1000),
        image: z.string().optional(),
        tech: z.array(z.string()).min(1),
        github: z.string().url().optional(),
        live: z.string().url().optional(),
        featured: z.boolean().default(false),
        order: z.number().default(0),
        status: z.string().optional(),
        duration: z.string().optional(),
        team_size: z.number().optional(),
        role: z.string().optional(),
      }),
    }),

    writing: defineCollection({
      type: "page",
      source: "writing/**/*.md",
      schema: articleSchema,
    }),

    ctf: defineCollection({
      type: "page",
      source: "ctf/**/*.md",
      schema: articleSchema,
    }),

    infrastructure: defineCollection({
      type: "page",
      source: "infrastructure/**/*.md",
      schema: articleSchema,
    }),
  },
});
