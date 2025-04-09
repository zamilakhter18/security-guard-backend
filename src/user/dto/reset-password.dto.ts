import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
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

  @ApiProperty({ example: "user@example.com" })
  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;
}
