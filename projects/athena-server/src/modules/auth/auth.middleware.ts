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

export function getRequestUserId(req: Request) {

}

export function useAuthValidator(tokenService: TokenService = new TokenService()) {
  return function authValidator(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.header('authorization');

    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];
      const validAccessToken = tokenService.isValidAccessToken(accessToken);

      if (validAccessToken) {
        return next();
      }
    }

    throw new AccessDeniedError({
      message: 'Request Access Denied',
      applicationMessage: ''
    })
  }
}
