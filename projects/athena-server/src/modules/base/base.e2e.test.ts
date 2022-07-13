import {TestHelper} from "../../../tests/e2e/test-helper";

let testHelper: TestHelper;

describe('Base Module',() => {

  beforeAll(async () => {
    testHelper = new TestHelper();
  })
  afterAll(async () => {await testHelper.afterAll()});
  beforeEach(async () => {await testHelper.beforeEach()});

  /**
   * Base Route (/)
   */
  describe('/ [GET]', () => {
    it('When a request is made, Then the responses should have a 200 status code', async () => {
      await testHelper.client.get('/').expect(200);
    })

    it('When a request is made, Then the responses should be a string message', async () => {
      const {body: data} = await testHelper.client.get('/');
      expect(data).toHaveProperty('message');
      expect(typeof data.message).toEqual('string');
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above tests.
  })

  /**
   * Base V1 Route (/v1)
   */
  describe('/v1 [GET]', () => {
    it('When a request is made, Then the responses should have a 200 status code', async () => {
      await testHelper.client.get('/').expect(200);
    })

    it('When a request is made, Then the responses should be a string message', async () => {
      const {body: data} = await testHelper.client.get('/');
      expect(data).toHaveProperty('message');
      expect(typeof data.message).toEqual('string');
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above tests.
  })
})