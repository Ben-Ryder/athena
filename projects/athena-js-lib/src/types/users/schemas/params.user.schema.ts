import { IsUUID } from 'class-validator';

export class UserParamsSchema {
    @IsUUID()
    userId!: string;
}
