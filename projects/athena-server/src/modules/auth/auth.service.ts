import {Injectable, AccessForbiddenError, AccessUnauthorizedError} from '@kangojs/core';

import { TokenService } from "../../services/token/token.service";
import { PasswordService } from "../../services/password/password.service";

import { UsersService } from "../users/users.service";
import {LoginResponse, RefreshResponse} from "@ben-ryder/athena-js-lib";
import {DatabaseUserDto} from "../users/dtos/database-user.dto-interface";
import {AthenaErrorIdentifiers} from "../../error-identifiers";
import {RevokeTokensDto} from "./dtos/revoke-tokens.dto";


@Injectable({
  identifier: "auth-service"
})
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService
    ) {}

    async login(username: string, password: string): Promise<LoginResponse> {
       let user: DatabaseUserDto;

       try {
           user = await this.usersService.getWithPasswordByUsername(username);
       }
       catch (e) {
           throw new AccessForbiddenError({
             identifier: AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
             message: 'The supplied username & password combination is invalid.',
             applicationMessage: 'The supplied username & password combination is invalid.'
           });
       }

       const passwordValid = await PasswordService.checkPassword(password, user.passwordHash);
       if (!passwordValid) {
         throw new AccessForbiddenError({
           identifier: AthenaErrorIdentifiers.AUTH_CREDENTIALS_INVALID,
           message: 'The supplied username & password combination is invalid.',
           applicationMessage: 'The supplied username & password combination is invalid.'
         });
       }

       const userDto = this.usersService.removePasswordFromUser(user);
       const tokenPair = this.tokenService.createTokenPair(user.id);

       return {
         user: userDto,
         ...tokenPair
       };
    }

    async revokeTokens(tokens: RevokeTokensDto) {
      if (tokens.refreshToken) {
        let validRefreshToken = await this.tokenService.isValidRefreshToken(tokens.refreshToken);

        if (!validRefreshToken) {
          throw new AccessUnauthorizedError({
            identifier: AthenaErrorIdentifiers.AUTH_TOKEN_INVALID,
            applicationMessage: "The supplied refresh token is invalid."
          })
        }
      }

      if (tokens.accessToken) {
        let validAccessToken = await this.tokenService.isValidAccessToken(tokens.accessToken);

        if (!validAccessToken) {
          throw new AccessUnauthorizedError({
            identifier: AthenaErrorIdentifiers.AUTH_TOKEN_INVALID,
            applicationMessage: "The supplied access token is invalid."
          })
        }
      }

      // If both tokens are supplied, check they're both valid before adding them to the blacklist
      // This ensures a predictable behaviour, preventing guesswork in the case that only one of the tokens was invalid.
      if (tokens.refreshToken) {
        await this.tokenService.addTokenToBlacklist(tokens.refreshToken);
      }
      if (tokens.accessToken) {
        await this.tokenService.addTokenToBlacklist(tokens.accessToken);
      }
    }

    async refresh(refreshToken: string): Promise<RefreshResponse> {
        const tokenPayload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

        if (!tokenPayload) {
          throw new AccessUnauthorizedError({
            identifier: AthenaErrorIdentifiers.AUTH_TOKEN_INVALID,
            message: 'The supplied refresh token is invalid.',
            applicationMessage: 'The supplied refresh token is invalid.'
          });
        }

        await this.tokenService.addTokenToBlacklist(refreshToken);
        return this.tokenService.createTokenPair(tokenPayload.userId);
    }
}
