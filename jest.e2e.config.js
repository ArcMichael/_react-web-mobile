/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  preset: "jest-puppeteer",
  setupFilesAfterEnv: ["<rootDir>/src/tests/e2e.test.setup.ts"],
  coverageDirectory: "coverage",
  testRegex: "e2e\\.[jt]sx?$",
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
