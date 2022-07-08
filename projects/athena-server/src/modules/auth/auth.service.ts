import {Injectable, AccessDeniedError} from '@kangojs/core';

import { TokenService } from "../../services/token/token.service";
import { PasswordService } from "../../services/password/password.service";

import { UsersService } from "../users/users.service";
import {LoginResponse, RefreshResponse} from "@ben-ryder/athena-js-lib";
import {DatabaseUserDto} from "../users/dtos/database-user.dto-interface";


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
           throw new AccessDeniedError({
             message: 'The supplied username & password combination is invalid.',
             applicationMessage: 'The supplied username & password combination is invalid.'
           });
       }

       const passwordValid = PasswordService.checkPassword(password, user.passwordHash);
       if (!passwordValid) {
         throw new AccessDeniedError({
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

    async revokeRefreshToken(refreshToken: string): Promise<void> {
        const isValid = await this.tokenService.isSignedRefreshToken(refreshToken);
        if (isValid) {
            await this.tokenService.addTokenToBlacklist(refreshToken);
        }
        // todo: throw an error to the user or fail silently?
    }

    async revokeAccessToken(accessToken: string): Promise<void> {
        const isValid = await this.tokenService.isSignedAccessToken(accessToken);
        if (isValid) {
            await this.tokenService.addTokenToBlacklist(accessToken);
        }
        // todo: throw an error to the user or fail silently?
    }

    async refresh(refreshToken: string): Promise<RefreshResponse> {
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
