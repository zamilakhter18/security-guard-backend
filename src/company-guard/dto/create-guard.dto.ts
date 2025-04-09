import { IsArray, IsEmail, IsISO8601, IsMongoId, IsNotEmpty, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Date, Types } from "mongoose";

export class CreateGuardsDto {
  @ApiProperty({ example: "John" })
  @IsNotEmpty({ message: "First name is required" })
  @IsString({ message: "First name must be a string" })
  firstName: string;

  @ApiProperty({ example: "Doe" })
  @IsNotEmpty({ message: "Last name is required" })
  @IsString({ message: "Last name must be a string" })
  lastName: string;

  @ApiProperty({ example: "example@email.com" })
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @ApiProperty({ example: "1990-01-01" })
  @IsNotEmpty({ message: "Date of birth is required" })
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: "Invalid date format, use YYYY-MM-DD",
  })
  dateOfBirth: string;

  @ApiProperty({ example: "65df1b2c3f8a4e001c5a7d5e", type: String })
  @IsMongoId({ message: "Invalid service ID format" })
  @IsNotEmpty({ message: "Service is required" })
  service: string | Types.ObjectId;
}
