import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';


export class UpdateUserShape {
    @IsString()
    @IsOptional()
    username!: string;

    @IsEmail()
    @IsOptional()
    email!: string;

    @IsString()
    @MinLength(8)
    @IsOptional()
    password!: string;
}
