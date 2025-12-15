# Emulator UI

A browser-based emulator for the Holiday Lights LED matrix display.

## Development

```bash
npm run dev
```

## Assets

Assets are stored in `public/assets/` and are automatically served at `/assets/` by Vite in both development and production builds.

The Vite build plugin automatically copies assets from `libs/imager-core/src/assets/` to `public/assets/` during the build process.

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Deployment

The app uses relative paths (`base: './'` in Vite config) and works consistently across different hosting environments including local development, production builds, and platforms like StackBlitz.

