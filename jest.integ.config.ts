import type { Config } from 'jest';

const configInteg: Config = {
  rootDir: '.',
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  maxWorkers: 1,
  setupFiles: ['reflect-metadata'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globalSetup: '<rootDir>/__tests__/integ/global/setup.ts',
  globalTeardown: '<rootDir>/__tests__/integ/global/teardown.ts',
  testMatch: ['**/__tests__/integ/routes/**/*.spec.ts'],
};
module.exports = configInteg;
