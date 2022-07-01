import { SuperAgentTest } from "supertest";
import { getTestApp } from "../../../tests/e2e/test-app";
import {KangoJS} from "@kangojs/core";

let kangoJSApp: KangoJS;
let testApp: SuperAgentTest;


describe('Base Route',() => {

  beforeAll(async () => {
    let apps = await getTestApp();
    testApp = apps.testApp;
    kangoJSApp = apps.kangoJSApp;
  })

  /**
   * Base Route (/)
   */
  describe('/ [GET]', () => {
    it('When a request is made, Then the responses should have a 200 status code', async () => {
      await testApp.get('/').expect(200);
    })

    it('When a request is made, Then the responses should be a string message', async () => {
      const {body: data} = await testApp.get('/');
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
      await testApp.get('/').expect(200);
    })

    it('When a request is made, Then the responses should be a string message', async () => {
      const {body: data} = await testApp.get('/');
      expect(data).toHaveProperty('message');
      expect(typeof data.message).toEqual('string');
    })

    // When a request is made without authorization, Then the responses should still succeed
    // This is naturally tested as part of the above tests.
  })
})