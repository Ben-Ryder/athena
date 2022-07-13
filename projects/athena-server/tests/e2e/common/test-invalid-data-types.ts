import {TestHelper} from "../test-helper";
import {expectBadRequest} from "./expect-bad-request";
import {testUsers} from "../../test-data";

export interface TestInvalidDataTypesConfig {
  endpoint: string,
  testHelper: TestHelper,
  data: object,
  testFieldKey: string,
  testCases: any[]
}

export async function testInvalidDataTypes(config: TestInvalidDataTypesConfig) {
  for (const testCase of config.testCases) {
    let testData = {
      ...config.data,
      [config.testFieldKey]: testCase
    };

    const {body, statusCode} = await config.testHelper.client
      .post(config.endpoint)
      .set('Authorization', `Bearer ${config.testHelper.getUserAccessToken(testUsers[0].id)}`)
      .send(testData);

    expectBadRequest(body, statusCode);
  }
}
