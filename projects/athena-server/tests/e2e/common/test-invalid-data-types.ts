import {expectBadRequest} from "./expect-bad-request";
import {SuperAgentRequest} from "superagent";

export interface TestInvalidDataTypesConfig {
  requestFunction: (url: string) => SuperAgentRequest,
  endpoint: string,
  accessToken: string,
  data: object,
  testFieldKey: string,
  testCases: any[]
}

export function testInvalidDataTypes(config: TestInvalidDataTypesConfig) {
  return () => {
    test.each(config.testCases)(`When ${config.testFieldKey} is %s, the request should fail`, async testCase => {
      let testData = {
        ...config.data,
        [config.testFieldKey]: testCase
      };

      const {body, statusCode} = await config.requestFunction(config.endpoint)
        .set('Authorization', `Bearer ${config.accessToken}`)
        .send(testData);

      expectBadRequest(body, statusCode);
    })
  }
}
