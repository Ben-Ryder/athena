import {IsString, MinLength} from 'class-validator';
import {IsUUIDArray} from "../../../utils/is-uuid-array";


export class CreateNoteRequestSchema {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  body!: string;

  @IsUUIDArray()
  tags!: string[];
}
