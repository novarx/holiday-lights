# Migration from Nx to npm workspaces - Complete!

The project has been converted from Nx to npm workspaces. 

## Quick Start

### 1. Reinstall dependencies:

```bash
rm -rf node_modules
rm package-lock.json
npm install
```

## 2. Available Scripts

### Root-level commands:
- `npm run build` - Build all workspaces
- `npm run serve` - Serve all workspaces
- `npm run test` - Run tests in all workspaces
- `npm run lint` - Lint all workspaces

### Individual workspace commands:
- `npm run build:emulator` - Build emulator app
- `npm run serve:emulator` - Serve emulator app
- `npm run test:emulator` - Test emulator app
- `npm run build:service` - Build holiday-lights-service app
- `npm run serve:service` - Serve holiday-lights-service app
- `npm run test:service` - Test holiday-lights-service app
- `npm run build:imager-core` - Build imager-core library
- `npm run test:imager-core` - Test imager-core library

### Working with individual workspaces:
```bash
# Navigate to workspace and run commands directly
cd apps/emulator
npm run build
npm run serve
npm run test
npm run lint
```

## 3. Project Structure

```
holiday-lights/
├── package.json          # Root package.json with workspaces config
├── angular.json          # Angular CLI configuration for emulator
├── tsconfig.base.json    # Shared TypeScript configuration
├── jest.config.ts        # Root Jest configuration
├── jest.preset.js        # Shared Jest preset
├── eslint.config.mjs     # Root ESLint configuration
├── apps/
│   ├── emulator/         # Angular frontend app
│   │   └── package.json  # Workspace-specific package.json
│   └── holiday-lights-service/  # NestJS backend service
│       └── package.json  # Workspace-specific package.json
└── libs/
    └── imager-core/      # Shared library
        └── package.json  # Workspace-specific package.json
```

## 4. Dependencies Between Packages

The `@holiday-lights/imager-core` library is used by both apps. In npm workspaces, it's referenced as:
- `"@holiday-lights/imager-core": "*"` in each app's package.json

TypeScript path mapping is handled in `tsconfig.base.json`:
```json
{
  "paths": {
    "@holiday-lights/imager-core": ["libs/imager-core/src/index.ts"]
  }
}
```

