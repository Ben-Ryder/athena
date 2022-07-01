import { IsString } from 'class-validator';


export class LoginSchema {
    @IsString()
    username!: string;

    @IsString()
    password!: string;
}
