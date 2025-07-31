import { config } from 'dotenv';
import path from 'path';

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  // Node environment
  nodeEnv: string;

  // Application URLs
  baseUrl: string;

  // Database configuration
  database: {
    url: string;
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    schema: string;
    pool: {
      min: number;
      max: number;
      idleTimeout: number;
    };
  };

  // Test configuration
  test: {
    headless: boolean;
    browser: string;
    timeout: number;
    retries: number;
    workers: number;
    username: string;
    password: string;
  };

  // Playwright configuration
  playwright: {
    storageStatePath: string;
    startLocalServer: boolean;
  };

  // Logging configuration
  logging: {
    level: string;
    file: string;
  };

  // Media configuration
  media: {
    screenshotMode: string;
    videoMode: string;
    traceMode: string;
  };

  // Environment specific
  environment: string;
  testSuite: string;

  // API configuration
  apiBaseUrlImportacionDev: string;
  apiBaseUrlImportacionProd: string;
  apiBaseUrlImportacionv4: string;
  apiBaseUrlGeoDev: string;
  apiBaseUrlGeoProd: string;
  apiBaseUrlGeoApiv4: string;

  //tokens
  geoXApiKey: string;
}

/**
 * Environment configuration object
 */
export const environment: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',

  baseUrl: process.env.BASE_URL!, // is obtained from the .env file

  database: {
    url: process.env.DATABASE_URL!,
    host: process.env.DB_HOST || 'localhost', // is obtained from the .env file
    port: parseNumber(process.env.DB_PORT, 5432),
    name: process.env.DB_NAME || 'qa_automation_db',
    user: process.env.DB_USER || 'username', // is obtained from the .env file
    password: process.env.DB_PASSWORD || 'password', // is obtained from the .env file
    schema: process.env.DB_SCHEMA || 'public',
    pool: {
      min: parseNumber(process.env.DB_POOL_MIN, 2),
      max: parseNumber(process.env.DB_POOL_MAX, 10),
      idleTimeout: parseNumber(process.env.DB_POOL_IDLE_TIMEOUT, 30000),
    },
  },

  test: {
    headless: parseBoolean(process.env.HEADLESS, true),
    browser: process.env.BROWSER || 'chromium',
    timeout: parseNumber(process.env.TIMEOUT, 30000),
    retries: parseNumber(process.env.RETRIES, 2),
    workers: parseNumber(process.env.WORKERS, 4),
    username: process.env.TEST_USERNAME!,
    password: process.env.TEST_PASSWORD!,
  },

  playwright: {
    storageStatePath: process.env.STORAGE_STATE_PATH || './auth-state.json',
    startLocalServer: parseBoolean(process.env.START_LOCAL_SERVER, false),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/test.log',
  },

  media: {
    screenshotMode: process.env.SCREENSHOT_MODE || 'only-on-failure',
    videoMode: process.env.VIDEO_MODE || 'retain-on-failure',
    traceMode: process.env.TRACE_MODE || 'on-first-retry',
  },

  environment: process.env.ENVIRONMENT || 'development', // is obtained from the .env file
  testSuite: process.env.TEST_SUITE || 'smoke',

  apiBaseUrlImportacionDev: process.env.API_BASE_URL_IMPORTACION_DEV || '', // is obtained from the .env file
  apiBaseUrlImportacionProd: process.env.API_BASE_URL_IMPORTACION_PROD || '',
  apiBaseUrlImportacionv4: process.env.API_BASE_URL_IMPORTACIONV4 || '',
  apiBaseUrlGeoDev: process.env.API_BASE_URL_GEO_DEV || '',
  apiBaseUrlGeoProd: process.env.API_BASE_URL_GEO_PROD || '',
  apiBaseUrlGeoApiv4: process.env.API_BASE_URL_GEO_API_v4 || '',
  geoXApiKey: process.env.GEO_X_API_KEY || ''
};

function parseNumber(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  return value === 'true' || value === '1' || value === 'on' ? true : value === 'false' || value === '0' || value === 'off' ? false : defaultValue;
}
