import { Response, NextFunction } from 'express';

import { Controller, Route, HTTPMethods } from '@kangojs/core';

import { NotesService } from "./notes.service";
import { RequestWithUser } from '../auth/auth.validator';
import {
    CreateNoteRequestSchema,
    CreateNoteResponse,
    NoteDto,
    NotesQueryParamsSchema,
    NoteURLParamsSchema, UpdateNoteRequestSchema
} from "@ben-ryder/athena-js-lib";


@Controller('/notes/v1', {
    identifier: "notes-controller"
})
export class NotesController {
    constructor(
        private notesService: NotesService
    ) {}

    @Route({
        httpMethod: HTTPMethods.GET,
        queryShape: NotesQueryParamsSchema
    })
    async getList(req: RequestWithUser, res: Response, next: NextFunction) {
        let notes: NoteDto[] = [];

        try {
            notes = await this.notesService.getList(req.user.id);
        }
        catch (e) {
            return next(e);
        }

        return res.send(notes);
    }

    @Route({
        httpMethod: HTTPMethods.POST,
        bodyShape: CreateNoteRequestSchema
    })
    async add(req: RequestWithUser, res: Response, next: NextFunction) {
        let newNote: CreateNoteResponse;

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
        paramsShape: NoteURLParamsSchema
    })
    async get(req: RequestWithUser, res: Response, next: NextFunction) {
        let note: NoteDto;

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
        bodyShape: UpdateNoteRequestSchema,
        paramsShape: NoteURLParamsSchema
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
        paramsShape: NoteURLParamsSchema
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
