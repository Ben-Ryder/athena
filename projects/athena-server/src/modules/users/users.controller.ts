import { Request, Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods} from '@kangojs/core';

import { UsersService } from './users.service';
import {RequestWithUser} from "../auth/auth.validator";
import {
    CreateUserRequestSchema,
    CreateUserResponse,
    GetUserResponse, UpdateUserRequestSchema, UpdateUserResponse, UserDto,
    UsersURLParamsSchema
} from "@ben-ryder/athena-js-lib";


@Controller('/v1/users',{
    identifier: "users-controller"
})
export class UsersController {
    constructor(
      private usersService: UsersService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateUserRequestSchema,
        authRequired: false
    })
    async add(req: Request, res: Response, next: NextFunction) {
        let newUser: CreateUserResponse;

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
        paramsShape: UsersURLParamsSchema
    })
    async get(req: RequestWithUser, res: Response, next: NextFunction) {
        let user: GetUserResponse | null;

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
        bodyShape: UpdateUserRequestSchema,
        paramsShape: UsersURLParamsSchema
    })
    async update(req: RequestWithUser, res: Response, next: NextFunction) {
        let updatedUser: UpdateUserResponse;

        try {
            updatedUser = await this.usersService.update(req.user.id, req.params.userId, req.body);
        }
        catch (e) {
            return next(e);
        }

        return res.send(updatedUser);
    }

    @Route({
        path: '/:userId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: UsersURLParamsSchema
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
