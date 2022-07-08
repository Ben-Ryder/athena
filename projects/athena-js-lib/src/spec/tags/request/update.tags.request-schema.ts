import {IsString, MinLength, IsOptional, IsHexColor, Contains} from 'class-validator';

// todo: generate from CreateTagRequestSchema as all fields are the same?
export class UpdateTagRequestSchema {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsHexColor()
  @Contains("#")
  @IsOptional()
  backgroundColour?: string;

  @IsHexColor()
  @Contains("#")
  @IsOptional()
  textColour?: string;
}
