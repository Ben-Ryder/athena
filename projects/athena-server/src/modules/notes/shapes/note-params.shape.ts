import { IsUUID } from 'class-validator';

export class NoteParamsShape {
    @IsUUID()
    noteId!: string;
}
