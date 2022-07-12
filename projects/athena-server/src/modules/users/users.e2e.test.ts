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


describe('Users Module',() => {

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
    await testApplication.resetDatabase();
    testUser0Credentials = await testApplication.getRequestTokens(testUsers[0].id);
  })

  /**
   * Users GET Route (/v1/users/:id [GET])
   */
  describe('/v1/users/:id [GET]', () => {
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

      const {encryptionKey, passwordHash, password, ...expectedUser} = testUsers[0];

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expectedUser);
    })

    it('When fetching a user as a different user, Then the response should be 403', async () => {
      const {body, statusCode} = await testClient
        .get(`/v1/users/${testUsers[1].id}`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      expect(statusCode).toEqual(HTTPStatusCodes.FORBIDDEN);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_FORBIDDEN);
    })

    it("When fetching a user that doesn't exist, Then the response should be 403", async () => {
      const {body, statusCode} = await testClient
        .get(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      /**
       * 403 not 404 is on purpose right now as having a 404 response would cost a database query to determine
       * and could expose user information.
       */
      expect(statusCode).toEqual(HTTPStatusCodes.FORBIDDEN);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_FORBIDDEN);
    })

    it("When fetching a user with an invalid ID, Then the response should be 400", async () => {
      const {body, statusCode} = await testClient
        .get(`/v1/users/invalid`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.USER_REQUEST_INVALID);
    })
  })

  /**
   * Users DELETE Route (/v1/users/:id [DELETE])
   */
  describe('/v1/users/:id [DELETE]', () => {
    it('When deleting a user when unauthorized, Then the response should be 401', async () => {
      const {body, statusCode} = await testClient.delete(`/v1/users/${testUsers[0].id}`);

      expect(statusCode).toEqual(HTTPStatusCodes.UNAUTHORIZED);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_UNAUTHORIZED);
    })

    it('When deleting a user as that user, Then the request should succeed', async () => {
      const {statusCode} = await testClient
        .delete(`/v1/users/${testUsers[0].id}`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    it('When deleting a user as a different user, Then the response should be 403', async () => {
      const {body, statusCode} = await testClient
        .delete(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      /**
       * 403 not 404 is on purpose right now as having a 404 response would cost a database query to determine
       * and could expose user information.
       */
      expect(statusCode).toEqual(HTTPStatusCodes.FORBIDDEN);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_FORBIDDEN);
    })

    it("When deleting a user that doesn't exist, Then the response should be 403", async () => {
      const {body, statusCode} = await testClient
        .delete(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      expect(statusCode).toEqual(HTTPStatusCodes.FORBIDDEN);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_FORBIDDEN);
    })

    it("When deleting a user with an invalid ID, Then the response should be 400", async () => {
      const {body, statusCode} = await testClient
        .delete(`/v1/users/invalid`)
        .set('Authorization', `Bearer ${testUser0Credentials.accessToken}`);

      expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
      expect(body).toHaveProperty('identifier');
      expect(body.identifier).toEqual(ErrorIdentifiers.USER_REQUEST_INVALID);
    })
  })
})