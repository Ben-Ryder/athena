import { Response, NextFunction } from 'express';

import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { RequestWithDto } from "@kangojs/class-validation";

import { UsersService } from './users.service';
import { PublicUserDto } from "./dtos/public.users.dto";
import { CreateUserShape } from './shapes/create.users.shape';
import { UpdateUserShape } from './shapes/update.notes.shape';
import { UserParamsShape } from './shapes/user-params.shape';
import {RequestWithUser} from "../auth/auth.middleware";


@Controller('/users/v1')
export default class UsersController {
    constructor(
      private usersService: UsersService = new UsersService()
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateUserShape,
        authRequired: false
    })
    async add(req: RequestWithDto, res: Response, next: NextFunction) {
        let newUser: PublicUserDto;

        try {
            newUser = await this.usersService.add(req.bodyDto);
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
        let user: PublicUserDto | null;

        try {
            user = await this.usersService.get(req.user.id, req.paramsDto.userId, );
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
            await this.usersService.update(req.user.id, req.paramsDto.userId, req.bodyDto);
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
            await this.usersService.delete(req.user.id, req.paramsDto.userId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }
}
