import {TestHelper} from "../test-helper";
import {expectBadRequest} from "./expect-bad-request";
import {testUsers} from "../../test-data";

export interface TestInvalidDataTypesConfig {
  endpoint: string,
  testHelper: TestHelper,
  data: object,
  testFieldKey: string
}

export async function testMissingField(config: TestInvalidDataTypesConfig) {
  let testData = JSON.parse(JSON.stringify(config.data));
  delete testData[config.testFieldKey];

  const {body, statusCode} = await config.testHelper.client
    .post(config.endpoint)
    .set('Authorization', `Bearer ${config.testHelper.getUserAccessToken(testUsers[0].id)}`)
    .send(testData);

  expectBadRequest(body, statusCode);
}
