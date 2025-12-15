/**
 * LED Matrix adapter that provides the appropriate implementation
 * based on the build environment.
 *
 * When building with NODE_ENV=raspberry, uses the real rpi-led-matrix library.
 * Otherwise, uses a mock implementation for development/testing.
 */

// This file is replaced by webpack based on the target environment
// See webpack.config.js for the alias configuration

export * from './led-matrix.mock';

