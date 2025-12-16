import {
  GpioMapping,
  LedMatrix,
  MatrixOptions,
  MuxType,
  RuntimeFlag,
  RuntimeOptions,
} from './led-matrix.adapter';

export const matrixOptions: MatrixOptions = {
  ...LedMatrix.defaultMatrixOptions(),
  limitRefreshRateHz: 0,
  rows: 64,
  cols: 64,
  chainLength: 1,
  parallel: 1,
  hardwareMapping: GpioMapping.Regular,
  multiplexing: MuxType.Direct,
  rowAddressType: 0,
  brightness: 20,
  showRefreshRate: true,
};

console.log('matrix options: ', JSON.stringify(matrixOptions, null, 2));

export const runtimeOptions: RuntimeOptions = {
  ...LedMatrix.defaultRuntimeOptions(),
  gpioSlowdown: 2,
  dropPrivileges: RuntimeFlag.Off,
};

console.log('runtime options: ', JSON.stringify(runtimeOptions, null, 2));
