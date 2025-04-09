import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsObject, ValidateNested } from "class-validator";

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

export class CreateCompanyDto {
  @ApiProperty({ example: "Tech Corp" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ example: "contact@techcorp.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "+1" })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: "US" })
  @IsString()
  @IsNotEmpty()
  countryShortName: string;

  @ApiProperty({ example: "1234567890" })
  @IsString()
  @IsNotEmpty()
  phone: string;

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
