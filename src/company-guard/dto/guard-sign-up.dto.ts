import { IsEmail, IsNotEmpty, IsObject, IsString, Matches, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

class AddressDto {
  @ApiProperty({ example: "123 Main St" })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: "New York" })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: "NY" })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ example: "10001" })
  @IsString()
  @IsNotEmpty()
  zip: string;

  @ApiProperty({ example: "USA" })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: "-74.006" })
  @IsString()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty({ example: "40.7128" })
  @IsString()
  @IsNotEmpty()
  latitude: string;
}

export class GuardSignUpDto {
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

  @ApiProperty({ example: "+91" })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: "9826543210" })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be a valid",
  }) // Ensures a valid phone format
  phone: string;

  @ApiProperty({ example: "1990-01-01" })
  @IsNotEmpty({ message: "Date of birth is required" })
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: "Invalid date format, use YYYY-MM-DD",
  })
  dateOfBirth: string;

  @ApiProperty({
    example: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      longitude: "40.7128",
      latitude: "74.0060",
    },
  })
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address: AddressDto;
}
