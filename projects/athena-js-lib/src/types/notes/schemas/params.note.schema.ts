import { IsUUID } from 'class-validator';

export class NoteParamsSchema {
    @IsUUID()
    noteId!: string;
}
