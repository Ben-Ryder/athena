import { DeepPartial } from 'typeorm';

import { DatabaseRepository } from '../../../services/database/database.repository';
import { Injectable } from "@kangojs/core";

import { NoteEntity } from "./notes.database.entity";
import {DatabaseService} from "../../../services/database/database.service";
import {CreateDatabaseNoteDto} from "../dtos/create.database-note.dto-interface";
import {UpdateDatabaseNoteDto} from "../dtos/update.database-note.dto-interface";
import {DatabaseNoteDto} from "../dtos/database-note.dto-interface";


@Injectable()
export class NotesDatabaseRepository extends DatabaseRepository<NoteEntity, DatabaseNoteDto, CreateDatabaseNoteDto, UpdateDatabaseNoteDto>{
    constructor(
      private databaseService: DatabaseService
    ) {
        super(NoteEntity, databaseService, ["user"]);
    }

    getList(requestUserId: string): Promise<DatabaseNoteDto[]> {
        // todo: revisit. USERS GET ALL NOTES AT THE MOMENT
        return this.getAll()
    }

    mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateDatabaseNoteDto): DeepPartial<NoteEntity> {
        return {
            title: createEntityDto.title,
            body: createEntityDto.body,
            user: {
                id: createEntityDto.userId
            }
        };
    }

    mapDatabaseEntityToEntityDto(databaseEntity: NoteEntity): DatabaseNoteDto {
        return {
            id: databaseEntity.id,
            title: databaseEntity.title,
            body: databaseEntity.body,
            createdAt: databaseEntity.createdAt,
            updatedAt: databaseEntity.updatedAt,
            userId: databaseEntity.user.id,
            tags: [] // todo: when tags are added
        };
    }

    mergeUpdateEntityDtoWithDatabaseEntity(databaseEntity: NoteEntity, updateEntityDto: UpdateDatabaseNoteDto): DeepPartial<NoteEntity> {
        return {
            ...databaseEntity,
            ...updateEntityDto
        }
    }
}
