
export class NoteDto {
    id!: string;
    title!: string;
    body?: string | null;
    createdAt!: Date;
    updatedAt!: Date
}
