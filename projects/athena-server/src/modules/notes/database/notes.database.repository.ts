import { DeepPartial } from 'typeorm';

import { DatabaseRepository } from '../../../services/database/database.repository';
import { Injectable } from "@kangojs/core";

import { NoteEntity } from "./notes.database.entity";
import { NoteDto } from "../dtos/note.dto";
import { CreateNoteDto } from "../dtos/create.note.dto";
import { UpdateNoteDto } from "../dtos/update.note.dto";
import {DatabaseService} from "../../../services/database/database.service";


@Injectable()
export class NotesDatabaseRepository extends DatabaseRepository<NoteEntity, NoteDto, CreateNoteDto, UpdateNoteDto>{
    constructor(
      private databaseService: DatabaseService
    ) {
        super(NoteEntity, databaseService);
    }

    mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateNoteDto): DeepPartial<NoteEntity> {
        return {
            title: createEntityDto.title,
            body: createEntityDto.body || null,
            user: {
                id: createEntityDto.user
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
