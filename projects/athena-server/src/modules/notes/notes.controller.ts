import { Response, NextFunction } from 'express';

import { Controller, Route, HTTPMethods } from '@kangojs/core';

import { NotesService } from "./notes.service";
import { RequestWithUser } from '../auth/auth.validator';

import { NoteDto } from "./dtos/note.dto";
import { CreateNoteShape } from "./shapes/create.notes.shape";
import { UpdateNoteShape } from "./shapes/update.notes.shape";
import { NoteParamsShape } from './shapes/note-params.shape';


@Controller('/notes/v1', {
    identifier: "notes-controller"
})
export class NotesController {
    constructor(
        private notesService: NotesService
    ) {}

    @Route({
        httpMethod: HTTPMethods.GET,
    })
    async getAll(req: RequestWithUser, res: Response, next: NextFunction) {
        let notes: NoteDto[] = [];

        try {
            notes = await this.notesService.getAll(req.user.id);
        }
        catch (e) {
            return next(e);
        }

        return res.send(notes);
    }

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateNoteShape
    })
    async add(req: RequestWithUser, res: Response, next: NextFunction) {
        let newNote: NoteDto;

        try {
            newNote = await this.notesService.add(req.user.id, req.body);
        }
        catch (e) {
            return next(e);
        }

        return res.send(newNote);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.GET,
        paramsShape: NoteParamsShape
    })
    async get(req: RequestWithUser, res: Response, next: NextFunction) {
        let note: NoteDto | null;

        try {
            note = await this.notesService.get(req.user.id, req.params.noteId);
        }
        catch (e) {
            return next(e);
        }

        return res.send(note);
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.PATCH,
        bodyShape: UpdateNoteShape,
        paramsShape: NoteParamsShape
    })
    async update(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            await this.notesService.update(req.user.id, req.params.noteId, req.body);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }

    @Route({
        path: '/:noteId',
        httpMethod: HTTPMethods.DELETE,
        paramsShape: NoteParamsShape
    })
    async delete(req: RequestWithUser, res: Response, next: NextFunction) {
        try {
            await this.notesService.delete(req.user.id, req.params.noteId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }
}
