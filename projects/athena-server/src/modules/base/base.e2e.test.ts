import {TestHelper} from "../../../tests/e2e/test-helper";
import {HTTPStatusCodes} from "@kangojs/core";


describe('Base Module',() => {
  const testHelper = new TestHelper();

  afterAll(async () => {await testHelper.afterAll()});
  beforeEach(async () => {await testHelper.beforeEach()});

  /**
   * Base Route (/)
   */
  describe('/ [GET]', () => {
    it('When a request is made, the response should be a string message', async () => {
      const {body, statusCode} = await testHelper.client.get('/');

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        message: expect.any(String)
      }));
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above tests.
  })

  /**
   * Base V1 Route (/v1)
   */
  describe('/v1 [GET]', () => {
    it('When a request is made, the response should be a string message', async () => {
      const {body, statusCode} = await testHelper.client.get('/');

      expect(statusCode).toEqual(HTTPStatusCodes.OK);
      expect(body).toEqual(expect.objectContaining({
        message: expect.any(String)
      }));
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above tests.
  })
})