import { IsArray, IsEmail, IsEnum, IsISO8601, IsMongoId, IsNotEmpty, IsOptional, isString, IsString, Matches, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Date, Types } from "mongoose";
import { userTypeEnum } from "src/helpers/constants";
import { Transform } from "class-transformer";
import ObjectId from 'mongoose';

export class UpdateUserDto {

  // @ApiProperty({ example: "John" })
  // @IsOptional()
  // @IsString({ message: "First name must be a string" })
  // firstName: string;

  // @ApiProperty({ example: "Doe" })
  // @IsOptional()
  // @IsString({ message: "Last name must be a string" })
  // lastName: string;

  // @ApiProperty({ example: "6612a15df9e5f53b58f6f123" })
  // @IsNotEmpty({message: "User ID is required"})
  // @IsMongoId()
  // @IsString()
  // userId: string;

  @ApiProperty({ example: "John Doe" })
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  fullName: string;

  @ApiProperty({ example: "test@example.com" })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  // @ApiProperty({
  //   example: "company",
  // })
  // @IsEnum([userTypeEnum.CLIENT, userTypeEnum.COMPANY], {
  //   message: "Invalid user type",
  // })
  // @IsNotEmpty({ message: "User type is required" })
  // userType: userTypeEnum;

  @ApiProperty({ example: "1990-01-01" })
  @IsOptional()
  @IsString({ message: "Date of birth must be string" })
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: "Invalid date format, use YYYY-MM-DD",
  })
  dateOfBirth: string;

  @ApiProperty({
    example: ["6612a15df9e5f53b58f6f123", "6612a15df9e5f53b58f6f456"],
    description: "Array of MongoDB ObjectIds representing selected services",
    required: false,
    type: [String],
  })
  @IsArray({message: "services must be array of ids"})
  @IsOptional()
  services: Array<string|mongoose.Types.ObjectId>;

  @ApiProperty({ example: "1234567890" })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "Phone number must be a valid international number (E.164 format).",
  })
  phone: string;

  @ApiProperty({ example: "+91" })
  @IsOptional()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: "" })
  @IsOptional()
  @IsString()
  profilePhoto: string;

  @ApiProperty({ example: "" })
  @IsOptional()
  @IsString()
  about: string;

  @ApiProperty({ example: "Male" })
  @IsOptional()
  @IsString()
  gender: string;

  // @ApiProperty({ example: "Test@123" })
  // @IsNotEmpty({ message: "Password is required" })
  // @MinLength(6, { message: "Password must be at least 6 characters" })
  // @Matches(/[A-Z]/, { message: "Password must include an uppercase letter" })
  // @Matches(/[a-z]/, { message: "Password must include a lowercase letter" })
  // @Matches(/\d/, { message: "Password must include a number" })
  // @Matches(/[@$!%*?&]/, {
  //   message: "Password must include a special character",
  // })
  // password: string;


}

export class UpdateBankAccountDto{

  @ApiProperty({ example: "John Doe" })
  @IsOptional()
  @IsString()
  receiptName: string;

  @ApiProperty({ example: "Bank of America" })
  @IsOptional()
  @IsString()
  bankName: string;

  @ApiProperty({ example: "123456789" })
  @IsOptional()
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: "987654321" })
  @IsOptional()
  @IsString()
  routingNumber: string;

  @ApiProperty({ example: "123 Main St" })
  @IsOptional()
  @IsString()
  street: string;

  @ApiProperty({ example: "Los Angeles" })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({ example: "California" })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({ example: "90001" })
  @IsOptional()
  @IsString()
  zipcode: string;

  @ApiProperty({ example: "USA" })
  @IsOptional()
  @IsString()
  country: string;
}