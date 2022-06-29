import {Injectable, AccessDeniedError} from '@kangojs/core';

import { TokenService } from "../../services/token/token.service";
import { PasswordService } from "../../services/password/password.service";

import { UsersService } from "../users/users.service";
import { UserDto } from "../users/dtos/user.dto";

@Injectable({
  identifier: "auth-service"
})
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tokenService: TokenService
    ) {}

    async login(username: string, password: string) {
       let user: UserDto;

       try {
           user = await this.usersService.getFullByUsername(username);
       }
       catch (e) {
           throw new AccessDeniedError({
             message: 'The supplied username & password combination is invalid.',
             applicationMessage: 'The supplied username & password combination is invalid.'
           });
       }

       const passwordValid = PasswordService.checkPassword(password, user.password);
       if (!passwordValid) {
         throw new AccessDeniedError({
           message: 'The supplied username & password combination is invalid.',
           applicationMessage: 'The supplied username & password combination is invalid.'
         });
       }

       const publicUser = this.usersService.makeUserPublic(user);
       const tokenPair = this.tokenService.createTokenPair(user.id);

       return {
         user: publicUser,
         ...tokenPair
       };
    }

    async revokeRefreshToken(refreshToken: string) {
        const isValid = await this.tokenService.isSignedRefreshToken(refreshToken);
        if (isValid) {
            await this.tokenService.addTokenToBlacklist(refreshToken);
        }
        // todo: throw an error to the user or fail silently?
    }

    async revokeAccessToken(accessToken: string) {
        const isValid = await this.tokenService.isSignedAccessToken(accessToken);
        if (isValid) {
            await this.tokenService.addTokenToBlacklist(accessToken);
        }
        // todo: throw an error to the user or fail silently?
    }

    async refresh(refreshToken: string) {
        const tokenPayload = await this.tokenService.validateAndDecodeRefreshToken(refreshToken);

        if (!tokenPayload) {
          throw new AccessDeniedError({
            message: 'The supplied refresh token is invalid.',
            applicationMessage: 'The supplied refresh token is invalid.'
          });
        }

        await this.tokenService.addTokenToBlacklist(refreshToken);
        return this.tokenService.createTokenPair(tokenPayload.userId);
    }
}
