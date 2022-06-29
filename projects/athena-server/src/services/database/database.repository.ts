import {DeepPartial, EntityTarget, Repository} from 'typeorm';
import {FindOptionsWhere} from "typeorm/find-options/FindOptionsWhere";

import { DatabaseService } from 'src/services/database/database.service';
import { DatabaseErrorCodes } from './database-error-codes';

import { SystemError } from "@kangojs/core";
import { ResourceNotFoundError } from "@kangojs/core";
import { ResourceRelationshipError } from "@kangojs/core";
import { ResourceNotUniqueError } from "@kangojs/core";


/**
 * A generic database repository.
 *
 * todo: I'm using <unknown> and <DeepPartial<DatabaseEntity>> a lot. Is this correct?
 */
export abstract class DatabaseRepository<DatabaseEntity, EntityDto, CreateEntityDto, UpdateEntityDto> {
    constructor(
      private entity: EntityTarget<DatabaseEntity>,
      private db: DatabaseService,
      private relations: string[] = []
    ) {}

    abstract mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateEntityDto): DeepPartial<DatabaseEntity> ;

    abstract mapDatabaseEntityToEntityDto(databaseEntity: DatabaseEntity): EntityDto;

    abstract mergeUpdateEntityDtoWithDatabaseEntity(databaseEntity: DatabaseEntity, updateEntityDto: UpdateEntityDto): DeepPartial<DatabaseEntity>;


    private async getRepository(): Promise<Repository<DatabaseEntity>> {
        const connection = await this.db.getConnection();
        return connection.getRepository(this.entity);
    }

    async add(createEntityDto: CreateEntityDto): Promise<EntityDto> {
        const repo = await this.getRepository();

        const entityToSave = this.mapCreateEntityDtoToDatabaseEntity(createEntityDto);

        const newEntity = <DeepPartial<DatabaseEntity>> repo.create(entityToSave);
        let savedEntity: DatabaseEntity;

        try {
            savedEntity = await repo.save(newEntity);
        }
        catch (e: any) {
            if (e.errno === DatabaseErrorCodes.FOREIGN_KEY_INVALID) {
                throw new ResourceRelationshipError({
                    message: e.message,
                    applicationMessage: 'You have tried to add a relationship with an entity that doesn\'t exist',
                    originalError: e,
                });
            }
            else if (e.message && e.message.includes("Duplicate entry")) {
                throw new ResourceNotUniqueError({
                    message: e.message,
                    applicationMessage: 'You have tried to add an entity that is not unique.',
                    originalError: e,
                })
            }

            throw new SystemError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to save the entity.',
                originalError: e,
            });
        }

        return this.mapDatabaseEntityToEntityDto(savedEntity);
    }

    async getById(entityId: string): Promise<EntityDto> {
        const where = {id: entityId} as unknown as FindOptionsWhere<DatabaseEntity>;
        return this.get(where);
    }

    async get(options: FindOptionsWhere<DatabaseEntity>): Promise<EntityDto> {
        const repo = await this.getRepository();

        let result: DatabaseEntity | null;

        try {
            result = await repo.findOne({
                where: options,
                relations: this.relations
            });
        }
        catch(e: any) {
            throw new SystemError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to fetch the results.',
                originalError: e,
            });
        }

        if (!result) {
            throw new ResourceNotFoundError({
                message: 'The requested entity could not be found.',
                applicationMessage: 'The requested entity could not be found.',
            });
        }

        return this.mapDatabaseEntityToEntityDto(result);
    }

    async getAll(): Promise<EntityDto[]> {
        const repo = await this.getRepository();

        let result: DatabaseEntity[];

        try {
            result = await repo.find({relations: this.relations});
        }
        catch(e: any) {
            throw new SystemError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to fetch the results.',
                originalError: e,
            });
        }

        return result.map(this.mapDatabaseEntityToEntityDto);
    }

    async update(entityId: string, updateEntityDto: UpdateEntityDto): Promise<void> {
        const repo = await this.getRepository();

        let entity;
        try {
            const where = {id: entityId} as unknown as FindOptionsWhere<DatabaseEntity>;
            entity = await repo.findOne({where});
        }
        catch (e: any) {
            throw new SystemError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to get the entity to update.',
                originalError: e,
            });
        }

        if(!entity) {
            throw new ResourceNotFoundError({
                message: 'The requested entity to update could not be found.',
                applicationMessage: 'The requested entity to update could not be found.',
            });
        }

        const updatedNote = this.mergeUpdateEntityDtoWithDatabaseEntity(entity, updateEntityDto);

        try {
            await repo.save(updatedNote);
        }
        catch (e: any) {
            if (e.errno === DatabaseErrorCodes.FOREIGN_KEY_INVALID) {
                throw new ResourceRelationshipError({
                    message: e.message,
                    applicationMessage: 'You have tried to add a relationship with an entity that doesn\'t exist',
                    originalError: e,
                });
            }
            else if (e.message && e.message.includes("Duplicate entry")) {
                throw new ResourceNotUniqueError({
                    message: e.message,
                    applicationMessage: 'You have tried to make an update that would cause the entity to stop being unique.',
                    originalError: e,
                })
            }

            throw new SystemError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to save the updated entity.',
                originalError: e,
            });
        }
    }

    async delete(entityId: string): Promise<void> {
        const repo = await this.getRepository();

        let entity;
        try {
            const where = {id: entityId} as unknown as FindOptionsWhere<DatabaseEntity>;
            entity = await repo.findOne({where});
        }
        catch (e: any) {
            throw new SystemError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to get the entity to delete.',
                originalError: e,
            });
        }

        if(!entity) {
            throw new ResourceNotFoundError({
                message: 'The requested entity to delete could not be found.',
                applicationMessage: 'The requested entity to delete could not be found.',
            });
        }

        try {
            await repo.remove(entity);
        }
        catch (e: any) {
            throw new SystemError({
                message: e.message,
                applicationMessage: 'There was an error while attempting to delete the entity.',
                originalError: e,
            });
        }
    }
}
