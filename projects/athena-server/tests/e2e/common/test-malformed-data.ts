import {TestHelper} from "../test-helper";
import {expectBadRequest} from "./expect-bad-request";

export interface TestMalformedDataConfig {
  testHelper: TestHelper,
  endpoint: string
}

export async function testMalformedData(config: TestMalformedDataConfig) {
  const {body, statusCode} = await config.testHelper.client
    .post(config.endpoint)
    .send(`{username: "test"[]e}`)

  expectBadRequest(body, statusCode);
}
