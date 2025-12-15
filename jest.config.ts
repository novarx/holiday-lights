import type { Config } from 'jest';

const config: Config = {
  projects: [
    '<rootDir>/apps/emulator',
    '<rootDir>/apps/holiday-lights-service',
    '<rootDir>/libs/imager-core',
  ],
};

export default config;
