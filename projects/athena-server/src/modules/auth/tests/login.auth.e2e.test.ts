import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testMalformedData} from "../../../../tests/e2e/common/test-malformed-data";
import {testUsers} from "../../../../tests/test-data";
import {testInvalidDataTypes} from "../../../../tests/e2e/common/test-invalid-data-types";
import {testMissingField} from "../../../../tests/e2e/common/test-missing-field";
import {HTTPStatusCodes} from "@kangojs/core";
import {expectForbidden} from "../../../../tests/e2e/common/expect-forbidden";
import {AthenaErrorIdentifiers} from "../../../common/error-identifiers";


describe('Login Auth',() => {
  const testHelper = new TestHelper();

  afterAll(async () => {await testHelper.afterAll()});
  beforeEach(async () => {await testHelper.beforeEach()});

  describe("Success Cases", () => {
    test('When supplying valid credentials, the user data and tokens should be returned', async () => {
      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/login`)
        .send({
          username: testUsers[0].username,
          password: testUsers[0].password
        });

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        user: {
          id: testUsers[0].id,
          username: testUsers[0].username,
          email: testUsers[0].email,
          isVerified: testUsers[0].isVerified,
          encryptionSecret: testUsers[0].encryptionSecret,
          createdAt: testUsers[0].createdAt,
          updatedAt: testUsers[0].updatedAt
        },
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      }))
    })
  })

  describe("Fail Cases", () => {
    test('When supplying completely invalid credentials, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/login`)
        .send({
          username: "random username",
          password: "random password"
        });

      expectForbidden(body, statusCode, AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })

    test('When supplying the wrong password, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/login`)
        .send({
          username: testUsers[0].username,
          password: "random password"
        });

      expectForbidden(body, statusCode, AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })

    test('When supplying a correct password but wrong username, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/login`)
        .send({
          username: "randomuser",
          password: testUsers[0].password
        });

      expectForbidden(body, statusCode, AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID)
    })
  })

  describe("Required Fields", () => {
    test("When not supplying a username, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
        endpoint: "/v1/auth/login",
        data: {
          username: testUsers[0].username,
          password: testUsers[0].password
        },
        testFieldKey: "username"
      })
    })

    test("When not supplying a password, the request should fail", async () => {
      await testMissingField({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
        endpoint: "/v1/auth/login",
        data: {
          username: testUsers[0].username,
          password: testUsers[0].password
        },
        testFieldKey: "password"
      })
    })
  })

  describe("Invalid Data", () => {
    test("When supplying invalid JSON data, the request should fail", async () => {
      await testMalformedData({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        endpoint: `/v1/auth/login`,
        accessToken: testHelper.getUserAccessToken(testUsers[0])
      })
    })

    describe("When not supplying username as a string, the request should fail",
      testInvalidDataTypes({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
        endpoint: `/v1/auth/login`,
        data: {
          password: "test-password"
        },
        testFieldKey: "username",
        testCases: [1, 1.5, true, null, {test: 'yes'}, [1, 2]]
      })
    )

    describe("When not supplying password as a string, the request should fail",
      testInvalidDataTypes({
        clientFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
        endpoint: `/v1/auth/login`,
        data: {
          username: "testuser"
        },
        testFieldKey: "password",
        testCases: [1, 1.5, true, null, {test: 'yes'}, [1, 2]]
      })
    )
  })
})
