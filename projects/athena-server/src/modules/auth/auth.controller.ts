import { Controller, Route, HTTPMethods } from '@kangojs/core';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from './auth.service';
import {LoginDto, LoginSchema, RefreshSchema, RevokeSchema} from "@ben-ryder/athena-js-lib/build/src";


@Controller('/auth/v1', {
    identifier: "auth-controller"
})
export class AuthController {
    constructor(
      private authService: AuthService
    ) {}

    @Route({
        path: '/login',
        httpMethod: HTTPMethods.POST,
        bodyShape: LoginSchema,
        authRequired: false
    })
    async login(req: Request, res: Response, next: NextFunction) {
        const loginDetails = <LoginDto> req.body;

        try {
            const loginResponse = await this.authService.login(loginDetails.username, loginDetails.password);
            return res.send(loginResponse);
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        path: '/revoke',
        httpMethod: HTTPMethods.POST,
        bodyShape: RevokeSchema,
        authRequired: false
    })
    async revoke(req: Request, res: Response, next: NextFunction) {
        const tokens = <RevokeSchema> req.body;

        try {
            if (tokens.refreshToken) {
                await this.authService.revokeRefreshToken(tokens.refreshToken);
            }
            if (tokens.accessToken) {
                await this.authService.revokeAccessToken(tokens.accessToken);
            }
            return res.send({});
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        path: '/refresh',
        httpMethod: HTTPMethods.POST,
        bodyShape: RefreshSchema,
        authRequired: false
    })
    async refresh(req: Request, res: Response, next: NextFunction) {
        const bodyData = <RefreshSchema> req.body;

        try {
            const tokens = await this.authService.refresh(bodyData.refreshToken);
            return res.send(tokens);
        }
        catch(e) {
            return next(e);
        }
    }

    /**
     * An empty endpoint which can be used to check if your auth credentials are valid.
     *
     * @param req
     * @param res
     * @param next
     */
    @Route({
        path: '/check',
        httpMethod: HTTPMethods.GET
    })
    async check(req: Request, res: Response, next: NextFunction) {
        return res.send({});
    }
}
