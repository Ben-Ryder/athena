import { IsString, IsEmail, MinLength } from 'class-validator';


export class CreateUserSchema {
    @IsString()
    username!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(8)
    password!: string;
}
