import { defineConfig, devices } from '@playwright/test';
import { environment } from './src/config/environment';

export default defineConfig({
    testDir: './src/tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: environment.test.retries,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['list'],
    ],
    use: {
        baseURL: environment.baseUrl,
        actionTimeout: environment.test.timeout,
        navigationTimeout: environment.test.timeout,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        ignoreHTTPSErrors: true,
        viewport: { width: 1280, height: 720 },
        userAgent: 'Playwright-ShippingPlatform-Automation',
    },
    projects: [
        // {
        //     name: 'chromium',
        //     use: {
        //         ...devices['Desktop Chrome'],
        //         headless: environment.test.headless,
        //     },
        // },
        // {
        //     name: 'firefox',
        //     use: {
        //         ...devices['Desktop Firefox'],
        //         headless: environment.test.headless,
        //     },
        // },
        // {
        //     name: 'webkit',
        //     use: {
        //         ...devices['Desktop Safari'],
        //         headless: environment.test.headless,
        //     },
        // },
        // {
        //     name: 'Mobile Chrome',
        //     use: {
        //         ...devices['Pixel 5'],
        //         headless: environment.test.headless,
        //     },
        // },
        // {
        //     name: 'Mobile Safari',
        //     use: {
        //         ...devices['iPhone 12'],
        //         headless: environment.test.headless,
        //     },
        // },
        // {
        //     name: 'Microsoft Edge',
        //     use: {
        //         ...devices['Desktop Edge'],
        //         channel: 'msedge',
        //         headless: environment.test.headless,
        //     },
        // },
        {
            name: 'Google Chrome',
            use: {
                ...devices['Desktop Chrome'],
                channel: 'chrome',
                headless: environment.test.headless,
            },
        },
    ],
    globalSetup: './src/tests/setup/global-setup',
    globalTeardown: './src/tests/setup/global-teardown',
    timeout: 60000,
    expect: {
        timeout: 10000,
    },
    outputDir: 'test-results/',
    preserveOutput: 'failures-only',
    maxFailures: process.env.CI ? 10 : undefined,
    metadata: {
        'test-environment': environment.environment,
        'base-url': environment.baseUrl,
        'browser': environment.test.browser,
    }
});
