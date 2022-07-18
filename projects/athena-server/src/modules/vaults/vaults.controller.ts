import { Response, NextFunction } from 'express';

import {Controller, Route, HTTPMethods} from '@kangojs/core';

import {
    CreateVaultRequestSchema, CreateVaultResponse,
    GetVaultResponse,
    UpdateVaultRequestSchema, UpdateVaultResponse, VaultsQueryParamsSchema,
    VaultsURLParamsSchema
} from "@ben-ryder/athena-js-lib";
import {VaultsService} from "./vaults.service";
import {RequestWithUserContext} from "../../common/request-with-context";


@Controller('/v1/vaults',{
    identifier: "vaults-controller"
})
export class VaultsController {
    constructor(
      private vaultsService: VaultsService
    ) {}

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateVaultRequestSchema
    })
    async add(req: RequestWithUserContext, res: Response, next: NextFunction) {
        let newVault: CreateVaultResponse;

        try {
            newVault = await this.vaultsService.add(req.context.user.id, req.body);
        }
        catch(e) {
            return next(e);
        }

        return res.send(newVault);
    }

    @Route({
        path: '/:vaultId',
        httpMethod: HTTPMethods.GET,
        paramsShape: VaultsURLParamsSchema
    })
    async get(req: RequestWithUserContext, res: Response, next: NextFunction) {
        let vault: GetVaultResponse | null;

        try {
            vault = await this.vaultsService.getWithAccessCheck(req.context.user.id, req.params.vaultId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(vault);
    }

    @Route({
        path: '/:vaultId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateVaultRequestSchema,
        paramsShape: VaultsURLParamsSchema
    })
    async update(req: RequestWithUserContext, res: Response, next: NextFunction) {
        let updatedVault: UpdateVaultResponse;

        try {
            updatedVault = await this.vaultsService.updateWithAccessCheck(req.context.user.id, req.params.vaultId, req.body);
        }
        catch (e) {
            return next(e);
        }

        return res.send(updatedVault);
    }

    @Route({
        path: '/:vaultId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: VaultsURLParamsSchema
    })
    async delete(req: RequestWithUserContext, res: Response, next: NextFunction) {
        try {
            await this.vaultsService.deleteWithAccessCheck(req.context.user.id, req.params.vaultId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }

    @Route({
        httpMethod: HTTPMethods.GET,
        queryShape: VaultsQueryParamsSchema
    })
    async list(req: RequestWithUserContext, res: Response, next: NextFunction) {
        try {
            const response =  await this.vaultsService.list(req.context.user.id, req.params);
            return res.send(response);
        }
        catch (e) {
            return next(e);
        }
    }
}
