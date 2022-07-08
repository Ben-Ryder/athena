import { IsUUID } from 'class-validator';

export class QueriesURLParamsSchema {
    @IsUUID()
    queryId!: string;

    @IsUUID()
    vaultId!: string;
}
