import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches } from "class-validator";

export class VerifyNumberDto {
  @ApiProperty({ example: "+1" })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: "1234567890" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be a valid international number (E.164 format).",
  })
  phone: string;
}
