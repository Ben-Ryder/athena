import { Controller, Route, HTTPMethods } from '@kangojs/core';
import { Request, Response, NextFunction } from 'express';

@Controller('/', {
    identifier: "base-controller",
})
export class BaseController {
    @Route({
        httpMethod: HTTPMethods.GET,
        authRequired: false
    })
    async base(req: Request, res: Response, next: NextFunction) {
        return this.sendWelcomeMessage(req, res, next);
    }

    @Route({
        path: '/v1',
        httpMethod: HTTPMethods.GET,
        authRequired: false
    })
    async baseV1(req: Request, res: Response, next: NextFunction) {
        return this.sendWelcomeMessage(req, res, next);
    }

    async sendWelcomeMessage(req: Request, res: Response, next: NextFunction) {
        return res.send({
            message: "Welcome to Athena, a place for notes, lists and reminders.",
            documentation: "https://github.com/Ben-Ryder/athena"
        });
    }
}
