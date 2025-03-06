import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsDate,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim().toLowerCase()) // Auto lowercase email
  email: string;
}
