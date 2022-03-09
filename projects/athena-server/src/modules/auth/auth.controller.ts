import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { Request, Response, NextFunction } from 'express';

import { RefreshShape } from "./shapes/refresh.shape";
import { LoginShape } from "./shapes/login.shape";
import { RequestWithDto } from "@kangojs/class-validation";
import { LogoutShape } from './shapes/logout.shape';
import { AuthService } from './auth.service';


@Controller('/auth/v1')
class AuthController {
    constructor(
      private authService: AuthService = new AuthService()
    ) {}

    @Route({
        path: '/login',
        httpMethod: HTTPMethods.POST,
        bodyShape: LoginShape
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
        path: '/logout',
        httpMethod: HTTPMethods.POST,
        bodyShape: LogoutShape
    })
    async logout(req: RequestWithDto, res: Response, next: NextFunction) {
        const tokens = <LogoutShape> req.bodyDto;

        try {
            await this.authService.logout(tokens.refreshToken, tokens.accessToken);
            return res.send({});
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        path: '/refresh',
        httpMethod: HTTPMethods.POST,
        bodyShape: RefreshShape
    })
    async refresh(req: RequestWithDto, res: Response, next: NextFunction) {
        const bodyData = <RefreshShape> req.bodyDto;

        try {
            const tokens = await this.authService.refreshAccessToken(bodyData.refreshToken);
            return res.send(tokens);
        }
        catch(e) {
            return next(e);
        }
    }

    @Route({
        path: '/check',
        httpMethod: HTTPMethods.GET,
        bodyShape: RefreshShape
    })
    async check(req: Request, res: Response, next: NextFunction) {
        return res.send({});
    }
}

export default AuthController;
