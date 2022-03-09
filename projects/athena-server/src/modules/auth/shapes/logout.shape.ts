import { IsJWT } from 'class-validator';


export class LogoutShape {
    @IsJWT()
    refreshToken!: string;

    @IsJWT()
    accessToken?: string;
}
