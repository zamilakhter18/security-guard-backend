import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyOtpDto {
  @ApiProperty({ example: "test@example.com" })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: "1234" })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
