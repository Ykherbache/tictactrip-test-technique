module.exports = {
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/unit/**/*.spec.ts'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      transform: {
        '^.+\\.tsx?$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.test.json',
          },
        ],
      },
    },
    {
      displayName: 'integ',
      testMatch: ['<rootDir>/__tests__/integ/**/*.spec.ts'],

      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      globalSetup: '<rootDir>/__tests__/integ/global/setup.ts',
      globalTeardown: '<rootDir>/__tests__/integ/global/teardown.ts',
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
    },
  ],
  setupFiles: ['reflect-metadata'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/app/features/**/*.ts',
    'src/app/routes/**/*.ts',
    'src/app/utils/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
