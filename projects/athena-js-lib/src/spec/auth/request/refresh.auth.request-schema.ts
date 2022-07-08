import { IsJWT } from 'class-validator';


export class RefreshRequestSchema {
    @IsJWT()
    refreshToken!: string;
}
