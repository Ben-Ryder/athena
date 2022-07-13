import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";
import {AthenaErrorIdentifiers} from "../../error-identifiers";

import {testUsers} from "../../../tests/test-data";

import {TestHelper} from "../../../tests/e2e/test-helper";
import {expectUnauthorized} from "../../../tests/e2e/common/expect-unauthorized";
import {expectForbidden} from "../../../tests/e2e/common/expect-forbidden";
import {expectBadRequest} from "../../../tests/e2e/common/expect-bad-request";
import {testInvalidDataTypes} from "../../../tests/e2e/common/test-invalid-data-types";
import {testMissingField} from "../../../tests/e2e/common/test-missing-field";
import {testMalformedData} from "../../../tests/e2e/common/test-malformed-data";


let testHelper: TestHelper;

// A default new user which can be reused in multiple tests, saves a bit of copy-pasting.
// Use Object.freeze to ensure no test can modify it
const defaultNewUser = Object.freeze({
  username: "test-new-user",
  email: "testnew@example.com",
  password: "testnewpassword",
  encryptionSecret: "secret"
});

describe('Users Module',() => {

  beforeAll(async () => {
    testHelper = new TestHelper();
  })
  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  /**
   * Users GET Route (/v1/users/:id [GET])
   */
  describe('/v1/users/:id [GET]', () => {
    it('When fetching a user when unauthorized, Then the response should be 401', async () => {
      const {body, statusCode} = await testHelper.client.get(`/v1/users/${testUsers[0].id}`);

      expectUnauthorized(body, statusCode);
    })

    it('When fetching a user as that user, Then the response should return the user', async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/users/${testUsers[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

      const {encryptionKey, passwordHash, password, ...expectedUser} = testUsers[0];

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expectedUser);
    })

    it('When fetching a user as a different user, Then the response should be 403', async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/users/${testUsers[1].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

        expectForbidden(body, statusCode);
    })

    it("When fetching a user that doesn't exist, Then the response should be 403", async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

      expectForbidden(body, statusCode);
    })

    it("When fetching a user with an invalid ID, Then the response should be 400", async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/users/invalid`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

      expectBadRequest(body, statusCode, ErrorIdentifiers.USER_REQUEST_INVALID);
    })
  })

  /**
   * Users DELETE Route (/v1/users/:id [DELETE])
   */
  describe('/v1/users/:id [DELETE]', () => {
    it('When deleting a user when unauthorized, Then the response should be 401', async () => {
      const {body, statusCode} = await testHelper.client.delete(`/v1/users/${testUsers[0].id}`);

      expectUnauthorized(body, statusCode);
    })

    it('When deleting a user as that user, Then the request should succeed', async () => {
      const {statusCode} = await testHelper.client
        .delete(`/v1/users/${testUsers[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
    })

    it('When deleting a user as a different user, Then the response should be 403', async () => {
      const {body, statusCode} = await testHelper.client
        .delete(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

      expectForbidden(body, statusCode)
    })

    it("When deleting a user that doesn't exist, Then the response should be 403", async () => {
      const {body, statusCode} = await testHelper.client
        .delete(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

      expectForbidden(body, statusCode);
    })

    it("When deleting a user with an invalid ID, Then the response should be 400", async () => {
      const {body, statusCode} = await testHelper.client
        .delete(`/v1/users/invalid`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

      expectBadRequest(body, statusCode, ErrorIdentifiers.USER_REQUEST_INVALID);
    })
  })

  /**
   * Users POST Route (/v1/users/:id [POST])
   */
  describe('/v1/users/:id [POST]', () => {
    describe('Success Cases', () => {
      it('When adding a valid new user, Then the new user should be returned', async () => {
        const {body, statusCode} = await testHelper.client
          .post(`/v1/users`)
          .send(defaultNewUser);

        expect(statusCode).toEqual(HTTPStatusCodes.OK);
        expect(body).toEqual(expect.objectContaining({
          id: expect.any(String),
          username: defaultNewUser.username,
          email: defaultNewUser.email,
          isVerified: false,
          encryptionSecret: defaultNewUser.encryptionSecret,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }))
      })

      it("When adding a user with a password that's exactly 8 characters, Then the new user should be returned", async () => {
        const newUser = {
          ...defaultNewUser,
          password: "qwertyui",
        }

        const {body, statusCode} = await testHelper.client
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
          ...defaultNewUser,
          username: "a"
        }

        const {body, statusCode} = await testHelper.client
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
          ...defaultNewUser,
          username: "qwertyuiopasdfghjklz"
        }

        const {body, statusCode} = await testHelper.client
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
          ...defaultNewUser,
          username: testUsers[0].username
        }

        const {body, statusCode} = await testHelper.client
          .post(`/v1/users`)
          .send(newUser);

        expectBadRequest(body, statusCode, AthenaErrorIdentifiers.USER_USERNAME_EXISTS);
      })

      it('When adding a user with an existing email, Then the response should be 400', async () => {
        const newUser = {
          ...defaultNewUser,
          email: testUsers[0].email,
        }

        const {body, statusCode} = await testHelper.client
          .post(`/v1/users`)
          .send(newUser);

        expectBadRequest(body, statusCode, AthenaErrorIdentifiers.USER_EMAIL_EXISTS);
      })
    })

    describe('Data Validation', () => {
      it('When adding a user with an invalid email, Then the response should be 400', async () => {
        const newUser = {
          ...defaultNewUser,
          email: "invalid-email"
        }

        const {body, statusCode} = await testHelper.client
          .post(`/v1/users`)
          .send(newUser);

        expectBadRequest(body, statusCode)
      })

      it("When adding a user with a password that's too short, Then the response should be 400", async () => {
        const newUser = {
          ...defaultNewUser,
          password: "hi"
        }

        const {body, statusCode} = await testHelper.client
          .post(`/v1/users`)
          .send(newUser);

        expectBadRequest(body, statusCode)
      })

      it("When adding a user with an empty username, Then the response should be 400", async () => {
        const newUser = {
          ...defaultNewUser,
          username: ""
        }

        const {body, statusCode} = await testHelper.client
          .post(`/v1/users`)
          .send(newUser);

        expectBadRequest(body, statusCode)
      })

      it("When adding a user with a username that's too long, Then the response should be 400", async () => {
        const newUser = {
          ...defaultNewUser,
          username: "this-is-a-username-which-is-over-the-maximum"
        }

        const {body, statusCode} = await testHelper.client
          .post(`/v1/users`)
          .send(newUser);

        expectBadRequest(body, statusCode)
      })
    })

    describe('Required Fields', () => {
      it("When adding a user without a username, Then the response should be 400", async () => {
        await testMissingField({
          testHelper,
          endpoint: "/v1/users",
          data: defaultNewUser,
          testFieldKey: "username"
        })
      })

      it("When adding a user without an email, Then the response should be 400", async () => {
        await testMissingField({
          testHelper,
          endpoint: "/v1/users",
          data: defaultNewUser,
          testFieldKey: "email"
        })
      })

      it("When adding a user without a password, Then the response should be 400", async () => {
        await testMissingField({
          testHelper,
          endpoint: "/v1/users",
          data: defaultNewUser,
          testFieldKey: "password"
        })
      })

      it("When adding a user without an encryptionSecret, Then the response should be 400", async () => {
        await testMissingField({
          testHelper,
          endpoint: "/v1/users",
          data: defaultNewUser,
          testFieldKey: "encryptionSecret"
        })
      })
    })

    describe('Invalid Data', () => {
      it("When adding a user with invalid JSON data, Then the response should be 400", async () => {
        await testMalformedData({
          testHelper,
          endpoint: "/v1/users"
        })
      })

      it("When adding a user where the username isn't a string, Then the response should be 400", async () => {
        await testInvalidDataTypes({
          testHelper,
          endpoint: "/v1/users",
          data: defaultNewUser,
          testFieldKey: "username",
          testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
        })
      })

      it("When adding a user where the email isn't a string, Then the response should be 400", async () => {
        await testInvalidDataTypes({
          testHelper,
          endpoint: "/v1/users",
          data: defaultNewUser,
          testFieldKey: "email",
          testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
        })
      })

      it("When adding a user where the encryptionSecret isn't a string, Then the response should be 400", async () => {
        await testInvalidDataTypes({
          testHelper,
          endpoint: "/v1/users",
          data: defaultNewUser,
          testFieldKey: "encryptionSecret",
          testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
        })
      })
    })
  })
})