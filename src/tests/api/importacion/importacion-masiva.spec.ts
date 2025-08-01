import { test, expect, request, APIRequestContext } from '@playwright/test';
import fileData from '../../../testData/file.json';
import ApiJson from '../../../testData/importData.json'; // para llamar el archivo como un formato json para el body
import { environment } from '../../../config/environment';

/**
 * Simple Login Test Suite (without database)
 * Tests basic API functionality
 */

let baseUrl : APIRequestContext;
// Setup de baseURL before all test
test.beforeAll(async () => {
  baseUrl = await request.newContext({
    baseURL: environment.apiBaseUrlImportacionDev,
    extraHTTPHeaders: {
      Accept: 'application/json',
      "Content-Type": 'application/json'
    }
  })
});

test('Flujo completo: login, importación y validación de errores', async () => {
  // 1. Login: POST /auth
  const authResponse = await baseUrl.post("/auth", {
    data: ApiJson.loginData // aquí llamo el archivo json con los datos del login
  });

  expect(authResponse.status()).toBe(200);

  const authBody = await authResponse.json();
  const token = authBody.access_token;
  expect(token).toBeDefined();

  const authHeader = {
    Authorization: `Bearer ${token}`
  };

  // 2. POST /v2/tracking/import con Authorization
  const postResponse = await baseUrl.post("/v2/tracking/import", {
    headers: authHeader,
    data: {
      idSede: "43",
      idPersona: "1150090",
      idPersJurArea: "6334863",
      correo: "acorcuerae@gmail.com",
      file: fileData.file
    }
  });

  expect(postResponse.status()).toBe(202);

  const postBody = await postResponse.json();
  const queueId = postBody?.queue?.id;
  expect(queueId).toBeDefined();

  // 3. GET /v2/queue/:id con Authorization
  const getResponse = await baseUrl.get(`/v2/queue/${queueId}`, {
    headers: authHeader
  });

  expect(getResponse.status()).toBe(200);

  const queueBody = await getResponse.json();
  const { valid, total } = queueBody.info;

  console.log(`✅ Envíos válidos: ${valid} / ${total}`);

  if (valid !== total) {
    const errores = queueBody.items.filter((item: any) => !item.valid);
    console.log('❌ Envíos inválidos encontrados:');
    for (const item of errores) {
      console.log(`- nroEnvio ${item.nroEnvio}: ${item.error}`);
    }

    // Falla el test si hay envíos inválidos
    expect(valid).toBe(total);
  } else {
    console.log('✅ Todos los envíos son válidos.');
  }
});
