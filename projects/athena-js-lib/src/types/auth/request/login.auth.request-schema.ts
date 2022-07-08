import { IsString } from 'class-validator';


export class LoginRequestSchema {
    @IsString()
    username!: string;

    @IsString()
    password!: string;
}
