import { IsJWT } from 'class-validator';


export class RefreshShape {
    @IsJWT()
    refreshToken!: string;
}
