import { NextFunction, Request, Response } from 'express';

import {AccessUnauthorizedError, Middleware} from '@kangojs/core';
import { TokenService } from '../../services/token/token.service';
import  {MiddlewareFactory } from "@kangojs/core";

export interface RequestUser {
  id: string
}

export interface RequestWithUser extends Request {
  user: RequestUser
}

@Middleware({
  identifier: "auth-validator-middleware"
})
export class AuthValidator implements MiddlewareFactory {
  constructor(
    private tokenService: TokenService
  ) {}

  async run(req: Request, res: Response, next: NextFunction): Promise<any> {
    const authorizationHeader = req.header('authorization');

    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];
      const accessTokenPayload = await this.tokenService.validateAndDecodeAccessToken(accessToken);

      if (accessTokenPayload) {
        // todo: better way to handle req spec and adding new attribute?
        // @ts-ignore
        req.user = {
          id: accessTokenPayload.userId
        }
        return next();
      }
    }

    return next(
      new AccessUnauthorizedError({
        message: 'Request Access Denied'
      })
    )
  }
}
