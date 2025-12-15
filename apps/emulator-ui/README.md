# Emulator UI

A browser-based emulator for the Holiday Lights LED matrix display.

## Development

```bash
npm run dev
```

## Assets

Assets are stored in `public/assets/` and are automatically served by Vite.

The app includes automatic fallback logic:
- **Primary path**: `/assets/` (standard Vite behavior)
- **Fallback path**: `/public/assets/` (for environments like StackBlitz where the public directory is served differently)

If an image fails to load from the primary path, the browser will automatically try the fallback path. This ensures the app works consistently across all hosting environments without any configuration.

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

The app uses relative paths (`base: './'` in Vite config) and includes automatic path fallback logic, making it work seamlessly across different hosting environments including local development, production builds, and platforms like StackBlitz.

