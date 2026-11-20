import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/tests"],
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  moduleNameMapper: {
    // Maps the '@/' alias to your root 'src' or 'app' directory
    "^@/utils/(.*)$": "<rootDir>/src/app/utils/$1",
    "^@/molecules/(.*)$": "<rootDir>/src/app/components/molecules/$1",
    "^@/ui/(.*)$": "<rootDir>/src/app/components/ui/$1",
    "^@/types/(.*)$": "<rootDir>/src/app/utils/types/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
