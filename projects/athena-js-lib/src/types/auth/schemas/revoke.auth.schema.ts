import {IsJWT, IsOptional} from 'class-validator';


export class RevokeSchema {
    @IsJWT()
    @IsOptional()
    refreshToken?: string;

    @IsJWT()
    @IsOptional()
    accessToken?: string;
}
