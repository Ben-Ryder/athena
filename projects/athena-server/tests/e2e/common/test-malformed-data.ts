import {expectBadRequest} from "./expect-bad-request";
import {SuperAgentRequest} from "superagent";

export interface TestMalformedDataConfig {
  clientFunction: (url: string) => SuperAgentRequest,
  endpoint: string,
  accessToken: string,
}

export async function testMalformedData(config: TestMalformedDataConfig) {
  const {body, statusCode} = await config.clientFunction(config.endpoint)
    .set("Authorization", `Bearer ${config.accessToken}`)
    .send(`{username: "test"[]e}`)

  expectBadRequest(body, statusCode);
}
