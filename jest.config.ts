module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: { 
        '^.+\\.tsx?$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json'
        }]
    },
    moduleFileExtensions: ['ts', 'js', 'json'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/app/features/**/*.ts'],
    testMatch: ['**/__tests__/integ/routes/*.ts','**/__tests__/unit/**/*.ts'],
};