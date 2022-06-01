import { NotesDatabaseRepository } from "./database/notes.database.repository";

import { CreateNoteDto } from "./dtos/create.note.dto";
import { UpdateNoteDto } from "./dtos/update.note.dto";
import { NoteDto } from './dtos/note.dto';
import { AccessDeniedError } from '@kangojs/core';
import { Injectable } from "@kangojs/core";


@Injectable()
export class NotesService {
    constructor(
       private notesDatabaseRepository: NotesDatabaseRepository
    ) {}

    checkAccess(requestUserId: string, note: NoteDto) {
        if (requestUserId !== note.user.id) {
            throw new AccessDeniedError({
                message: "Access denied to note"
            })
        }
    }

    async getAll(requestUserId: string) {
        return this.notesDatabaseRepository.getAll();
    }

    async get(requestUserId: string, noteId: string) {
        const note = await this.notesDatabaseRepository.getById(noteId);
        this.checkAccess(requestUserId, note);
        return note;
    }

    async add(requestUserId: string, createNoteDto: CreateNoteDto) {
        createNoteDto.user = requestUserId;
        return this.notesDatabaseRepository.add(createNoteDto);
    }

    async update(requestUserId: string, noteId: string, updateNoteDto: UpdateNoteDto) {
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
