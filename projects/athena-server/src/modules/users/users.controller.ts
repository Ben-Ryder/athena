import { Request, Response, NextFunction } from 'express';

import { Controller, Route, HTTPMethods } from '@kangojs/core';

import { UsersService } from './users.service';
import { ExposedUserDto } from "./dtos/exposed.user.dto";
import { CreateUserShape } from './shapes/create.users.shape';
import { UpdateUserShape } from './shapes/update.users.shape';
import { UserParamsShape } from './shapes/user-params.shape';
import {RequestWithUser} from "../auth/auth.validator";


@Controller('/users/v1',{
    identifier: "users-controller"
})
export class UsersController {
    constructor(
      private usersService: UsersService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateUserShape,
        authRequired: false
    })
    async add(req: Request, res: Response, next: NextFunction) {
        let newUser: ExposedUserDto;

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
        paramsShape: UserParamsShape
    })
    async get(req: RequestWithUser, res: Response, next: NextFunction) {
        let user: ExposedUserDto | null;

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
        bodyShape: UpdateUserShape,
        paramsShape: UserParamsShape
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
        paramsShape: UserParamsShape
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
