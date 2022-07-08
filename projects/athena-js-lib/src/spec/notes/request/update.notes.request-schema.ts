import {IsString, MinLength, IsOptional} from 'class-validator';
import {IsUUIDArray} from "../../../utils/is-uuid-array";

// todo: generate from CreateNoteRequestSchema as all fields are the same?
export class UpdateNoteRequestSchema {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsUUIDArray()
  @IsOptional()
  tags?: string[];
}
