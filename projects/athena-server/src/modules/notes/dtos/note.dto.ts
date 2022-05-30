import {UserEntity} from "../../users/database/users.database.entity";

export class NoteDto {
    id!: string;
    title!: string;
    body?: string | null;
    user!: UserEntity;
    createdAt!: Date;
    updatedAt!: Date;
}
