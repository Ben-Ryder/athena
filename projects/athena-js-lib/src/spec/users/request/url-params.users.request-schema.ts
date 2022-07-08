import { IsUUID } from 'class-validator';

export class UsersURLParamsSchema {
    @IsUUID()
    userId!: string;
}
