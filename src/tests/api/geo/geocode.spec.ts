import { test, expect, request, APIRequestContext } from '@playwright/test';
import { environment } from '../../../config/environment';

/**
 * Simple Login Test Suite (without database)
 * Tests basic API functionality
 */

let baseUrl: APIRequestContext;
// Setup de baseURL before all test
test.beforeEach(async () => {
  baseUrl = await request.newContext({
    baseURL: environment.apiBaseUrlGeoDev,
    extraHTTPHeaders: {
      Accept: 'application/json',
      'x-api-key': environment.geoXApiKey
    }
  })

  console.log('Before all tests');
});

test('Geocode by Address y ubigeo', async () => {

  const getResponse = await baseUrl.get("/api/v2/geo/code", {
    params: {
      address: "JR.+EMILIO+FERN%C3%A1NDEZ+741+DPTO.+201-T1%2C+URB.+SANTA+BEATRIZ",
      ubigeo: "150101"
    }
  });

  expect(getResponse.status()).toBe(200);

  const queueBody = await getResponse.json();
  const { longitude, latitude } = queueBody.coordinates;
  const poligono = queueBody.polygon;

  console.log(`✅ Dirección válida: longitude: ${longitude} / latitude: ${latitude}`);

  if (longitude !== null) {
    console.log(`✅ Se obtubo el polígono de la dirección: ${poligono}`);
  } else {
    console.log('❌ Dirección inválida.');
  }
});
