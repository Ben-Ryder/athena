import { IsJWT } from 'class-validator';


export class CheckShape {
    @IsJWT()
    token!: string;
}
