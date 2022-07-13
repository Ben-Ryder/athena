import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";

export function expectForbidden(body: any, statusCode: any) {
  expect(statusCode).toEqual(HTTPStatusCodes.FORBIDDEN);
  expect(body).toHaveProperty('identifier');
  expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_FORBIDDEN);
}