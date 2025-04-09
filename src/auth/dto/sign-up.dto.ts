import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsArray, IsDate, Matches, MinLength, IsMongoId } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { userTypeEnum } from "src/helpers/constants";

export class SignUpDto {
  @ApiProperty({ example: "test@example.com" })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: "John" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "43hjkhkjff98f67dsfh5" })
  @IsOptional()
  @IsMongoId()
  userId: string;

  @ApiProperty({
    example: "guard",
  })
  @IsEnum([userTypeEnum.GUARD], {
    message: "Invalid user type",
  })
  @IsOptional()
  userType: userTypeEnum;

  @ApiProperty({ example: "+91" })
  @IsOptional()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: "1234567890" })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be a valid international number (E.164 format).",
  })
  phone: string;

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
