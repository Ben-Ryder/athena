import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testData, testUsers} from "../../../../tests/test-data";
import {expectBadRequest} from "../../../../tests/e2e/common/expect-bad-request";
import {expectForbidden} from "../../../../tests/e2e/common/expect-forbidden";
import {HTTPStatusCodes} from "@kangojs/core";


describe('Get Vault - /v1/vaults/:id [GET]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  describe('Success Cases', () => {
    test("When fetching a vault as the owner, the vault should be returned", async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        id: testData[testUsers[0].id].vaults[0].id,
        name: testData[testUsers[0].id].vaults[0].name,
        description: testData[testUsers[0].id].vaults[0].description,
        createdAt: testData[testUsers[0].id].vaults[0].createdAt,
        updatedAt: testData[testUsers[0].id].vaults[0].updatedAt
      }))
    })
  })

  describe('Invalid Authorization', () => {
    test("When fetching a vault as a user that's not the owner, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/vaults/${testData[testUsers[0].id].vaults[0].id}`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[1])}`)

      expectForbidden(body, statusCode);
    })
  })

  describe('Invalid Data', () => {
    test("When fetching a vault with an none existent ID, the request should fail", async () => {
      const {statusCode} = await testHelper.client
        .get(`/v1/vaults/8f2c976f-360f-4123-9d88-b19676f7c71c`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[1])}`)

      expect(statusCode).toEqual(HTTPStatusCodes.NOT_FOUND);
    })

    test("When fetching a vault with an invalid ID, the request should fail", async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/vaults/invalid`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[1])}`)

      expectBadRequest(body, statusCode);
    })
  })
})
