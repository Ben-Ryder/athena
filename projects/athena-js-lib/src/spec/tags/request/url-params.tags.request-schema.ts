import { IsUUID } from 'class-validator';

export class TagsURLParamsSchema {
    @IsUUID()
    tagId!: string;

    @IsUUID()
    vaultId!: string;
}
