import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testUsers} from "../../../../tests/test-data";
import {expectUnauthorized} from "../../../../tests/e2e/common/expect-unauthorized";
import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";
import {expectForbidden} from "../../../../tests/e2e/common/expect-forbidden";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";


describe('Delete User - /v1/users/:id [DELETE]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  test('When unauthorized, the request should fail', async () => {
    const {body, statusCode} = await testHelper.client.delete(`/v1/users/${testUsers[0].id}`);

    expectUnauthorized(body, statusCode);
  })

  test('When authorized as the user to delete, the request & deletion should succeed', async () => {
    const {statusCode: deleteStatusCode} = await testHelper.client
      .delete(`/v1/users/${testUsers[0].id}`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`);

    expect(deleteStatusCode).toEqual(HTTPStatusCodes.OK);

    const {statusCode: getStatusCode} = await testHelper.client
      .get(`/v1/users/${testUsers[0].id}`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`);

    expect(getStatusCode).toEqual(HTTPStatusCodes.NOT_FOUND);

  })

  test('When authorized as a different user to the one to delete, the request should fail', async () => {
    const {body, statusCode} = await testHelper.client
      .delete(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`);

    expectForbidden(body, statusCode)
  })

  test("When attempting to delete a none existent user, the request should fail", async () => {
    const {body, statusCode} = await testHelper.client
      .delete(`/v1/users/82f7d7a4-e094-4f15-9de0-5b5621376714`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`);

    expectForbidden(body, statusCode);
  })

  test("When passing an invalid user ID, the request should fail", async () => {
    const {body, statusCode} = await testHelper.client
      .delete(`/v1/users/invalid`)
      .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`);

    expectBadRequest(body, statusCode, ErrorIdentifiers.USER_REQUEST_INVALID);
  })
})
