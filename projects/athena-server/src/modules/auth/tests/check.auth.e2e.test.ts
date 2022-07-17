import {HTTPStatusCodes} from "@kangojs/core";
import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testUsers} from "../../../../tests/test-data";
import {expectUnauthorized} from "../../../../tests/e2e/common/expect-unauthorized";
import {sign} from "jsonwebtoken";
import {ConfigService} from "../../../services/config/config";


describe('Check Auth',() => {
  const testHelper = new TestHelper();

  afterAll(async () => {await testHelper.afterAll()});
  beforeEach(async () => {await testHelper.beforeEach()});

  test('When authenticated, the request should succeed', async () => {
    const {statusCode} = await testHelper.client
      .get('/v1/auth/check')
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`);

    expect(statusCode).toEqual(HTTPStatusCodes.OK);
  })

  test('When not authenticated, the request should fail', async () => {
    const {body, statusCode} = await testHelper.client
      .get('/v1/auth/check')

    expectUnauthorized(body, statusCode);
  })

  test('When supplying an incorrectly signed accessToken, the request should fail', async () => {
    const accessToken = sign(
      {userId: testUsers[0].id, type: "accessToken"},
      "qethwrthwrthr",
      {expiresIn: '1hr'}
    );

    const {body, statusCode} = await testHelper.client
      .get(`/v1/auth/check`)
      .set('Authorization', `Bearer ${accessToken}`)

    expectUnauthorized(body, statusCode);
  })

  test('When supplying an invalid accessToken, the request should fail', async () => {
    const {body, statusCode} = await testHelper.client
      .get(`/v1/auth/check`)
      .set('Authorization', `Bearer SWFubawgrlkx`)

    expectUnauthorized(body, statusCode);
  })

  test('When supplying an expired accessToken, the request should fail', async () => {
    const configService = testHelper.application.dependencyContainer.useDependency(ConfigService);

    const accessToken = sign(
      {userId: testUsers[0].id, type: "accessToken"},
      configService.config.auth.accessToken.secret,
      {expiresIn: 0}
    );

    const {body, statusCode} = await testHelper.client
      .get(`/v1/auth/check`)
      .set('Authorization', `Bearer ${accessToken}`)

    expectUnauthorized(body, statusCode);
  })
})