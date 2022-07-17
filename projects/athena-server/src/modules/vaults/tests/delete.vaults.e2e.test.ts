import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testData, testUsers} from "../../../../tests/test-data";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";
import {expectForbidden} from "../../../../tests/e2e/common/expect-forbidden";
import {HTTPStatusCodes} from "@kangojs/core";


describe('Delete Vault - /v1/vaults/:id [DELETE]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  describe('Success Cases', () => {
    test("When deleting a vault as the owner, the vault should be deleted", async () => {
      const {statusCode} = await testHelper.client
        .delete(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);

      // Attempt to fetch vault to check it's been deleted
      const {statusCode: checkStatusCode} = await testHelper.client
        .get(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)

      expect(checkStatusCode).toEqual(HTTPStatusCodes.NOT_FOUND);
    })
  })

  describe('Invalid Authorization', () => {
    test("When attempting to delete a vault as a user that's not the owner, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .delete(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[1])}`)

      expectForbidden(body, statusCode);
    })
  })

  describe('Invalid Data', () => {
    test("When attempting to delete a vault with an none existent ID, the request should fail", async () => {
      const {statusCode} = await testHelper.client
        .delete(`/v1/vaults/8f2c976f-360f-4123-9d88-b19676f7c71c`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[1])}`)

      expect(statusCode).toEqual(HTTPStatusCodes.NOT_FOUND);
    })

    test("When attempting to delete a vault with an invalid ID, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .delete(`/v1/vaults/invalid`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[1])}`)

      expectBadRequest(body, statusCode);
    })
  })
})
