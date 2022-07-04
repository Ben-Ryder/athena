import { DeepPartial } from 'typeorm';

import { DatabaseRepository } from '../../../services/database/database.repository';
import { Injectable } from "@kangojs/core";

import { NoteEntity } from "./notes.database.entity";
import {DatabaseService} from "../../../services/database/database.service";
import {CreateNoteWithUserDto, NoteDto, UpdateNoteDto} from "@ben-ryder/athena-js-lib";


@Injectable()
export class NotesDatabaseRepository extends DatabaseRepository<NoteEntity, NoteDto, CreateNoteWithUserDto, UpdateNoteDto>{
    constructor(
      private databaseService: DatabaseService
    ) {
        super(NoteEntity, databaseService, ["user"]);
    }

    mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateNoteWithUserDto): DeepPartial<NoteEntity> {
        return {
            title: createEntityDto.title,
            body: createEntityDto.body || null,
            user: {
                id: createEntityDto.userId
            }
        };
    }

    mapDatabaseEntityToEntityDto(databaseEntity: NoteEntity): NoteDto {
        return {
            id: databaseEntity.id,
            title: databaseEntity.title,
            body: databaseEntity.body,
            createdAt: databaseEntity.createdAt,
            updatedAt: databaseEntity.updatedAt,
            user: databaseEntity.user
        };
    }

    mergeUpdateEntityDtoWithDatabaseEntity(databaseEntity: NoteEntity, updateEntityDto: UpdateNoteDto): DeepPartial<NoteEntity> {
        return {
            ...databaseEntity,
            ...updateEntityDto
        }
    }
}
