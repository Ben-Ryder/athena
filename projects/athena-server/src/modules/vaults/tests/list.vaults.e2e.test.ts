import {TestHelper} from "../../../../tests/e2e/test-helper";
import {testData, testUsers} from "../../../../tests/test-data";
import {HTTPStatusCodes} from "@kangojs/core";


describe('List Vaults - /v1/vaults [GET]',() => {
  const testHelper: TestHelper = new TestHelper();

  beforeEach(async () => {await testHelper.beforeEach()});
  afterAll(async () => {await testHelper.afterAll()});

  describe("Success Cases", () => {
    test("When fetching vaults, the vaults and metadata should be returned", async () => {
      const {body, statusCode} = await testHelper.client
        .get(`/v1/vaults`)
        .set('Authorization', `Bearer ${testHelper.getUserAccessToken(testUsers[0])}`)

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        vaults: expect.any(Array),
        meta: {
          total: expect.any(Number),
          take: expect.any(Number),
          skip: expect.any(Number)
        }
      }))

      // Check returned vaults are correct
      // todo: check specific vaults in future when the test data is populated
      for (const vault of body.vaults) {
        expect(vault).toEqual(expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String), // todo: OR NULL
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }))
      }
    })
  })
})
