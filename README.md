# Fateh Plumbing & Electric Astro Site

This folder is the Astro version of the current static website.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

The Astro config uses `build.format = "file"` so pages can keep `.html` style output such as `services.html`.

## Notes

- Shared assets live in `public/assets`.
- Shared CSS and JavaScript live in `public/styles.css` and `public/script.js`.
- Pages are in `src/pages`.
- The current conversion preserves the existing design and page content first. Future cleanup can move header, footer, service cards, and page data into reusable Astro components.

