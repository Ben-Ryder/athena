import { Request, Response, NextFunction } from 'express';

import { Controller, Route, HTTPMethods } from '@kangojs/kangojs';
import { RequestWithDto } from "@kangojs/class-validation";

import { NotesService } from "./notes.service";
import { NoteDto } from "./dtos/notes.dto";
import { CreateNoteShape } from "./shapes/create.notes.shape";
import { UpdateNoteShape } from "./shapes/update.notes.shape";
import { NoteParamsShape } from './shapes/note-params.shape';


@Controller('/notes/v1')
export default class NotesController {
    constructor(
        private notesService: NotesService = new NotesService()
    ) {}

    @Route({
        httpMethod: HTTPMethods.GET,
    })
    async getAll(req: Request, res: Response, next: NextFunction) {
        let notes: NoteDto[] = [];

        try {
            notes = await this.notesService.getAll();
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
    async add(req: RequestWithDto, res: Response, next: NextFunction) {
        let newNote: NoteDto;

        try {
            newNote = await this.notesService.add(req.bodyDto);
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
    async get(req: RequestWithDto, res: Response, next: NextFunction) {
        let note: NoteDto | null;

        try {
            note = await this.notesService.get(req.paramsDto.noteId);
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
    async update(req: RequestWithDto, res: Response, next: NextFunction) {
        try {
            await this.notesService.update(req.paramsDto.noteId, req.bodyDto);
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
    async delete(req: RequestWithDto, res: Response, next: NextFunction) {
        try {
            await this.notesService.delete(req.paramsDto.noteId);
        }
        catch (e) {
            return next(e);
        }
        return res.send();
    }
}
