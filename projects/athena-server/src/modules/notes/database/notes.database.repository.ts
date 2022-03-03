import { DeepPartial } from 'typeorm';
import { DatabaseRepository } from '../../../services/database/database.repository';

import { NoteEntity } from "./notes.database.entity";
import { NoteDto } from "../dtos/notes.dto";
import { CreateNoteDto } from "../dtos/create.notes.dto";
import { UpdateNoteDto } from "../dtos/update.notes.dto";


export class NotesDatabaseRepository extends DatabaseRepository<NoteEntity, NoteDto, CreateNoteDto, UpdateNoteDto>{
    mapCreateEntityDtoToDatabaseEntity(createEntityDto: CreateNoteDto): DeepPartial<NoteEntity> {
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
            updatedAt: databaseEntity.updatedAt
        };
    }

    mergeUpdateEntityDtoWithDatabaseEntity(databaseEntity: NoteEntity, updateEntityDto: UpdateNoteDto): DeepPartial<NoteEntity> {
        return {
            ...databaseEntity,
            ...updateEntityDto
        }
    }
}
