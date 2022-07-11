import { SuperAgentTest } from "supertest";
import {TestApplication, getTestApplication} from "../../../tests/e2e/test-app";
import {CacheService} from "../../services/cache/cache.service";
import {DatabaseService} from "../../services/database/database.service";

let testApplication: TestApplication;
let testClient: SuperAgentTest;


describe('Base Route',() => {

  beforeAll(async () => {
    let apps = await getTestApplication();
    testApplication = apps.testApplication;
    testClient = apps.testClient;
  })

  afterAll(async () => {
    // Clean up database and redis connections before exiting
    const cacheService = testApplication.dependencyContainer.useDependency(CacheService);
    await cacheService.onKill();
    const databaseService = testApplication.dependencyContainer.useDependency(DatabaseService);
    await databaseService.onKill();
  })

  beforeEach(async () => {
    await testApplication.databaseSetup();
  })

  afterEach(async () => {
    await testApplication.databaseTeardown();
  })

  /**
   * Base Route (/)
   */
  describe('/ [GET]', () => {
    it('When a request is made, Then the responses should have a 200 status code', async () => {
      await testClient.get('/').expect(200);
    })

    it('When a request is made, Then the responses should be a string message', async () => {
      const {body: data} = await testClient.get('/');
      expect(data).toHaveProperty('message');
      expect(typeof data.message).toEqual('string');
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above tests.
  })

  /**
   * Base V1 Route (/v1)
   */
  describe('/v1 [GET]', () => {
    it('When a request is made, Then the responses should have a 200 status code', async () => {
      await testClient.get('/').expect(200);
    })

    it('When a request is made, Then the responses should be a string message', async () => {
      const {body: data} = await testClient.get('/');
      expect(data).toHaveProperty('message');
      expect(typeof data.message).toEqual('string');
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above tests.
  })
})