import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsIn, IsEnum, IsOptional, IsEmail } from "class-validator";
import { loinTypeEnum } from "src/helpers/constants";

export class SocialAuthDto {
  @ApiProperty({ example: "TOKEN" })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: "google", enum: loinTypeEnum })
  @IsNotEmpty()
  @IsEnum(loinTypeEnum, { message: "Invalid login type" })
  type: loinTypeEnum;

  @ApiProperty({ example: "Zamil", description: "First Name" })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Akhter", description: "Last Name" })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ example: "abc@gmail.com", description: "Email" })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}
