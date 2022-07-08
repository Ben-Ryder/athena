import { IsUUID } from 'class-validator';

export class VaultsURLParamsSchema {
    @IsUUID()
    vaultId!: string;
}
