const { join, resolve } = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const isRaspberry = process.env.NODE_ENV === 'raspberry';
const isProduction = process.env.NODE_ENV === 'production' || isRaspberry;

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

// Determine which LED matrix implementation to use
const ledMatrixAdapter = isRaspberry
  ? resolve(__dirname, 'src/app/matrix/led-matrix.real.ts')
  : resolve(__dirname, 'src/app/matrix/led-matrix.mock.ts');

console.log(`Building for ${isRaspberry ? 'Raspberry Pi' : 'development'} environment`);
console.log(`Using LED matrix: ${isRaspberry ? 'real (rpi-led-matrix)' : 'mock'}`);

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'source-map',
  output: {
    path: join(__dirname, '../../dist/apps/holiday-lights-service'),
    filename: 'main.js',
    clean: true,
    ...(!isProduction && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@holiday-lights/imager-core/browser': resolve(__dirname, '../../libs/imager-core/src/browser/index.ts'),
      '@holiday-lights/imager-core/node': resolve(__dirname, '../../libs/imager-core/src/node/index.ts'),
      '@holiday-lights/imager-core': resolve(__dirname, '../../libs/imager-core/src/index.ts'),
      './led-matrix.adapter': ledMatrixAdapter,
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
    'canvas',
  ],
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets', noErrorOnMissing: true },
        { from: resolve(__dirname, '../../libs/imager-core/src/assets'), to: 'assets', noErrorOnMissing: true },
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
