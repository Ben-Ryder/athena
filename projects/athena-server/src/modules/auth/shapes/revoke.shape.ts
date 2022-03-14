import { IsJWT } from 'class-validator';


export class RevokeShape {
    @IsJWT()
    refreshToken?: string;

    @IsJWT()
    accessToken?: string;
}
