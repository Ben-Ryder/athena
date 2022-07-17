import {HTTPStatusCodes} from "@kangojs/core";
import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testUsers} from "../../../../tests/test-data";
import {testInvalidDataTypes} from "../../../../tests/e2e/common/test-invalid-data-types";
import {sign} from "jsonwebtoken";
import {ConfigService} from "../../../services/config/config";
import {AthenaErrorIdentifiers} from "../../../common/error-identifiers";
import {expectUnauthorized} from "../../../../tests/e2e/common/expect-unauthorized";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";


describe('Refresh Auth',() => {
  const testHelper = new TestHelper();

  afterAll(async () => {await testHelper.afterAll()});
  beforeEach(async () => {await testHelper.beforeEach()});

  describe("Success Cases", () => {
    test('When supplying a valid refreshToken, an accessToken and refreshToken should be returned', async () => {
      const { refreshToken } = testHelper.getUserTokens(testUsers[0]);

      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/refresh`)
        .send({
          refreshToken
        });

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        accessToken: expect.any(String),
        refreshToken: expect.any(String)
      }))
    })
  })

  describe("Token Revocation", () => {
    test('After a successful refresh, the previous refreshToken should be invalid', async () => {
      const { refreshToken } = testHelper.getUserTokens(testUsers[0]);

      // Call a refresh to get new access & refresh token
      const {statusCode} = await testHelper.client
        .post(`/v1/auth/refresh`)
        .send({
          refreshToken
        });

      expect(statusCode).toEqual(HTTPStatusCodes.OK);

      // Repeat the refresh, this time it should fail as the refreshToken should be blacklisted
      const {body: retryBody, statusCode: retryStatusCode} = await testHelper.client
        .post(`/v1/auth/refresh`)
        .send({
          refreshToken
        });

      expectUnauthorized(retryBody, retryStatusCode, AthenaErrorIdentifiers.AUTH_TOKEN_INVALID);
    })
  })

  describe("Invalid Data", () => {
    test('When supplying an incorrectly signed refreshToken, the request should fail', async () => {
      //  Create a token with the expected payload but signed wrong
      const refreshToken = sign(
        {userId: testUsers[0].id, type: "refreshToken"},
        "aergsethsrjsrj",
        {expiresIn: '1h'}
      );

      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/refresh`)
        .send({
          refreshToken
        });

      expectUnauthorized(body, statusCode, AthenaErrorIdentifiers.AUTH_TOKEN_INVALID);
    })

    test('When supplying an invalid refreshToken, the request should fail', async () => {
      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/refresh`)
        .send({
          refreshToken: "djbgdklhbghlg"
        });

      expectBadRequest(body, statusCode);
    })

    test('When supplying an expired refreshToken, the request should fail', async () => {
      const configService = testHelper.application.dependencyContainer.useDependency(ConfigService);

      // Create an expired token with the correct payload & sign it correctly
      const refreshToken = sign(
        {userId: testUsers[0].id, type: "refreshToken"},
        configService.config.auth.refreshToken.secret,
        {expiresIn: 0}
      );

      const {body, statusCode} = await testHelper.client
        .post(`/v1/auth/refresh`)
        .send({
          refreshToken
        });

      expectUnauthorized(body, statusCode, AthenaErrorIdentifiers.AUTH_TOKEN_INVALID);
    })

    describe("When not supplying refreshToken as a string, the request should fail", () => {
      testInvalidDataTypes({
        requestFunction: testHelper.client.post.bind(testHelper.client),
        accessToken: testHelper.getUserAccessToken(testUsers[0]),
        endpoint: `/v1/auth/refresh`,
        data: {},
        testFieldKey: "refreshToken",
        testCases: [1, 1.5, true, null, undefined, {test: 'yes'}, [1, 2]]
      })
    })
  })
})