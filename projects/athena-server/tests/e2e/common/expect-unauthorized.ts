import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";

export function expectUnauthorized(body: any, statusCode: any) {
  expect(statusCode).toEqual(HTTPStatusCodes.UNAUTHORIZED);
  expect(body).toHaveProperty('identifier');
  expect(body.identifier).toEqual(ErrorIdentifiers.ACCESS_UNAUTHORIZED);
}