import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgetPasswordDto {
  @ApiProperty({ example: "user@example.com" })
  @IsNotEmpty()
  @IsEmail({}, { message: "Invalid email format" })
  email: string;
}
