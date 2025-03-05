import { 
    IsEmail, 
    IsEnum, 
    IsNotEmpty, 
    IsOptional, 
    IsString, 
    IsArray, 
    IsDate, 
    Matches, 
    MinLength 
  } from 'class-validator';
  import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
  
  export class SignUpDto {
    @ApiProperty({ example: 'test@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => value.trim().toLowerCase()) // Auto lowercase email
    email: string;
  
    @ApiProperty({ example: 'John', description: 'First name of the user' })
    @IsString()
    @IsNotEmpty()
    firstName: string;
  
    @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
    @IsString()
    @IsNotEmpty()
    lastName: string;
  
    @ApiProperty({
      example: 'Test@123',
      description: 'User password (must contain at least 8 characters, one uppercase, one number, and one special character)',
    })
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    @Matches(/\d/, { message: 'Password must contain at least one number' })
    @Matches(/[@$!%*?&]/, { message: 'Password must contain at least one special character' })
    password: string;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    socialProviders?: string[];
  
    @IsOptional()
    @IsString()
    socialLoginType?: string;
  
    @IsOptional()
    @Type(() => Date) // Ensure date transformation
    @IsDate()
    dateOfBirth?: Date;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    services?: string[]; // Array of service names
  
    @IsOptional()
    @IsString()
    profilePhoto?: string;
  
    @IsOptional()
    @IsString()
    @Matches(/^\d+$/, { message: 'Phone number must contain only digits' })
    phoneNumber?: string;
  
    @IsOptional()
    @IsString()
    countryCode?: string;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsString()
    socialSecurityNumber?: string;
  
    @IsOptional()
    @IsString()
    otp?: string;
  
    @IsOptional()
    @IsString()
    about?: string;
  }
  