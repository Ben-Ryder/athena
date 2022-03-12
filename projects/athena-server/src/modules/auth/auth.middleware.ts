import { NextFunction, Request, Response } from 'express';

import { AccessDeniedError } from '@kangojs/error-handler';
import { RequestWithDto } from '@kangojs/class-validation';
import { TokenService } from '../../services/token/token.service';

export interface RequestUser {
  id: string
}

export interface RequestWithUser extends RequestWithDto {
  user: RequestUser
}


export function useAuthValidator(tokenService: TokenService = new TokenService()) {
  return async function authValidator(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.header('authorization');

    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];
      const accessTokenPayload = await tokenService.validateAndDecodeAccessToken(accessToken);

      if (accessTokenPayload) {
        // todo: better way to handle req types and adding new attribute?
        // @ts-ignore
        req.user = {
          id: accessTokenPayload.userId
        }
        return next();
      }
    }

    return next(new AccessDeniedError({
      message: 'Request Access Denied'
    }))
  }
}
