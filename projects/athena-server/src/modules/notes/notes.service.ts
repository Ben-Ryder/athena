import { NotesDatabaseRepository } from "./database/notes.database.repository";

import { AccessDeniedError } from '@kangojs/core';
import { Injectable } from "@kangojs/core";
import {CreateNoteRequestSchema, NoteDto, UpdateNoteRequestSchema} from "@ben-ryder/athena-js-lib";
import {DatabaseNoteDto} from "./dtos/database-note.dto-interface";
import {CreateDatabaseNoteDto} from "./dtos/create.database-note.dto-interface";


@Injectable()
export class NotesService {
    constructor(
       private notesDatabaseRepository: NotesDatabaseRepository
    ) {}

    // todo: check access via database query? (where userId rather than checking later)
    checkAccess(requestUserId: string, note: DatabaseNoteDto) {
        if (requestUserId !== note.userId) {
            throw new AccessDeniedError({
                message: "Access denied to note"
            })
        }
    }

    async getList(requestUserId: string) {
        return this.notesDatabaseRepository.getList(requestUserId);
    }

    async get(requestUserId: string, noteId: string) {
        const note = await this.notesDatabaseRepository.getById(noteId);
        this.checkAccess(requestUserId, note);
        return note;
    }

    async add(requestUserId: string, createNoteDto: CreateNoteRequestSchema) {
        const noteWithUser: CreateDatabaseNoteDto = {
            ...createNoteDto,
            userId: requestUserId
        }

        return this.notesDatabaseRepository.add(noteWithUser);
    }

    async update(requestUserId: string, noteId: string, updateNoteDto: UpdateNoteRequestSchema) {
        // todo: improve this, .getById already makes a database get request so this is doubling requests.
        const note = await this.notesDatabaseRepository.getById(noteId);
        this.checkAccess(requestUserId, note);
        await this.notesDatabaseRepository.update(noteId, updateNoteDto);
    }

    async delete(requestUserId: string, noteId: string) {
        // todo: improve this, .delete already makes a database get request so this is doubling requests.
        const note = await this.notesDatabaseRepository.getById(noteId);
        this.checkAccess(requestUserId, note);
        return this.notesDatabaseRepository.delete(noteId);
    }
}
