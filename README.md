# szuryuu's blog

Personal technical blog built with **Nuxt 4** and **Nuxt Content**.

This repository contains a statically generated blog focused on technical notes, infrastructure, CTF write-ups, and DevSecOps-related content.

## Features

- Static site generation with Nuxt (`nuxt generate`)
- Content-driven pages powered by `@nuxt/content`
- Multiple content categories:
  - Writing
  - CTF
  - Infrastructure
  - Projects
- Tag-based browsing page (`/tags`)
- GitHub Pages deployment-ready configuration

## Tech stack

- [Nuxt 4](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [@nuxt/content](https://content.nuxt.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@nuxt/image](https://image.nuxt.com/)
- [@nuxt/fonts](https://fonts.nuxt.com/)

## Requirements

- [Bun](https://bun.sh/) (recommended, based on `bun.lock`)
- Node.js 20+ should also work with npm/pnpm/yarn

## Getting started

### 1) Install dependencies

Using Bun (recommended):

```bash
bun install
```

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

Using yarn:

```bash
yarn install
```

### 2) Run local development server

```bash
bun run dev
```

Nuxt runs on `http://localhost:3000` by default.

## Available scripts

- `bun run dev` — Start development server
- `bun run build` — Build production app
- `bun run generate` — Generate static site
- `bun run preview` — Preview production build

> Equivalent commands are available with other package managers, e.g. `npm run dev`.

## Project structure

```text
app/
  components/
  layouts/
  pages/
content/
  writing/
  ctf/
  infrastructure/
public/
nuxt.config.ts
content.config.ts
```

## Content model

Content is managed through `@nuxt/content` collections in `content.config.ts`.

### Article collections

Collections:

- `writing` → `content/writing/**/*.md`
- `ctf` → `content/ctf/**/*.md`
- `infrastructure` → `content/infrastructure/**/*.md`

Required/optional frontmatter fields:

- `title` (string)
- `description` (string)
- `date` (string)
- `tags` (string[], default: `[]`)
- `cover` (string, optional)
- `featured` (boolean, default: `false`)
- `order` (number, default: `0`)

### Projects collection

Collection:

- `projects` → `content/project/**/*.md`

Frontmatter fields include:

- `title`, `type`, `year`, `description`
- `tech` (string[])
- `image`, `github`, `live` (optional)
- `featured`, `order`
- `status`, `duration`, `team_size`, `role` (optional)

## Deployment notes

This project is configured for **GitHub Pages** static deployment in `nuxt.config.ts`:

- Nitro preset: `github-pages`
- Base URL: `/blog/`
- Prerendering enabled (`crawlLinks: true`)

Generate static output:

```bash
bun run generate
```

## Notes

- Site metadata (default description/title template, language) is configured in `nuxt.config.ts`.
- Global styling is loaded from `assets/css/main.css`.

## License

No license has been specified yet.
