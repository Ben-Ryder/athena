
export class NoteDto {
    id!: string;
    title!: string;
    body?: string | null;
    user!: string;
    createdAt!: Date;
    updatedAt!: Date;
}
