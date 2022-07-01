import { UserDto } from "../../users/dtos/user.dto";

export interface NoteContent {
    title: string;
    body?: string | null;
}


export interface NoteDto extends NoteContent {
    id: string;
    user: UserDto;
    createdAt: Date;
    updatedAt: Date;
}
