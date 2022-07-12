import { SuperAgentTest } from "supertest";
import {TestApplication, getTestApplication} from "../../../tests/e2e/test-app";
import {CacheService} from "../../services/cache/cache.service";
import {DatabaseService} from "../../services/database/database.service";
import {TokenPair} from "../../services/token/token.service";
import {testUsers} from "../../../tests/test-data";
import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";
import {AthenaErrorIdentifiers} from "../../error-identifiers";

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

  /**
   * Users POST Route (/v1/users/:id [POST])
   */
  describe('/v1/users/:id [POST]', () => {
    describe('Success Cases', () => {
      it('When adding a valid new user, Then the new user should be returned', async () => {
        const newUser = {
          username: "test-new-user",
          email: "newtest@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.OK);
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(String),
          username: newUser.username,
          email: newUser.email,
          isVerified: false,
          encryptionSecret: newUser.encryptionSecret,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }))
      })

      it("When adding a user with a password that's exactly 8 characters, Then the new user should be returned", async () => {
        const newUser = {
          username: "test-new-user",
          email: "testnew@example.com",
          password: "qwertyui",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.OK);
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(String),
          username: newUser.username,
          email: newUser.email,
          isVerified: false,
          encryptionSecret: newUser.encryptionSecret,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }))
      })

      it("When adding a user with a username that's exactly 1 character, Then the new user should be returned", async () => {
        const newUser = {
          username: "a",
          email: "testnew@example.com",
          password: "qwertyui",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.OK);
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(String),
          username: newUser.username,
          email: newUser.email,
          isVerified: false,
          encryptionSecret: newUser.encryptionSecret,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }))
      })

      it("When adding a user with a username that's exactly 20 characters, Then the new user should be returned", async () => {
        const newUser = {
          username: "qwertyuiopasdfghjklz",
          email: "testnew@example.com",
          password: "qwertyui",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.OK);
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(String),
          username: newUser.username,
          email: newUser.email,
          isVerified: false,
          encryptionSecret: newUser.encryptionSecret,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }))
      })
    })

    describe('None Unique Data', () => {
      it('When adding a user with an existing username, Then the response should be 400', async () => {
        const newUser = {
          username: testUsers[0].username,
          email: "newtest@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: AthenaErrorIdentifiers.USER_USERNAME_EXISTS
        }))
      })

      it('When adding a user with an existing email, Then the response should be 400', async () => {
        const newUser = {
          username: "test-new-user",
          email: testUsers[0].email,
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: AthenaErrorIdentifiers.USER_EMAIL_EXISTS
        }))
      })
    })

    describe('Data Validation', () => {
      it('When adding a user with an invalid email, Then the response should be 400', async () => {
        const newUser = {
          username: "test-new-user",
          email: "invalid-email",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })

      it("When adding a user with a password that's too short, Then the response should be 400", async () => {
        const newUser = {
          username: "test-new-user",
          email: "testnew@example.com",
          password: "hi",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })

      it("When adding a user with an empty username, Then the response should be 400", async () => {
        const newUser = {
          username: "",
          email: "testnew@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })

      it("When adding a user with a username that's too long, Then the response should be 400", async () => {
        const newUser = {
          username: "this-is-a-username-which-is-over-the-maximum",
          email: "testnew@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })
    })

    describe('Required Fields', () => {
      it("When adding a user without a username, Then the response should be 400", async () => {
        const newUser = {
          email: "testnew@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })

      it("When adding a user without an email, Then the response should be 400", async () => {
        const newUser = {
          username: "test-new-user",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })

      it("When adding a user without a password, Then the response should be 400", async () => {
        const newUser = {
          username: "test-new-user",
          email: "testnew@example.com",
          encryptionSecret: "secret"
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })

      it("When adding a user without an encryptionKey, Then the response should be 400", async () => {
        const newUser = {
          username: "test-new-user",
          email: "testnew@example.com",
          password: "testpassword",
        }

        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(newUser);

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })
    })

    describe('Invalid Data', () => {
      it("When adding a user with invalid JSON data, Then the response should be 400", async () => {
        const {body, statusCode} = await testClient
          .post(`/v1/users`)
          .send(`{username: "test"[]e}`)

        expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
        expect(body).toEqual(expect.objectContaining({
          identifier: ErrorIdentifiers.USER_REQUEST_INVALID
        }))
      })

      it("When adding a user where the username isn't a string, Then the response should be 400", async () => {
        const testCases = [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]];
        const newUser = {
          username: "test-new-user",
          email: "testnew@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        for (const testCase of testCases) {
          const {body, statusCode} = await testClient
            .post(`/v1/users`)
            .send({
              ...newUser,
              username: testCase
            });

          expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
          expect(body).toEqual(expect.objectContaining({
            identifier: ErrorIdentifiers.USER_REQUEST_INVALID
          }))
        }
      })

      it("When adding a user where the email isn't a string, Then the response should be 400", async () => {
        const testCases = [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]];
        const newUser = {
          username: "test-new-user",
          email: "testnew@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        for (const testCase of testCases) {
          const {body, statusCode} = await testClient
            .post(`/v1/users`)
            .send({
              ...newUser,
              email: testCase
            });

          expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
          expect(body).toEqual(expect.objectContaining({
            identifier: ErrorIdentifiers.USER_REQUEST_INVALID
          }))
        }
      })

      it("When adding a user where the encryptionSecret isn't a string, Then the response should be 400", async () => {
        const testCases = [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]];
        const newUser = {
          username: "test-new-user",
          email: "testnew@example.com",
          password: "testpassword",
          encryptionSecret: "secret"
        }

        for (const testCase of testCases) {
          const {body, statusCode} = await testClient
            .post(`/v1/users`)
            .send({
              ...newUser,
              encryptionSecret: testCase
            });

          expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
          expect(body).toEqual(expect.objectContaining({
            identifier: ErrorIdentifiers.USER_REQUEST_INVALID
          }))
        }
      })
    })
  })
})