import { Controller, Route, HTTPMethods } from '@kangojs/core';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from './auth.service';
import {LoginRequestSchema, RefreshRequestSchema, RevokeRequestSchema} from "@ben-ryder/athena-js-lib";


@Controller('/v1/auth', {
    identifier: "auth-controller"
})
export class AuthController {
    constructor(
      private authService: AuthService
    ) {}

    @Route({
        path: '/login',
        httpMethod: HTTPMethods.POST,
        bodyShape: LoginRequestSchema,
        authRequired: false
    })
    async login(req: Request, res: Response, next: NextFunction) {
        const loginDetails = <LoginRequestSchema> req.body;

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
        bodyShape: RevokeRequestSchema,
        authRequired: false
    })
    async revoke(req: Request, res: Response, next: NextFunction) {
        const tokens = <RevokeRequestSchema> req.body;

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
        bodyShape: RefreshRequestSchema,
        authRequired: false
    })
    async refresh(req: Request, res: Response, next: NextFunction) {
        const bodyData = <RefreshRequestSchema> req.body;

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
