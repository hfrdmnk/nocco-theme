# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a custom Ghost theme ("nocco") for dominikhofer.me. It's based on Ghost's Starter theme and uses Handlebars templating with Tailwind CSS v4 and PostCSS for styling.

## Commands

```bash
pnpm install        # Install dependencies
pnpm run dev        # Start development with livereload (watches .hbs, .css, .js files)
pnpm run build      # Build production assets to assets/built/
pnpm run test       # Run gscan to validate theme compatibility with Ghost
pnpm run zip        # Build and create theme zip for upload
```

## Architecture

### Build System
- **Rollup** bundles JS and CSS into `assets/built/`
- **Entry point**: `assets/js/index.js` imports both JS modules and CSS
- **PostCSS** with `@tailwindcss/postcss` processes CSS (configured in `postcss.config.mjs`)
- Development mode includes livereload that watches `.hbs` files

### Template Hierarchy (Handlebars)
- `default.hbs` - Base layout (includes head, header, footer)
- `index.hbs` - Homepage
- `post.hbs` - Individual posts
- `page.hbs` - Static pages
- `tag.hbs` / `author.hbs` - Archive pages
- `partials/` - Reusable components (e.g., `card.hbs` for post cards)
- Custom templates: `page-{slug}.hbs`, `tag-{slug}.hbs`, `author-{slug}.hbs`

### CSS Structure (`assets/css/`)
- `index.css` - Main entry, imports all other CSS
- `vars.css` - CSS custom properties (colors, fonts, breakpoints)
- `components/` - Base styles (global, forms, buttons)
- `ghost/` - Ghost-specific layouts (header, footer, content, members, etc.)

### Content Types (Ghost internal tags)
- **Post**: Regular blog posts
- **Note**: Ghost v6 native notes (social-style short posts)
- **Photo** (`#photo`): Instagram-style image posts
- **Race** (`#race`): Running activity posts with route SVGs
- **Link** (`#link`): Bookmarks/shared links

### Responsive Image Handling
Templates use Ghost's `img_url` helper with multiple sizes (xxs→xl) and formats (avif, webp, fallback). Image sizes are defined in `package.json` under `config.image_sizes`.

## Ghost-Specific Notes

- Ghost Admin automatically reloads themes in development
- The theme must pass `gscan` validation before upload
- `{{ghost_head}}` and `{{ghost_foot}}` are required in `default.hbs`
- Navigation is managed in Ghost Admin, rendered via `{{navigation}}`
