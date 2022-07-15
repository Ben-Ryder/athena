import {testUsers} from "../../../../tests/test-data";
import {expectUnauthorized} from "../../../../tests/e2e/common/expect-unauthorized";
import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";
import {expectForbidden} from "../../../../tests/e2e/common/expect-forbidden";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";
import {TestHelper} from "../../../../tests/e2e/test-helper";

describe('Get User - /v1/users/:id [GET]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  it('When unauthorized, the request should fail', async () => {
    const {body, statusCode} = await testHelper.client.get(`/v1/users/${testUsers[0].id}`);

    expectUnauthorized(body, statusCode);
  })

  it('When authorized as the user to get, the response should succeed and return the user', async () => {
    const {body, statusCode} = await testHelper.client
      .get(`/v1/users/${testUsers[0].id}`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

    const {encryptionKey, passwordHash, password, ...expectedUser} = testUsers[0];

    expect(statusCode).toEqual(HTTPStatusCodes.OK);
    expect(body).toEqual(expectedUser);
  })

  it('When authorized as a different user to the one to get, the request should fail', async () => {
    const {body, statusCode} = await testHelper.client
      .get(`/v1/users/${testUsers[1].id}`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

    expectForbidden(body, statusCode);
  })

  it("When fetching a user that doesn't exist, the request should fail", async () => {
    const {body, statusCode} = await testHelper.client
      .get(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

    expectForbidden(body, statusCode);
  })

  it("When passing an invalid ID, the request should fail", async () => {
    const {body, statusCode} = await testHelper.client
      .get(`/v1/users/invalid`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0].id)}`);

    expectBadRequest(body, statusCode, ErrorIdentifiers.USER_REQUEST_INVALID);
  })
})
