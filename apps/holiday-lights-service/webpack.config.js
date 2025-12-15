const { join, resolve } = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

// Lazy-loaded modules that NestJS tries to require optionally
const lazyImports = [
  '@nestjs/microservices',
  '@nestjs/microservices/microservices-module',
  '@nestjs/websockets',
  '@nestjs/websockets/socket-module',
  '@nestjs/platform-socket.io',
  'cache-manager',
  'class-validator',
  'class-transformer',
];

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
  output: {
    path: join(__dirname, '../../dist/apps/holiday-lights-service'),
    filename: 'main.js',
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@holiday-lights/imager-core': resolve(__dirname, '../../libs/imager-core/src/index.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.app.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.node$/,
        use: 'node-loader',
      },
    ],
  },
  externals: [
    nodeExternals({
      modulesFromFile: true,
      allowlist: [/@holiday-lights\/imager-core/],
    }),
    'rpi-led-matrix',
  ],
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets', noErrorOnMissing: true },
      ],
    }),
    {
      apply: (compiler) => {
        compiler.hooks.normalModuleFactory.tap('IgnorePlugin', (factory) => {
          factory.hooks.beforeResolve.tap('IgnorePlugin', (resolveData) => {
            if (lazyImports.includes(resolveData.request)) {
              return false;
            }
          });
        });
      },
    },
  ],
  optimization: {
    minimize: false,
  },
  ignoreWarnings: [
    {
      module: /node_modules/,
      message: /Can't resolve/,
    },
  ],
};
