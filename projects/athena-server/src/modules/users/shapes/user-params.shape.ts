import { IsUUID } from 'class-validator';

export class UserParamsShape {
    @IsUUID()
    userId!: string;
}
