import type { Config } from "@jest/types";

/**
 * This is our jest configuration file.
 */
export default async (): Promise<Config.InitialOptions> => ({
    /* Coverage Settings */
    coverageDirectory: "./coverage",
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: -10,
        },
    },

    /* Other */
    errorOnDeprecated: true,
    preset: "ts-jest",
    testEnvironment: "node",
});
