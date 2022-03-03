import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { Request, Response, NextFunction } from 'express';

import { CheckShape } from "./shapes/check.shape";
import {TokenService} from "../../services/token/token.service";
import {UsersService} from "../users/users.service";
import {UserDto} from "../users/dtos/users.dto";


export class AuthService {
    constructor(
        private usersService: UsersService = new UsersService(),
        private tokenService: TokenService = new TokenService("secret", "cron")
    ) {}

    async login(username: string, password: string): Promise<string> {
       let user: UserDto;

       try {
           user = await this.usersService.getByUsername(username);
       }
       catch (e) {
           throw new Error("nope");
       }

       return "token";
    }

    @Route({
        path: '/logout',
        httpMethod: HTTPMethods.POST,
    })
    async logout(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to log out via /auth/logout [POST].`);
    }

    @Route({
        path: '/check',
        httpMethod: HTTPMethods.POST,
        bodyShape: CheckShape
    })
    async check(req: Request, res: Response, next: NextFunction) {
        return res.send(`You have just attempted to check a user via /auth/check [POST].`);
    }
}
