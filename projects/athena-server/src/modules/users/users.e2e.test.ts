import { SuperAgentTest } from "supertest";
import {TestApplication, getTestApplication} from "../../../tests/e2e/test-app";
import {CacheService} from "../../services/cache/cache.service";
import {DatabaseService} from "../../services/database/database.service";
import {TokenPair} from "../../services/token/token.service";
import {testUsers} from "../../../tests/test-data";
import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";

let testApplication: TestApplication;
let testClient: SuperAgentTest;
let testUser0Credentials: TokenPair;


describe('Users Route',() => {

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
    testUser0Credentials = await testApplication.getRequestTokens(testUsers[0].id);
  })

  afterEach(async () => {
    await testApplication.databaseTeardown();
  })

  /**
   * Users Route (/v1/users)
   */
  describe('/users/:id [GET]', () => {
    it('When fetching a user when unauthorized, Then the response should be 401', async () => {
      const {body, statusCode} = await testClient.get(`/v1/users/${testUsers[0].id}`);

      expect(statusCode).toEqual(HTTPStatusCodes.UNAUTHORIZED);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_UNAUTHORIZED);
    })

    it('When fetching a user as that user, Then the response should return the user', async () => {
      const {body, statusCode} = await testClient
        .get(`/v1/users/${testUsers[0].id}`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toHaveProperty('id');
      expect(body.id).toEqual(testUsers[0].id);
    })

    it('When fetching a user as a different user, Then the response should be 403', async () => {
      const {body, statusCode} = await testClient
        .get(`/v1/users/${testUsers[1].id}`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      expect(statusCode).toEqual(HTTPStatusCodes.FORBIDDEN);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_FORBIDDEN);
    })
  })
})