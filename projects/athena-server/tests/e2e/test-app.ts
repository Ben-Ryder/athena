import { agent as _request } from "supertest"
import { getApp } from "../../src/app";

export const getTestApp = async function() {
  const app = await getApp();
  return _request(app);
};
