import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { Request, Response, NextFunction } from 'express';

import { RefreshShape } from "./shapes/refresh.shape";
import { LoginShape } from "./shapes/login.shape";
import { RequestWithDto } from "@kangojs/class-validation";
import { RevokeShape } from './shapes/revoke.shape';
import { AuthService } from './auth.service';
import { RequestWithUser } from "./auth.middleware";


@Controller('/auth/v1')
class AuthController {
    constructor(
      private authService: AuthService = new AuthService()
    ) {}

    @Route({
        path: '/login',
        httpMethod: HTTPMethods.POST,
        bodyShape: LoginShape,
        authRequired: false
    })
    async login(req: RequestWithDto, res: Response, next: NextFunction) {
        const loginDetails = <LoginShape> req.bodyDto;

        try {
            const tokens = await this.authService.login(loginDetails.username, loginDetails.password);
            return res.send(tokens);
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        path: '/revoke',
        httpMethod: HTTPMethods.POST,
        bodyShape: RevokeShape,
        authRequired: false
    })
    async revoke(req: RequestWithDto, res: Response, next: NextFunction) {
        const tokens = <RevokeShape> req.bodyDto;

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
        bodyShape: RefreshShape,
        authRequired: false
    })
    async refresh(req: RequestWithUser, res: Response, next: NextFunction) {
        const bodyData = <RefreshShape> req.bodyDto;

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

export default AuthController;
