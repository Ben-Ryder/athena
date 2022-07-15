import {TestHelper} from "../../../../tests/e2e/test-helper";
import {HTTPStatusCodes} from "@kangojs/core";
import {testUsers} from "../../../../tests/test-data";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";
import {AthenaErrorIdentifiers} from "../../../error-identifiers";
import {testMissingField} from "../../../../tests/e2e/common/test-missing-field";
import {testMalformedData} from "../../../../tests/e2e/common/test-malformed-data";
import {testInvalidDataTypes} from "../../../../tests/e2e/common/test-invalid-data-types";

// A default user which can be reused in multiple tests to save a bit of copy-pasting.
// Uses Object.freeze to ensure no test can modify it
const defaultTestUser = Object.freeze({
  username: "test-new-user",
  email: "testnew@example.com",
  password: "testnewpassword",
  encryptionSecret: "secret"
});


describe('Add User - /v1/users [POST]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  describe('Success Cases', () => {
    it('When adding a valid new user, the new user should be added & returned', async () => {
      const {body, statusCode} = await testHelper.client
        .post(`/v1/users`)
        .send(defaultTestUser);

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        id: expect.any(String),
        username: defaultTestUser.username,
        email: defaultTestUser.email,
        isVerified: false,
        encryptionSecret: defaultTestUser.encryptionSecret,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }))
    })

    it("When using a password that's 8 characters, the new user should be added & returned", async () => {
      const newUser = {
        ...defaultTestUser,
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

    it("When using a username that's 1 character, the new user should be added & returned", async () => {
      const newUser = {
        ...defaultTestUser,
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

    it("When using a username that's 20 characters, the new user should be added & returned", async () => {
      const newUser = {
        ...defaultTestUser,
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
    it('When using an existing username, the request should fail', async () => {
      const newUser = {
        ...defaultTestUser,
        username: testUsers[0].username
      }

      const {body, statusCode} = await testHelper.client
        .post(`/v1/users`)
        .send(newUser);

      expectBadRequest(body, statusCode, AthenaErrorIdentifiers.USER_USERNAME_EXISTS);
    })

    it('When using an existing email, the request should fail', async () => {
      const newUser = {
        ...defaultTestUser,
        email: testUsers[0].email,
      }

      const {body, statusCode} = await testHelper.client
        .post(`/v1/users`)
        .send(newUser);

      expectBadRequest(body, statusCode, AthenaErrorIdentifiers.USER_EMAIL_EXISTS);
    })
  })

  describe('Data Validation', () => {
    it('When using an invalid email, the request should fail', async () => {
      const newUser = {
        ...defaultTestUser,
        email: "invalid-email"
      }

      const {body, statusCode} = await testHelper.client
        .post(`/v1/users`)
        .send(newUser);

      expectBadRequest(body, statusCode)
    })

    it("When using a password that's too short, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        password: "hi"
      }

      const {body, statusCode} = await testHelper.client
        .post(`/v1/users`)
        .send(newUser);

      expectBadRequest(body, statusCode)
    })

    it("When supplying an empty username, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        username: ""
      }

      const {body, statusCode} = await testHelper.client
        .post(`/v1/users`)
        .send(newUser);

      expectBadRequest(body, statusCode)
    })

    it("When using a username that's too long, the request should fail", async () => {
      const newUser = {
        ...defaultTestUser,
        username: "this-is-a-username-which-is-over-the-maximum"
      }

      const {body, statusCode} = await testHelper.client
        .post(`/v1/users`)
        .send(newUser);

      expectBadRequest(body, statusCode)
    })
  })

  describe('Required Fields', () => {
    it("When not supplying a username, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "username"
      })
    })

    it("When not supplying an email, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "email"
      })
    })

    it("When not supplying a password, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "password"
      })
    })

    it("When not supplying an encryptionSecret, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "encryptionSecret"
      })
    })
  })

  describe('Invalid Data', () => {
    it("When supplying invalid JSON data, the request should fail", async () => {
      await testMalformedData({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users"
      })
    })

    describe("When not supplying username as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "username",
        testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
      })
    )

    describe("When not supplying email as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "email",
        testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
      })
    )

    describe("When not supplying password as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "password",
        testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
      })
    )

    describe("When not supplying encryptionSecret as a string, the request should fail",
      testInvalidDataTypes({
        requestFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0].id),
        endpoint: "/v1/users",
        data: defaultTestUser,
        testFieldKey: "encryptionSecret",
        testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
      })
    )
  })
})
