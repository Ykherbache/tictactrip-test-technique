import type {Config} from 'jest';

const configInteg: Config = {
    rootDir: ".",
    preset: "ts-jest",
    transform: {
      "^.+\\.ts$": [
        "ts-jest",
        {
          tsconfig: "tsconfig.test.json",
        },
      ],
    },
    maxWorkers: 1,
    setupFiles: ["reflect-metadata"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    globalSetup: "<rootDir>/test/integ/global/setup.ts",
    globalTeardown: "<rootDir>/test/integ/global/teardown.ts",
  };
  module.exports = configInteg;