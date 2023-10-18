/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  setupFilesAfterEnv: ["<rootDir>/src/tests/test.setup.ts"],
  coverageDirectory: "coverage",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/common/$1",
    "isomorphisms/(.*)": "<rootDir>/src/isomorphisms/$1",
    "serverCode/(.*)": "<rootDir>/src/serverCode/$1",
    "\\.(css|scss)$": "<rootDir>/src/tests/mocks/style.mock.ts",
    lottie: "<rootDir>/src/tests/mocks/lottie.mock.ts",
  },
  globals: {
    __DEV__: true,
  },
};
