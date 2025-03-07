import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsObject, IsOptional } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Corp' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  contactName: string;

  @ApiProperty({ example: 'contact@techcorp.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: 'US' })
  @IsString()
  @IsNotEmpty()
  countryShortName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
    },
  })
  @IsObject()
  @IsNotEmpty()
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @ApiPropertyOptional({
    example: {
      type: 'Point',
      coordinates: [-73.935242, 40.73061],
    },
  })
  @IsObject()
  @IsOptional()
  location?: {
    type: string;
    coordinates: [number, number];
  };
}
