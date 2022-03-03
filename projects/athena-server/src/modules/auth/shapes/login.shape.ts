import { IsString } from 'class-validator';


export class LoginShape {
    @IsString()
    username!: string;

    @IsString()
    password!: string;
}
