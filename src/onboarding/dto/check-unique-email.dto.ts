import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckUniqueEmailDto {
  @ApiProperty({ example: "example@email.com" })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
