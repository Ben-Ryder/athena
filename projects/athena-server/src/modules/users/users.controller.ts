import { Request, Response, NextFunction } from 'express';

import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { RequestWithDto } from "@kangojs/class-validation";

import { UsersService } from './users.service';
import { UserDto } from './dtos/users.dto';
import { CreateUserShape } from './shapes/create.users.shape';
import { UpdateUserShape } from './shapes/update.notes.shape';
import { UserParamsShape } from './shapes/user-params.shape';


@Controller('/users/v1')
export default class UsersController {
    constructor(
      private usersService: UsersService = new UsersService()
    ) {}

    // todo: maybe introduce user roles and expose this endpoint to administrators?
    // @Route({
    //     httpMethod: HTTPMethods.GET,
    // })
    // async getAll(req: Request, res: Response, next: NextFunction) {
    //     let users: UserDto[] = [];
    //
    //     try {
    //         users = await this.usersService.getAll();
    //     }
    //     catch (e) {
    //         return next(e);
    //     }
    //
    //     return res.send(users);
    // }

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateUserShape
    })
    async add(req: RequestWithDto, res: Response, next: NextFunction) {
        let newUser: UserDto;

        try {
            newUser = await this.usersService.add(req.bodyDto);
        }
        catch(e) {
            return next(e);
        }

        return res.send(newUser);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.GET,
        paramsShape: UserParamsShape
    })
    async get(req: Request, res: Response, next: NextFunction) {
        let user: UserDto | null;

        try {
            user = await this.usersService.get(req.params.noteId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(user);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateUserShape,
        paramsShape: UserParamsShape
    })
    async update(req: RequestWithDto, res: Response, next: NextFunction) {
        try {
            await this.usersService.update(req.params.noteId, req.bodyDto);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: UserParamsShape
    })
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            await this.usersService.delete(req.params.noteId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }
}
