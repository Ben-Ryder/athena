import { Request, Response, NextFunction } from 'express';

import { Controller, Route, HTTPMethods } from '@kangojs/core';

import { UsersService } from './users.service';
import {RequestWithUser} from "../auth/auth.validator";
import {CreateUserSchema, UpdateUserSchema, UserDto, UserParamsSchema} from "@ben-ryder/athena-js-lib";


@Controller('/users/v1',{
    identifier: "users-controller"
})
export class UsersController {
    constructor(
      private usersService: UsersService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateUserSchema,
        authRequired: false
    })
    async add(req: Request, res: Response, next: NextFunction) {
        let newUser: UserDto;

        try {
            newUser = await this.usersService.add(req.body);
        }
        catch(e) {
            return next(e);
        }

        return res.send(newUser);
    }

    @Route({
        path: '/:userId',
        httpMethod: HTTPMethods.GET,
        paramsShape: UserParamsSchema
    })
    async get(req: RequestWithUser, res: Response, next: NextFunction) {
        let user: UserDto | null;

        try {
            user = await this.usersService.get(req.user.id, req.params.userId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(user);
    }

    @Route({
        path: '/:userId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateUserSchema,
        paramsShape: UserParamsSchema
    })
    async update(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            await this.usersService.update(req.user.id, req.params.userId, req.body);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }

    @Route({
        path: '/:userId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: UserParamsSchema
    })
    async delete(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            await this.usersService.delete(req.user.id, req.params.userId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }
}
