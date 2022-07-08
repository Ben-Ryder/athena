import { IsUUID } from 'class-validator';

export class NoteURLParamsSchema {
    @IsUUID()
    noteId!: string;

    @IsUUID()
    vaultId!: string;
}
