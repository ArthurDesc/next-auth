/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '<rootDir>/src/app/api/**/*.test.{js,jsx,ts,tsx}'
  ],
  collectCoverageFrom: [
    'src/app/api/**/*.{js,jsx,ts,tsx}',
    '!src/app/api/**/*.d.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.api.setup.js']
}

module.exports = config 