import {IsString, MinLength, IsHexColor, Contains} from 'class-validator';


export class CreateTagRequestSchema {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsHexColor()
  @Contains("#")
  backgroundColour!: string;

  @IsHexColor()
  @Contains("#")
  textColour!: string;
}
