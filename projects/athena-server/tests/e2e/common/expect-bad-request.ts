import {ErrorIdentifiers, HTTPStatusCodes} from "@kangojs/core";

export function expectBadRequest(body: any, statusCode: any, identifier: any = ErrorIdentifiers.USER_REQUEST_INVALID) {
  expect(statusCode).toEqual(HTTPStatusCodes.BAD_REQUEST);
  expect(body).toEqual(expect.objectContaining({
    identifier: identifier
  }))
}