import { test, expect, request } from '@playwright/test';
import { environment } from '../config/environment';

test.describe('Environment and URLs validation', () => {
  test('should have all required environment variables defined', () => {
    expect(environment.baseUrl, 'BASE_URL is undefined').toBeDefined();
    expect(environment.test.username, 'TEST_USERNAME is undefined').toBeDefined();
    expect(environment.test.password, 'TEST_PASSWORD is undefined').toBeDefined();
    expect(environment.database.url, 'DATABASE_URL is undefined').toBeDefined();
  });

  test('should have valid URLs responding with 200 status', async ({ request }) => {
    const baseResponse = await request.get(environment.baseUrl);
    expect(baseResponse.ok(), `${environment.baseUrl} is not reachable`).toBeTruthy();

    // if (environment.apiBaseUrl) { // para pruebas api
    //   const apiResponse = await request.get(environment.apiBaseUrl);
    //   expect(apiResponse.ok(), `${environment.apiBaseUrl} is not reachable`).toBeTruthy();
    // }
  });

  test('login and success URLs should be reachable', async ({ request }) => {
    // Full login URL
    const loginUrl = environment.baseUrl + '/practice-test-login/';
    const loginResponse = await request.get(loginUrl);
    expect(loginResponse.ok(), `${loginUrl} is not reachable`).toBeTruthy();

    // Success URL (only check if it's valid URL)
    const successUrl = environment.baseUrl + '/logged-in-successfully/';
    const successResponse = await request.get(successUrl);
    expect(successResponse.ok(), `${successUrl} is not reachable`).toBeTruthy();
  });
});
