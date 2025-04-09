import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, IsDate, Matches, MinLength, MaxLength } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ example: "test@example.com" })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: "Test@123" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(6, { message: "Password must be at least 6 characters" })
  @Matches(/[A-Z]/, { message: "Password must include an uppercase letter" })
  @Matches(/[a-z]/, { message: "Password must include a lowercase letter" })
  @Matches(/\d/, { message: "Password must include a number" })
  @Matches(/[@$!%*?&]/, {
    message: "Password must include a special character",
  })
  password: string;
}
