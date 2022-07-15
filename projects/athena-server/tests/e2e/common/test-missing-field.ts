import {expectBadRequest} from "./expect-bad-request";
import {SuperAgentRequest} from "superagent";

export interface TestInvalidDataTypesConfig {
  clientFunction: (url: string) => SuperAgentRequest,
  endpoint: string,
  accessToken: string,
  data: object,
  testFieldKey: string
}

export async function testMissingField(config: TestInvalidDataTypesConfig) {
  let testData = JSON.parse(JSON.stringify(config.data));
  delete testData[config.testFieldKey];

  const {body, statusCode} = await config.clientFunction(config.endpoint)
    .set('Authorization', `Bearer ${config.accessToken}`)
    .send(testData);

  expectBadRequest(body, statusCode);
}
