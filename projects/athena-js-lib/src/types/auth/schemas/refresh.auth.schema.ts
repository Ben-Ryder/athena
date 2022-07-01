import { IsJWT } from 'class-validator';


export class RefreshSchema {
    @IsJWT()
    refreshToken!: string;
}
