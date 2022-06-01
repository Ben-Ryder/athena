import { agent as _request } from "supertest"
import { createApp } from "../../src/app";

export const getTestApp = async function() {
  const kangoJS = await createApp();
  const expressApp = kangoJS.getApp();

  return _request(expressApp);
};
