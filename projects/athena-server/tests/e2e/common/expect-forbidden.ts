import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";

export function expectForbidden(body: any, statusCode: any, identifier: string = ErrorIdentifiers.ACCESS_FORBIDDEN) {
  expect(statusCode).toEqual(HTTPStatusCodes.FORBIDDEN);
  expect(body).toHaveProperty('identifier');
  expect(body.identifier).toEqual(identifier);
}