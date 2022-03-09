import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { Request, Response, NextFunction } from 'express';

import { RefreshShape } from "./shapes/refresh.shape";
import {TokenService} from "../../services/token/token.service";
import {UsersService} from "../users/users.service";
import {UserDto} from "../users/dtos/users.dto";
import { AccessDeniedError } from '@kangojs/error-handler';


export class AuthService {
    constructor(
        private usersService: UsersService = new UsersService(),
        private tokenService: TokenService = new TokenService()
    ) {}

    async login(username: string, password: string) {
       let user: UserDto;

       try {
           user = await this.usersService.getByUsername(username);
       }
       catch (e) {
           throw new AccessDeniedError({
             message: 'The supplied username & password combination is invalid.',
             applicationMessage: 'The supplied username & password combination is invalid.'
           });
       }

       if (user.password !== password) {
         throw new AccessDeniedError({
           message: 'The supplied username & password combination is invalid.',
           applicationMessage: 'The supplied username & password combination is invalid.'
         });
       }

       return this.tokenService.createTokenPair(user.id);
    }

    async logout(refreshToken: string, accessToken?: string) {
        await this.tokenService.blacklistRefreshToken(refreshToken);

        if (accessToken) {
          await this.tokenService.blacklistAccessToken(accessToken);
        }
    }

    async refreshAccessToken(refreshToken: string) {
        const validToken = this.tokenService.isValidRefreshToken(refreshToken);

        if (!validToken) {
          throw new AccessDeniedError({
            message: 'The supplied refresh token is invalid.',
            applicationMessage: 'The supplied refresh token is invalid.'
          });
        }

        this.tokenService.blacklistRefreshToken(refreshToken);
        return this.tokenService.createTokenPair("user");
    }
}
