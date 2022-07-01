import {IsString, IsOptional, Length} from 'class-validator';


export class UpdateNoteSchema {
    @IsString()
    @Length(1, 100)
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    body?: string;
}
