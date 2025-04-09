import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsEmail, IsObject, ValidateNested, IsOptional } from "class-validator";

class AddressDto {
  @ApiProperty({ example: "123 Main St" })
  @IsString()
  street: string;

  @ApiProperty({ example: "New York" })
  @IsString()
  city: string;

  @ApiProperty({ example: "NY" })
  @IsString()
  state: string;

  @ApiProperty({ example: "10001" })
  @IsString()
  zip: string;

  @ApiProperty({ example: "USA" })
  @IsString()
  country: string;

  @ApiProperty({ example: "-74.006" })
  @IsString()
  longitude: string;

  @ApiProperty({ example: "40.7128" })
  @IsString()
  latitude: string;
}

export class UpdateCompanyDto {
  @ApiProperty({ example: "Tech Corp" })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: "John Doe" })
  @IsOptional()
  @IsString()
  contactName: string;

  @ApiProperty({ example: "contact@techcorp.com" })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "+1" })
  @IsOptional()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: "US" })
  @IsOptional()
  @IsString()
  countryShortName: string;

  @ApiProperty({ example: "1234567890" })
  @IsOptional()
  @IsString()
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
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({
    example: "10",
    description: "Minimum number of employees in the company",
  })
  @ApiProperty({ example: "10" })
  @IsOptional()
  @IsString()
  companyMinSize: string;

  @ApiProperty({
    example: "15",
    description: "Maximum number of employees in the company",
  })
  @ApiProperty({ example: "15" })
  @IsOptional()
  @IsString()
  companyMaxSize: string;

  @ApiProperty({
    example: "https://s3.amazonaws.com/bucket-name/uploads/logo.png",
    description: "URL of the company logo",
  })
  @IsOptional()
  @IsString()
  logo: string;
}
