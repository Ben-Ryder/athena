import {IsJWT, IsOptional} from 'class-validator';

// todo: require at least one field to be passed?
export class RevokeRequestSchema {
    @IsJWT()
    @IsOptional()
    refreshToken?: string;

    @IsJWT()
    @IsOptional()
    accessToken?: string;
}
