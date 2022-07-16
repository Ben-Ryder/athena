import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";

export function expectUnauthorized(body: any, statusCode: any, identifier: string = ErrorIdentifiers.ACCESS_UNAUTHORIZED) {
  expect(statusCode).toEqual(HTTPStatusCodes.UNAUTHORIZED);
  expect(body).toHaveProperty('identifier');
  expect(body.identifier).toEqual(identifier);
}